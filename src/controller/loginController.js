
import passport from 'passport'
import { Strategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { DAOusers } from '../persistence/factory.js'
import { errorLogger } from '../logger.js'

const isValidPassword = async (dbPassword, loginPassword) => {
    return await bcrypt.compare(loginPassword, dbPassword)
}

passport.use('login', new Strategy(
    async (username, password, done) => {
        const user = await DAOusers.getByUser(username)
        if (!user) {
            errorLogger.error('Usuario no existe')
            return done(null, false)
        }
        const validPassword = await isValidPassword(user.password, password)
        if (!validPassword) {
            errorLogger.error('Clave no válida')
            return done(null, false)
        }
        return done(null, user.user)
    })
)

const loginController = () => {
    return passport.authenticate('login', {
        successRedirect: '/api/home',
        failureRedirect: '/api/login/faillogin'
    })
}

export default loginController