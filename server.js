require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(express.json());


app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://demo-project-frontend-5t0jr4ka-abhishekjha2568s-projects.vercel.app"
    ],
    credentials: true
}));


const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB connected successfully.");
    })
    .catch((err) => {
        console.error("Database connection error:", err.message);
    });


app.use('/api/auth', require('./routes/auth'));


app.get('/', (req, res) => {
    res.status(200).send("HR Portal Backend Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is operational on port ${PORT}`);
});
