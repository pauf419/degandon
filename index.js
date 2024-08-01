require('dotenv').config({path: `.${process.env.NODE_ENV}.env`})
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const path = require("path")
const resValidator = require("./middlewares/validator.middleware");
const http = require('http')
const { Server } = require("socket.io")
const fileupload = require("express-fileupload")

const pool = require('./db/postgress-pool');
const prescript = require('./utils/prescript');
const SocketComposer = require('./utils/socket-composer');
const authMiddleware = require('./middlewares/auth-middleware');
const wsMiddleware = require('./middlewares/ws-middleware');
const ssMiddleware = require("./middlewares/ss.middleware");
const socketController = require('./controllers/socket-contoller');

const PORT = process.env.PORT || 5000;
const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: { 
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
})

app.use(fileupload())
app.use("/static", express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    credentials: true, 
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(resValidator) 

if(process.env.NODE_ENV === 'prod') {
    app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
    })
}

io.use(ssMiddleware)

io.on('connection', socket => {
    socketController.handleSocketConnection(socket, io)
});
 
const start = async () => {
    await pool.query(prescript)
    try {
        server.listen(PORT, () => {
            console.log(`Server started on PORT = ${PORT}`)
        })
    } catch (e) {
        console.log(e);
    }
} 

start()
