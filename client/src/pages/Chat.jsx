import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Chat = () => {
  const { roomId } = useParams();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const fileRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_room", roomId);

    socket.on("old_message", setMessages);
    socket.on("new_message", (msg) => setMessages((p) => [...p, msg]));
    socket.on("user_typing", (d) => setTypingUser(d.name));
    socket.on("user_stop_typing", () => setTypingUser(""));
    socket.on("online_users", setOnlineUsers);

    return () => socket.off();
  }, [socket, roomId]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send_message", { roomId, text });
    setText("");
    socket.emit("stop_typing", { roomId });
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { roomId });
    if (!e.target.value) socket.emit("stop_typing", { roomId });
  };

  const sendImage = async (file) => {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post("/upload/image", form);
    socket.emit("send_image", { roomId, imageUrl: res.data.url });
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Online users */}
      <div className="w-64 bg-white border-r p-4 hidden md:block">
        <h2 className="font-bold mb-3">Online Users</h2>
        <div className="space-y-2">
          {onlineUsers.map((u) => (
            <div key={u.userId} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {getInitials(u.name)}
              </div>
              <span className="text-sm">{u.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b p-3 font-semibold">
          Chat Room
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isMe = m.senderId === user.id;
            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="flex gap-2 max-w-xs">
                  {!isMe && (
                    <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {getInitials(m.senderName)}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-3 text-sm shadow ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {!isMe && (
                      <div className="text-xs font-semibold mb-1">
                        {m.senderName}
                      </div>
                    )}
                    {m.type === "text" ? (
                      <p>{m.content}</p>
                    ) : (
                      <img
                        src={m.content}
                        alt="img"
                        className="rounded max-w-xs"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {typingUser && (
            <div className="text-sm text-gray-500">
              {typingUser} is typing...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t flex items-center gap-2">
          <textarea
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 border rounded-lg px-3 py-2 resize-none"
          />

          <input
            type="file"
            hidden
            ref={fileRef}
            onChange={(e) => sendImage(e.target.files[0])}
          />

          <button
            onClick={() => fileRef.current.click()}
            className="px-3 py-2 bg-gray-200 rounded"
          >
            📷
          </button>

          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
