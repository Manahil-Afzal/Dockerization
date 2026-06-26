// const express = require("express");
// const path = require("path");

// const app = express();

// const port = process.env.PORT || 3000;
// const version = "1.0.0";

// // Only for displaying in logs
// const hostIP = "192.168.96.1";

// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//     console.log(`[Version ${version}] ${req.method} ${req.url}`);
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.listen(port, "0.0.0.0", () => {
//     console.log("=================================");
//     console.log(`Version : ${version}`);
//     console.log(`Container: http://0.0.0.0:${port}`);
//     console.log(`Host URL : http://${hostIP}:8080`);
//     console.log("=================================");
// });







const express = require('express');
const mongoose = require('mongoose');
const path = require("path");

const app = express();
const hostname = '0.0.0.0'; // Allow connections from all interfaces
const port = 3000;
const version = '1.0.0';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose
    .connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch(err => console.log(err));


// Define a simple user schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check route
app.get('/health', (req, res) => {
    res.sendStatus(200);
    console.log(`[Version ${version}]: Health check passed`);
});

// Add a user to MongoDB
app.get('/add-user', async (req, res) => {
    try {
        const newUser = new User({ name: "John Doe", age: 25 });
        await newUser.save();
        res.send('User added successfully!');
        console.log('User added:', newUser);
    } catch (error) {
        res.status(500).send('Error adding user');
        console.error('Error:', error);
    }
});

// Get all users from MongoDB
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
        console.log('Fetched users:', users);
    } catch (error) {
        res.status(500).send('Error fetching users');
        console.error('Error:', error);
    }
});

app.listen(port, hostname, () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
});