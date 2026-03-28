const events = require('../models/eventModels');

const getAllEvents = async () => {
    try {
        const allEvents = await events.find();
        return { status: 'success', message: 'Events retrieved successfully', events: allEvents };
    } catch (error) {
        return { status: 'error', message: 'Error in retrieving events', events: null };
    }
};

const getEventById = async ({ eventId }) => {
    try {
        const event = await events.findOne({ eventId });
        if (!event) {
            return { status: 'not found', message: 'Event Not Found', event: null };
        }
        return { status: 'success', message: 'Event retrieved successfully!', event };
    } catch (error) {
        return { status: 'error', message: 'Error retrieving event', event: null };
    }
};


const createEvent = async (event) => {
    try {
        const newEvent = await events.create(event);
        return { status: 'success', message: 'Event created successfully', event: newEvent };
    } catch (error) {
        return { status: 'error', message: 'Error creating event', event: null };
    }
}

const updateAnEvent = async ({ eventId, ...updateData }) => {
    try {
        const event = await events.findOneAndUpdate({ eventId }, updateData, { new: true });
        if (!event) {
            return { status: 'not found', message: 'Event not found!', event: null };
        }
        return { status: 'success', message: 'Event updated successfully', event }
    } catch (error) {
        return { status: 'error', message: 'Error updating event', event: null };
    }
}

const deleteEvent = async ({ eventId }) => {
    try {
        const deleted = await events.findOneAndDelete({ eventId });
        if (!deleted) {
            return { status: 'not found', message: 'Event not found!' };
        }
        return { status: 'success', message: 'Deleted successfully!' };
    } catch (error) {
        return { status: 'error', message: 'Error deleting event' };
    }
}

const participateInEvent = async ({ eventId, userId }) => {
    try {
        const event = await events.findOne({ eventId });
        if (!event) {
            return { status: 'not found', message: 'Event not found!' };
        }
        if (event.participants.includes(userId)) {
            return { status: 'already a participant', message: 'User already participating in event!' };
        }
        event.participants.push(userId);
        await event.save();
        return { status: 'success', message: `${userId} Participation successful in event ${event.eventName} - ${eventId}!` };
    } catch (error) {
        return { status: 'error', message: 'Error participating in event' };
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    deleteEvent,
    updateAnEvent,
    participateInEvent
}