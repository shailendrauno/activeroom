import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmM5NTg2NmI0YTQ3MWI3MTQ5YWQyZSIsImlhdCI6MTc2ODczMjAxMSwiZXhwIjoxNzY5MzM2ODExfQ.TGxs4StdM1sMJ-cNDq2ffn9J28NN425fm2X6elzC63g";
const ROOM_ID = "696cb500d770ed592c501438";

const socket = io("http://localhost:5000", {
  auth: { token },
});

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);

  socket.emit("join_room", ROOM_ID);

  // simulate typing after 2 sec
  setTimeout(() => {
    console.log("Typing...");
    socket.emit("typing", { roomId: ROOM_ID });
  }, 2000);

  // stop typing after 5 sec
  setTimeout(() => {
    console.log("Stop typing");
    socket.emit("stop_typing", { roomId: ROOM_ID });
  }, 5000);
});

// old messages
socket.on("old_messages", (msgs) => {
  console.log("Old messages:");
  msgs.forEach(m => {
    console.log(`${m.senderName}: ${m.content}`);
  });
});

// new message
socket.on("new_message", (msg) => {
  console.log("New message:", msg);
});

// typing indicator from others
socket.on("user_typing", (data) => {
  console.log(`${data.name} is typing...`);
});

socket.on("user_stop_typing", (data) => {
  console.log(`User stopped typing: ${data.userId}`);
});

// online user
socket.on("online_users", (users) => {
  console.log("Online users:");
  users.forEach(u => console.log(u.name));
});


socket.on("disconnect", () => {
  console.log("Disconnected");
});
