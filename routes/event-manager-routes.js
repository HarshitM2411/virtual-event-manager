const express = require('express');
const validateJWT = require('../middlewares/validateJWT');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    createEvent,
    deleteEvent,
    updateAnEvent,
    participateInEvent
} = require('../controllers/event-manager-controller');

router.use(validateJWT);

// get all events
router.get('/', async (req, res) => {
    const result = await getAllEvents();
    switch (result.status) {
        case 'success':
            return res.status(200).send({ message: result.message, events: result.events });
        default:
            return res.status(500).send({ message: result.message, events: [] });
    }
});

// get a specific event (parameter route comes AFTER specific routes)
router.get('/:eventId', async (req, res) => {
    const { eventId } = req.params;

    const result = await getEventById({ eventId });
    switch (result.status) {
        case 'success':
            return res.status(200).send({ message: result.message, event: result.event });
        case 'not found':
            return res.status(404).send({ message: result.message, event: null });
        default:
            return res.status(500).send({ message: result.message, event: null });
    }
});

// create an event (specific route must come BEFORE parameter route)
router.post('/create', async (req, res) => {
    const { eventId, eventName, eventDate, eventTime, eventDescription, participants } = req.body;
    if (!eventId || !eventName || !eventDate || !eventTime) {
        return res.status(400).send({ message: 'eventId, eventName, eventDate, eventTime are required!' });
    }
    const result = await createEvent({ eventId, eventName, eventDate, eventTime, eventDescription, participants });
    switch (result.status) {
        case 'success':
            return res.status(201).send({ message: result.message, event: result.event });
        default:
            return res.status(500).send({ message: result.message, event: result.event });
    }
});


router.put('/update/:eventId', async (req, res) => {
    const { eventId } = req.body;
    if (eventId) {
        return res.status(400).send({ message: 'eventId is not mutable!' });
    }
    const result = await updateAnEvent({ eventId: req.params.eventId, ...req.body });
    switch (result.status) {
        case 'success':
            return res.status(200).send({ message: result.message, event: result.event });
        case 'not found':
            return res.status(404).send({ message: result.message, event: null });
        default:
            return res.status(500).send({ message: result.message, event: null });
    }
});

// delete an event
router.delete('/delete/:eventId', async (req, res) => {
    const { eventId } = req.params;

    const result = await deleteEvent({ eventId });
    switch (result.status) {
        case 'success':
            return res.status(200).send({ message: result.message });
        case 'not found':
            return res.status(404).send({ message: result.message });
        default:
            return res.status(500).send({ message: result.message });
    }
});

router.patch('/participate/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    const result = await participateInEvent({ eventId, userId });
    switch (result.status) {
        case 'success':
            return res.status(200).send({ message: result.message });
        case 'not found':
            return res.status(404).send({ message: result.message });
        case 'already a participant':
            return res.status(400).send({ message: result.message });
        default:
            return res.status(500).send({ message: result.message });
    }
});

module.exports = router;