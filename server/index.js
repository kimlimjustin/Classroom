// requiring depedencies.
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));