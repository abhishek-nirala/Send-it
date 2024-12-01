import mongoose from "mongoose";

type ConnectionObject = {
    isConnect?: number;
}
const connection: ConnectionObject = {}

const {username,password} = process.env
const connectionStr = `mongodb+srv://${username}:${password}@cluster0.9eksm.mongodb.net/feedbackApp?retryWrites=true&w=majority&appName=Cluster0`

async function dbConnect(): Promise<void> {
    if (connection.isConnect) {
        console.log("db already connected");
        return;
    }
    try {
        const db = await mongoose.connect(connectionStr || '')
        console.log('db : ', db)
        connection.isConnect = db.connections[0].readyState
        console.log("db connected successfully");

    } catch (error) {
        console.log("db not connected",error)
        process.exit(1)
    }
}

export default dbConnect;