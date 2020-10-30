// requiring depedencies.
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

//load the environment variable
require('dotenv').config();

//Create server for socket.io
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL)
	res.setHeader("Access-Control-Allow-Methods", 'GET, POST, DELETE')
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type', "Authorization")
    res.header("Access-Control-Allow-Credentials", true)
	next();
})

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/public/")));


//including routers
const userRouter = require('./Router/User/user.router');
const classRouter = require('./Router/Class/class.router');
const classworkRouter = require('./Router/Class/classwork.router');
app.use('/users', userRouter)
app.use('/class', classRouter)
app.use('/classwork', classworkRouter)

//listening to the port
const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));

//connect to mongodb database
const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//404 error handler
app.use(function (req, res, next) {
	res.status(404).sendFile(__dirname + "/error/404.html")
})
