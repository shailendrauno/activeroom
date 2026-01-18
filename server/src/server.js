import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
connectDB();

const { default: app } = await import("./app.js");


const PORT = process.env.PORT || 500;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
    
})