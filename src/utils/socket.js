import {io} from 'socket.io-client';

const socket = io('http://localhost:3001');
console.log(socket)
export default socket
