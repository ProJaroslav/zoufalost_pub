const video1 = document.querySelector("#video1");
const video2 = document.querySelector("#video2");
const videoGrid = document.querySelector("#video-grid");
let newComerId = "";


const peers = {};


const peer = new Peer(undefined, {
    host: 'localhost',
    port: 9000,
    path: '/peerjs/myapp'
});


/* const peer = new Peer(); */


peer.on("open", id => {
    newComerId = id;
    socket.emit("signal", id);
});

let socket = io.connect("/");



peer.on('connection', function(conn) {
    conn.on('data', function(data){

      console.log(data);
    });
});


const video = document.createElement("video");
video.muted = true;



async function getMedia(constraints) {
    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        addVideoStream(video, stream);


        peer.on("call", call => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", userVideoStream => {
                addVideoStream(video, userVideoStream)
            });
        });
    
        socket.on("signal_back", userId => {
            connectToNewUser(userId, stream);
        });
        
    
    } catch(err) {
        console.log(err);
    }
}


getMedia({video : true, audio : false});


function connectToNewUser(userId, stream) {
    console.log("connect to new user");
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    });
    call.on("close", () => {
        video.remove()
    });

    peers[userId] = call
}


function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.appendChild(video);
}