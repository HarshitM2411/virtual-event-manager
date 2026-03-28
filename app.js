require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middlewares/logger');
const userRouter = require('./routes/user-routes');
const eventRouter = require('./routes/event-manager-routes');
const app = express();

app.use(express.json());
app.use(logger);
app.use('/users', userRouter);
app.use('/events', eventRouter);

app.get('/', (req, res) => {
    res.send('Virtual Event Management');
});

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

mongoose.connect(URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log("Express application started on port", PORT);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });

module.exports = app;