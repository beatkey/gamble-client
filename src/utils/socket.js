import {io} from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on("hello", (arg) => {
    console.log(arg); // world
});

export default socket
