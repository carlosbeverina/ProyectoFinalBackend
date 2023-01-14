//****** Objetivo del archivo ********
// Este archivo contiene toda la funcionalidad para el funcionamiento del chat que es cargado como script en el arhivo ./views/chatUser.ejs

const socket = io().connect();

let user = document.getElementById("user").innerText;
console.log(user);

// Funcion para cargar mensajes en el contenedor de chat.ejs
function view(messages) {
  let html = [];
  const mens = document.getElementById("mensajes");
  if (messages.length > 0) {
    //Filtra los mensajes dejando solo los enviados por el usuario
    let msgs = messages.filter((msg) => msg.email == user);
    html = msgs
      .map((msg) => {
        return `<strong style="color: blue">${msg.email}:</span> <em style="color: green">${msg.message}</em>`;
      })
      .join("<br>");
  } else {
    html = `<h2>No hay mensajes</h2>`;
  }
  mens.innerHTML = html;
}

//Recibe mensajes del Websockets y los muestra
socket.on("message-server", (messages) => {
  view(messages);
});
