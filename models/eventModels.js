const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    eventId: {
        type: String,
        required: [true, 'Event ID is required'],
        unique: true,
    },
    eventName: {
        type: String,
        required: [true, 'Event name is required'],
    },
    eventDate: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    eventTime: {
        type: String,
        required: [true, 'Event time is required'],
    },
    eventDescription: {
        type: String,
    },
    participants: [{
        type: String,
    }],
});

module.exports = mongoose.model('Events', eventSchema);