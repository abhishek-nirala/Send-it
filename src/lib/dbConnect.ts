import mongoose from "mongoose";

type ConnectionObject = {
    isConnect?: number;
}
const connection: ConnectionObject = {}

const username= process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD
// console.log(username, password);

const connectionStr = `mongodb+srv://${username}:${password}@cluster0.9eksm.mongodb.net/feedbackApp?retryWrites=true&w=majority&appName=Cluster0`

async function dbConnect(): Promise<void> {
    if (connection.isConnect) {
        console.log("DATABASE ALREADY CONNECTED");
        return;
    }

    try {
        const db = await mongoose.connect(connectionStr || '')
        // console.log('db : ', db)
        connection.isConnect = db.connections[0].readyState
        console.log("DATABASE CONNECTED");

    } catch (error) {
        console.log("DATABASE NOT CONNECTED",error)
        process.exit(1)
    }
}

export default dbConnect;