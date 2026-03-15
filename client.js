const API = "https://pagina-nutl.onrender.com"

let currentUser = null

// conectar socket al backend
const socket = io(API)


// =======================
// REGISTRO
// =======================

function registerUser() {

const username = document.getElementById("reg-username").value
const password = document.getElementById("reg-password").value
const avatarFile = document.getElementById("reg-avatar").files[0]

if (!username || !password || !avatarFile) {
alert("Completa todos los campos")
return
}

const reader = new FileReader()

reader.onload = function() {

fetch(API + "/register", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
username: username,
password: password,
avatar: reader.result
})
})
.then(res => res.json())
.then(data => {

if(data.success){

alert("Usuario creado")

// login automático
loginUserAfterRegister(username, password)

}else{

alert(data.msg)

}

})

}

reader.readAsDataURL(avatarFile)

}



// =======================
// LOGIN AUTOMATICO
// =======================

function loginUserAfterRegister(username, password){

fetch(API + "/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
username: username,
password: password
})
})
.then(res => res.json())
.then(data => {

if(data.success){

localStorage.setItem("currentUser", JSON.stringify(data.user))

window.location.href = "main.html"

}

})

}



// =======================
// LOGIN
// =======================

function loginUser(){

const username = document.getElementById("login-username").value
const password = document.getElementById("login-password").value

fetch(API + "/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
username: username,
password: password
})
})
.then(res => res.json())
.then(data => {

if(data.success){

localStorage.setItem("currentUser", JSON.stringify(data.user))

window.location.href = "main.html"

}else{

alert(data.msg)

}

})

}



// =======================
// LOGOUT
// =======================

function logout(){

localStorage.removeItem("currentUser")

window.location.href = "index.html"

}



// =======================
// CARGAR USUARIO
// =======================

if(window.location.pathname.includes("main.html")){

const storedUser = JSON.parse(localStorage.getItem("currentUser"))

if(!storedUser){

window.location.href = "index.html"

}else{

currentUser = storedUser

const userInfo = document.getElementById("user-info")

if(userInfo){

userInfo.innerHTML =
`<img src="${currentUser.avatar}" width="40" style="border-radius:50%"> ${currentUser.username}`

}

}

}



// =======================
// ENVIAR MENSAJE
// =======================

function sendMessage(){

const input = document.getElementById("new-message")

const text = input.value.trim()

if(!text) return

socket.emit("send message", {
username: currentUser.username,
avatar: currentUser.avatar,
text: text
})

input.value = ""

}



// =======================
// RECIBIR MENSAJES
// =======================

const messagesDiv = document.getElementById("messages")

socket.on("load messages", msgs => {

msgs.forEach(addMessage)

})


socket.on("new message", msg => {

addMessage(msg)

})



function addMessage(msg){

if(!messagesDiv) return

const div = document.createElement("div")

div.classList.add("message")

div.innerHTML =
`<img src="${msg.avatar}" width="30" style="border-radius:50%"> 
<strong>${msg.username}</strong>: ${msg.text}`

messagesDiv.appendChild(div)

messagesDiv.scrollTop = messagesDiv.scrollHeight

}
