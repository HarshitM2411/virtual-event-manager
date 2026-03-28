const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Event = require('../models/eventModels');
const {
	createEvent,
	getAllEvents,
	getEventById,
	updateAnEvent,
	deleteEvent,
	participateInEvent
} = require('../controllers/event-manager-controller');

let mongoServer;

const sampleEvent = {
	eventId: 'EVT-1001',
	eventName: 'Node Workshop',
	eventDate: '2026-04-20',
	eventTime: '18:00',
	eventDescription: 'Event testing session',
	participants: []
};

test.before(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());
});

test.afterEach(async () => {
	await Event.deleteMany({});
});

test.after(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.disconnect();
	await mongoServer.stop();
});

test('createEvent should create a new event', async () => {
	const result = await createEvent(sampleEvent);

	assert.equal(result.status, 'success');
	assert.equal(result.event.eventId, sampleEvent.eventId);

	const dbEvent = await Event.findOne({ eventId: sampleEvent.eventId });
	assert.ok(dbEvent);
});

test('getAllEvents should return all events', async () => {
	await Event.create(sampleEvent);

	const result = await getAllEvents();

	assert.equal(result.status, 'success');
	assert.equal(result.events.length, 1);
	assert.equal(result.events[0].eventId, sampleEvent.eventId);
});

test('getEventById should return not found for unknown eventId', async () => {
	const result = await getEventById({ eventId: 'EVT-404' });

	assert.equal(result.status, 'not found');
	assert.equal(result.event, null);
});

test('updateAnEvent should update mutable fields and return updated event', async () => {
	await Event.create(sampleEvent);

	const result = await updateAnEvent({
		eventId: sampleEvent.eventId,
		eventName: 'Updated Workshop',
		eventTime: '20:00'
	});

	assert.equal(result.status, 'success');
	assert.equal(result.event.eventName, 'Updated Workshop');
	assert.equal(result.event.eventTime, '20:00');
});

test('deleteEvent should remove an existing event', async () => {
	await Event.create(sampleEvent);

	const result = await deleteEvent({ eventId: sampleEvent.eventId });

	assert.equal(result.status, 'success');

	const dbEvent = await Event.findOne({ eventId: sampleEvent.eventId });
	assert.equal(dbEvent, null);
});

test('participateInEvent should add participant and reject duplicates', async () => {
	await Event.create(sampleEvent);

	const firstAttempt = await participateInEvent({
		eventId: sampleEvent.eventId,
		userId: 'user-1'
	});

	assert.equal(firstAttempt.status, 'success');

	const secondAttempt = await participateInEvent({
		eventId: sampleEvent.eventId,
		userId: 'user-1'
	});

	assert.equal(secondAttempt.status, 'already a participant');

	const dbEvent = await Event.findOne({ eventId: sampleEvent.eventId });
	assert.equal(dbEvent.participants.length, 1);
	assert.equal(dbEvent.participants[0], 'user-1');
});
