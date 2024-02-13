require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // when we send the information from frontend to backend body-parser help us to pass the information and convert the data into object that we can access easily
const cors = require('cors'); // when UI application running on different port and server is running on different port then cors help us to run different ports
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const contactRoute = require("./routes/contactRoutes");
const errorHandler = require('./middleWare/errorMiddleware');
const cookieParser = require("cookie-parser"); // will save cookie in local storage and will send from frontend
// const path = require("path")

const app = express();

// Middleware

app.use(express.json());

// Middlewares : when i send a request to server then middle get a data and do necessary amendments and then transfer the data to server. As if user send a request to server and the middle covert the data into json then send to server

app.use(express.json()); // It will convert the response into json
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    
    }))

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes Middleware
// Routes Middleware means refactor
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contacts", contactRoute);

// Routes
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Error Middleware
app.use(errorHandler);

// connect to MONGODB and start server

mongoose.set('strictQuery', false);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)    
    })
})
.catch((err) => console.log(err))


