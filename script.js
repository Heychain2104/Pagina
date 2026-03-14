// Verifica si hay usuario logueado
if (window.location.pathname.endsWith("main.html")) {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session) {
    window.location.href = "index.html";
  } else {
    document.getElementById("user-info").innerHTML = `
      <img src="${session.avatar}" alt="Avatar"> ${session.username}
    `;
    loadMessages();
  }
}

// Función de registro
function registerUser() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const avatarInput = document.getElementById("reg-avatar");

  if (!username || !password || !avatarInput.files[0]) {
    document.getElementById("message").textContent = "Completa todos los campos";
    return;
  }

  const reader = new FileReader();
  reader.onload = function() {
    const avatar = reader.result;

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    // Verifica si usuario ya existe
    if (users.find(u => u.username === username)) {
      document.getElementById("message").textContent = "Usuario ya existe";
      return;
    }

    users.push({ username, password, avatar });
    localStorage.setItem("users", JSON.stringify(users));

    // Inicia sesión automáticamente
    localStorage.setItem("session", JSON.stringify({ username, avatar }));
    window.location.href = "main.html";
  }
  reader.readAsDataURL(avatarInput.files[0]);
}

// Función de login
function loginUser() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    document.getElementById("message").textContent = "Usuario o contraseña incorrectos";
    return;
  }

  localStorage.setItem("session", JSON.stringify({ username: user.username, avatar: user.avatar }));
  window.location.href = "main.html";
}

// Función de logout
function logout() {
  localStorage.removeItem("session");
  window.location.href = "index.html";
}

// Mensajes del foro
function sendMessage() {
  const messageInput = document.getElementById("new-message");
  const text = messageInput.value.trim();
  if (!text) return;

  const session = JSON.parse(localStorage.getItem("session"));
  let messages = JSON.parse(localStorage.getItem("messages") || "[]");

  messages.push({ username: session.username, avatar: session.avatar, text });
  localStorage.setItem("messages", JSON.stringify(messages));
  messageInput.value = "";
  loadMessages();
}

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("messages") || "[]");
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<img src="${msg.avatar}" alt="Avatar"> <strong>${msg.username}</strong>: ${msg.text}`;
    messagesDiv.appendChild(div);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
