import mongoose from "mongoose";
import config from "./config.js";

function ConnectDB() {
    mongoose.connect(config.MONGODB)
        .then(() => {
            console.log('MONGODB is connected successfully');
        })
        .catch(err => {
            console.log('MONGODB is Connection faild');
            process.exit(1)
        })
}
export default ConnectDB;