
const socket = io.connect()

const messagesForm = document.getElementById('messagesForm')
const userEmail = document.getElementById('userEmail')
const userName = document.getElementById('userName')
const userPhone = document.getElementById('userPhone')
const userAge = document.getElementById('userAge')
const userAddress = document.getElementById('userAddress')
const userAvatar = document.getElementById('userAvatar')
const messageContent = document.getElementById('messageContent')
const messagesContainer = document.getElementById('messagesContainer')
const messagesCenterTitle = document.getElementsByClassName('messagesCenterTitle')

//  Envio nuevo mensaje al servidor
messagesForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // La info del user se obtiene a través de un div con display=none pasado como parámetro por ejs
    newMessage = {
        author: {
            id: userEmail.innerText,
            nombre: userName.innerText,
            edad: userAge.innerText,
            direccion: userAddress.innerText,
            telefono: userPhone.innerText,
            avatar: userAvatar.innerText
        },
        text: messagesForm[0].value,
        date: new Date().toLocaleString()
    }
    socket.emit('newMessage', newMessage)
    messagesForm.reset()
})

//  Schema normalización mensajes
const authorSchema = new normalizr.schema.Entity('author')
const postSchema = new normalizr.schema.Entity('post', { author: authorSchema }, { idAttribute: '_id' })
const postsSchema = new normalizr.schema.Entity('posts', { mensajes: [postSchema] })

// Escuchando listado mensajes enviado por el servidor
socket.on('allMessages', data => {
    const { normalizedMessages, originalDataLength } = data
    const denormalizedMessages = normalizr.denormalize(normalizedMessages.result, postsSchema, normalizedMessages.entities)
    const normalizedMessagesLength = JSON.stringify(normalizedMessages).length
    let compressionRatio
    originalDataLength === 2
        ? compressionRatio = 0
        : compressionRatio = ((normalizedMessagesLength * 100) / originalDataLength).toFixed(2)
    messagesCenterTitle[0].innerText = `Centro de Mensajes - Compresión: ${compressionRatio}%`
    const msgMapping = denormalizedMessages.mensajes.map(message => {
        return `<div id='messagesDiv'>
                    <div class='userDataContainer'>
                    <div class='userImgContainer'>
                        <img class='userImg' src='${message.author.avatar}' alt='[avatar usuario ${message.author.id}]' width='30px'>
                    </div>
                    <b style="color: blue" class='msgAuthor'>${message.author.id}</b>
                    <span style="color: brown">[ ${message.date} ]</span>
                    </div>
                    <div class='textContainer'>
                    <i style="color: green">=>  ${message.text}</i>
                    </div>
                </div>`
    })
    messagesContainer.innerHTML = msgMapping.join(' ')
})