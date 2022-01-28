const socket = io(); // front와 back 연결

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;
let roomName;

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
    });
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("set_nickname", roomName, input.value);
    room.querySelector("#name").hidden = true;
    room.querySelector("#msg").hidden = false;
    const messageForm = room.querySelector("#msg");
    messageForm.addEventListener("submit", handleMessageSubmit);
}

function joinRoom(msg) {
    console.log(`backend server is done <${msg}>`);
    room.hidden = false;
    welcome.hidden = true;
    const room_title = room.querySelector("h3");
    room_title.innerText = `Room Name : [ ${roomName} ]`;
    const nameForm = room.querySelector("#name");
    room.querySelector("#msg").hidden = true;
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, joinRoom);
    roomName = input.value;
    input.value = ""
}

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (nickname) => {
    addMessage(`${nickname} Someone joined!`);
});

socket.on("bye", (nickname) => {
    addMessage(`${nickname} Someone left!`);
});

socket.on("new_message", addMessage);