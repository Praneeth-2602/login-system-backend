require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    contact: Number,
    email: String,
});
const User = mongoose.model("User", UserSchema);

// Register API
app.post('/register', async (req, res) => {
    const { 
        username, 
        password, 
        contact,
        email
    } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ username, password, contact, email });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
});

// Login API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    res.status(200).json({ message: "Login successful" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
