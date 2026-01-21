import express from 'express'
import {createRoom, toggleRoom, getActiveRooms, getAllRooms, deleteRoom} from '../controllers/room.controller.js';
import auth from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/role.middleware.js'

const router = express.Router();

//Admin only
router.post("/", auth, isAdmin, createRoom);
router.patch("/:id/toggle", auth, isAdmin, toggleRoom);
router.get("/all", auth, isAdmin, getAllRooms);
router.delete("/:id", auth, isAdmin, deleteRoom);



// user
router.get("/active", auth, getActiveRooms);

export default router