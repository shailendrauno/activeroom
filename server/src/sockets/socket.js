import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';


const initSocket = (io)=> {
    io.use(async (socket, next)=> {
        try {
            const token = socket.handshake.auth?.token;
            if(!token) return next(new Error("No token"));


            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if(!user) return next(new Error("User not found"));

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Socket auth failed"))
        }
    });

    io.on("connection", (socket)=> {
        console.log("User conected", socket.user.name);

        socket.on("join_room", async (roomId)=> {
            if(!roomId) return ;

            socket.join(roomId);
            console.log(`${socket.user.name} joined room ${roomId}`);
            
            // load last 50 messageb 

            const message = await Message.find({  roomId  })
                .sort({  createdAt: -1  })
                .limit(50)
                .lean();

            // send old message to only the user

            socket.emit("old_message", message.reverse());

        });

        socket.on("send_message", async ({roomId, text})=> {
            if(!roomId || !text) return ;

            const msg = await Message.create({
                roomId,
                senderId: socket.user._id,
                senderName: socket.user.name,
                type: "text",
                content: text,
            });

            io.to(roomId).emit("new_message", msg);
        });

        socket.on("disconnect", ()=> {
            console.log("User is disconnected", socket.user.name);
            
        });
        
    });


};

export default initSocket;