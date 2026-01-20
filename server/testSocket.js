import { io } from 'socket.io-client';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmM5NTg2NmI0YTQ3MWI3MTQ5YWQyZSIsImlhdCI6MTc2ODczMjAxMSwiZXhwIjoxNzY5MzM2ODExfQ.TGxs4StdM1sMJ-cNDq2ffn9J28NN425fm2X6elzC63g";
const ROOM_ID = "696cb500d770ed592c501438";


const socket = io('http://localhost:5000', {
    auth: { token }
});

socket.on("connect", () => {
    console.log("conneected with id: ", socket.id);
    socket.emit("join_room", ROOM_ID);

});

socket.on("old_message", (msg) => {
    console.log("old message");
    msg.forEach(m => {
        console.log(`${m.senderName}: ${m.content}`);
        
    });
    
});



socket.on("new_message", (msg) => {
    console.log("new message", msg);

});

socket.on("disconnect", () => {
    console.log("Disconnected");

});