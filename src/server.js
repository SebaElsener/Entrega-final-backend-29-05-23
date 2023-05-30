
import express from 'express'
import { createServer } from "http"
import { Server } from "socket.io"
import session from 'express-session'
import MongoStore from 'connect-mongo'
import MessageRepository from './persistence/repository/messageRepository.js'
import userLogin from './router/userLogin.js'
import homeRoute from './router/homeRoute.js'
import userReg from './router/userReg.js'
import passport from 'passport'
import routeProducts from './router/productsRouter.js'
import routeCart from './router/cartRouter.js'
import userLogout from './router/userLogout.js'
import userLoginWatcher from './middleware/userLoginWatcher.js'
import _yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import dotenv from 'dotenv'
import infoAndRandoms from './router/infoAndRandoms.js'
import cluster from 'cluster'
import * as os from 'os'
import compression from 'compression'
import routeError from './middleware/routeError.js'
import { logs } from './middleware/logs.js'
import userData from './router/userData.js'
import { infoLogger, errorLogger } from './logger.js'
import SessionStore from '../utils/chatSessionStorage.js'
import crypto from 'crypto'

dotenv.config()

const yargs = _yargs(hideBin(process.argv))
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const messages = MessageRepository.getInstance()

app.set('view engine', 'ejs')
app.set('views', './public/views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(compression())
app.use(session({
    store: MongoStore.create({
        dbName: 'sessions',
        mongoUrl: process.env.MONGOURI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }}),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: parseInt(process.env.SESSION_TIME)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user)
  })
passport.deserializeUser((user, done) => {
    done(null, user)
})
app.use(passport.initialize())
app.use(passport.session())

// Middleware para registrar todas la peticiones recibidas
app.use(logs)

// Rutas api
app.use('/', userLogin)
app.use('/api/productos', userLoginWatcher, routeProducts)
app.use('/api/carrito', userLoginWatcher, routeCart)
app.use('/api/userdata', userLoginWatcher, userData)
app.use('/api/login', userLogin)
app.use('/api/logout', userLogout)
app.use('/api/register', userReg)
app.use('/api/home', homeRoute)
app.use('/api/', infoAndRandoms)

const sessionStore = new SessionStore()
const randomId = () => crypto.randomBytes(8).toString("hex")
io.use((socket, next) => {
    infoLogger.info(`Nuevo cliente conectado!`)

    const sessionID = socket.handshake.auth.sessionID
    if (sessionID) {
      // find existing session
      const session = sessionStore.findSession(sessionID)
      if (session) {
        socket.sessionID = sessionID
        socket.userID = session.userID
        socket.username = session.username
        return next()
      }
    }
    const username = socket.handshake.auth.username
    //create new session
    socket.sessionID = randomId()
    socket.userID = randomId()
    socket.username = username
    next()
  })

// Middleware para mostrar error al intentar acceder a una ruta/método no implementados
app.use(routeError)

io.on('connection', async socket => {
    sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
      })

    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    })

    // join the "userID" room
    socket.join(socket.userID)

    // Almacenamiento de usuarios que se van conectando
    const users = []
    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            userID: session.userID,
            username: session.username
        })
    })
    // Envío de usuarios conectados
    io.sockets.emit('connectedUsers', users)

    // Escuchando y guardando nuevos mensajes
    socket.on('newMessage', async data => {
        const { newMessage, receiverID, receiver, sender } = data
        const dataToStore =
            {
                ...newMessage,
                from: sender,
                to: receiver
            }
        await messages.save(dataToStore)
        const allMssgs = await messages.getAll()
        let mssgs = []
        for (let mssg of allMssgs){
            if (mssg.from === sender && mssg.to === receiver) { mssgs.push(mssg) }
            if (mssg.from === receiver && mssg.to === sender) { mssgs.push(mssg) }
        }

        io.to(receiverID).to(socket.userID).emit('newMessage', {
            newMessage: mssgs
        })
    })
})

const { PORT, clusterMode } = yargs
    .alias({
        p: 'PORT',
        m: 'clusterMode'
    })
    .default({
        PORT: 8080,
        clusterMode: 'FORK'
    })
    .argv

if (clusterMode === 'CLUSTER' && cluster.isPrimary) {
    const CPUsQty = os.cpus().length

    infoLogger.info('SERVIDOR PRIMARIO DEL CLUSTER')
    infoLogger.info('Número de procesadores: ' + CPUsQty)
    infoLogger.info('PID:' + process.pid)

    for (let i = 0; i < CPUsQty; i++) {
        cluster.fork()
    }
    cluster.on('exit', worker => {
        infoLogger.info(`Worker ${worker.process.pid} died on ${new Date().toLocaleString()}`)
        cluster.fork()
    })
} else {
    const connectedServer = httpServer.listen(PORT, () => {
        infoLogger.info(`http server escuchando en puerto ${connectedServer.address().port}`)
    })
    connectedServer.on('error', error => errorLogger.error(`Error en servidor ${error}`))
}