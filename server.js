const express = require('express');
const { ExpressPeerServer } = require('peer');
const socket = require("socket.io")


const app = express();

app.use(express.static('public'))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

const server = app.listen(9000);

const peerServer = ExpressPeerServer(server, {
    path: '/myapp'
});

app.use('/peerjs', peerServer);


let io = socket(server);
io.on("connection", socket => {
    console.log(socket.id)
    socket.on("signal", id => {
        socket.broadcast.emit("signal_back", id);
        
    })
})









