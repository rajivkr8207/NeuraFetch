import app from './src/app.js'
import config from './src/config/config.js'
import ConnectDB from './src/config/database.js'
// import { itemQueue } from './src/queues/itemQueue.js';
// import './src/workers/itemsworkers.js'
// await itemQueue.add("test", { hello: "world" });
const PORT = config.PORT
ConnectDB()
app.listen(PORT, () => {
    console.log(`server is runing on ${PORT} port`);
})