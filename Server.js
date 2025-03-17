const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3019;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static(__dirname));

// Connect to MongoDB (Fixed: Removed deprecated options)
mongoose.connect('mongodb://127.0.0.1:27017/users');

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

// Define User Schema (Storing in "registered users" collection)
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone_no: Number,
    date_of_birth: Date,
    password: String
}, { collection: "registered users" });

const Users = mongoose.model("Users", userSchema);

// Serve Register Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Handle User Registration
app.post('/post', async (req, res) => {
    try {
        const { first_name, last_name, email, phone_no, date_of_birth, password } = req.body;

        const user = new Users({
            first_name,
            last_name,
            email,
            phone_no,
            date_of_birth,
            password
        });

        await user.save();
        console.log("User Registered:", user);
        res.send("User successfully registered!");
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error saving user data");
    }
});

app.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });

        if (user) {
            res.json({ exists: true, message: "Email is already registered." });
        } else {
            res.json({ exists: false, message: "Email is not registered." });
        }
    } catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});


// Handle User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({ error: "Incorrect password!" });
        }

        // Successful login
        res.json({ message: "Login successful!", user: { first_name: user.first_name } });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error, please try again." });
    }
});