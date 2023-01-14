//****** Objetivo del archivo ********
// Este archivo contiene toda la funcionalidad para el funcionamiento del chat que es cargado como script en el arhivo ./views/chat.ejs

const socket = io().connect();

let boton = document.getElementById("enviar");

function test() {
  alert("prueba");
}
// Funcion para agregar mensajes al servidor
function addMessage() {
  const email = document.getElementById("email").value;
  const message = document.getElementById("msg").value;
  //Diferencia si el usuario que envia es el sistema o un usuario
  let type = "Usuario";
  if (email == "Sistema") {
    type = "Sistema";
  }
  if (email.length <= 3) {
    alert("Debe completar el usuario");
    return false;
  }
  let datetime = new Date().toLocaleString();
  const newMsg = { email, datetime, message, type };
  document.getElementById("msg").value = "";
  socket.emit("add-message", newMsg);
  return false;
}
// Funcion para cargar mensajes en el contenedor de chat.ejs
function view(messages) {
  let html = [];
  const mens = document.getElementById("mensajes");
  if (messages.length > 0) {
    html = messages
      .map((msg) => {
        return `<strong style="color: blue">${msg.email}:</span> <em style="color: green">${msg.message}</em>`;
      })
      .join("<br>");
  } else {
    html = `<h2>No hay mensajes</h2>`;
  }
  mens.innerHTML = html;
}

boton.addEventListener("click", addMessage);

//Recibe mensajes del Websockets y los muestra
socket.on("message-server", (messages) => {
  view(messages);
});
