import Room from '../models/Room.js'

// admin create room

export const createRoom = async (req,res) => {
    try {
        const {name, description} = req.body;
        if(!name || !description) return res.status(400).json({message: "The name and description is required"});

        const room = await Room.create({
            name,
            description,
            createdBy: req.user._id,
            isActive: true
        });

        res.status(200).json(room)

    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// admin togle the room status

export const toggleRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        if(!room) return res.status(404).json({message: "Room not found"});

        room.isActive = !room.isActive;
        await room.save();

        res.json({message: "room status updated", room})

    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// user get only active group

export const getActiveRooms = async (req,res) => {
    try {
        const room = await Room.find({isActive: true}).select("name description");
        res.json(room)
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// admin get all active rooms

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate("createdBy", "name email");
        res.json(rooms)
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};