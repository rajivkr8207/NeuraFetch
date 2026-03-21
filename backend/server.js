import app from './src/app.js'
import config from './src/config/config.js'
import ConnectDB from './src/config/database.js'
import http from 'http'
import { initSocket } from './src/socket/server.socket.js';
// import { itemQueue } from './src/queues/itemQueue.js';
// import './src/workers/itemsworkers.js'
// await itemQueue.add("test", { hello: "world" });


const httpserver = http.createServer(app);
const PORT = config.PORT
initSocket(httpserver)
ConnectDB()
httpserver.listen(PORT, () => {
    console.log(`server is runing on ${PORT} port`);
})