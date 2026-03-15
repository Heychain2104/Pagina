// =======================
// CONFIG
// =======================
const API = "https://pagina-nutl.onrender.com";
let currentUser = null;

// conectar socket al backend
const socket = io(API);

// =======================
// REGISTRO
// =======================
function registerUser() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const avatarFile = document.getElementById("reg-avatar").files[0];

  if (!username || !password || !avatarFile) {
    alert("Completa todos los campos");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        avatar: reader.result
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Usuario creado");
        loginUserAfterRegister(username, password);
      } else {
        alert(data.msg);
      }
    })
    .catch(err => console.error(err));
  };
  reader.readAsDataURL(avatarFile);
}

// =======================
// LOGIN AUTOMÁTICO
// =======================
function loginUserAfterRegister(username, password) {
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      window.location.href = "main.html";
    }
  })
  .catch(err => console.error(err));
}

// =======================
// LOGIN
// =======================
function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Completa todos los campos");
    return;
  }

  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      window.location.href = "main.html";
    } else {
      alert(data.msg);
    }
  })
  .catch(err => console.error(err));
}

// =======================
// LOGOUT
// =======================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// =======================
// CARGAR USUARIO
// =======================
if (window.location.pathname.includes("main.html")) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!storedUser) {
    window.location.href = "index.html";
  } else {
    currentUser = storedUser;
    const userInfo = document.getElementById("user-info");
    if (userInfo) {
      userInfo.innerHTML = `<img src="${currentUser.avatar}" width="40" style="border-radius:50%"> ${currentUser.username}`;
    }
  }
}

// =======================
// ENVIAR MENSAJE
// =======================
function sendMessage() {
  const input = document.getElementById("new-message");
  const text = input.value.trim();
  if (!text || !currentUser) return;

  socket.emit("send message", {
    username: currentUser.username,
    avatar: currentUser.avatar,
    text
  });

  input.value = "";
}

// =======================
// RECIBIR MENSAJES
// =======================
function addMessage(msg) {
  const messagesDiv = document.getElementById("messages");
  if (!messagesDiv) return;

  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <img src="${msg.avatar}" width="30" style="border-radius:50%">
    <strong>${msg.username}</strong>: ${msg.text || msg.message || ""}
  `;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// cargar mensajes existentes al conectar
socket.on("load messages", msgs => {
  msgs.forEach(addMessage);
});

// recibir nuevos mensajes en tiempo real
socket.on("new message", msg => {
  addMessage(msg);
});

// confirmar conexión
socket.on("connect", () => {
  console.log("Conectado al servidor");
});
