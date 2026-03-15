function registerUser() {

const username = document.getElementById("reg-username").value;
const password = document.getElementById("reg-password").value;
const avatarFile = document.getElementById("reg-avatar").files[0];

if (!username || !password || !avatarFile) {
alert("Completa todos los campos");
return;
}

const reader = new FileReader();

reader.onload = function() {

fetch("/register", {
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
alert("Usuario creado");
} else {
alert(data.msg);
}

});

};

reader.readAsDataURL(avatarFile);

}
