const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET_KEY = 'test-secret-key';

const User = require('../models/userModels');
const { registerUser, loginUser } = require('../controllers/users-controller');

let mongoServer;

test.before(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());
});

test.afterEach(async () => {
	await User.deleteMany({});
});

test.after(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.disconnect();
	await mongoServer.stop();
});

test('registerUser should create user with hashed password', async () => {
	const payload = {
		name: 'John Doe',
		username: 'john',
		password: 'Passw0rd'
	};

	const result = await registerUser(payload);

	assert.equal(result.status, 'success');

	const dbUser = await User.findOne({ username: payload.username });
	assert.ok(dbUser);
	assert.notEqual(dbUser.password, 'Passw0rd');

	const validHash = await bcrypt.compare('Passw0rd', dbUser.password);
	assert.equal(validHash, true);
});

test('registerUser should fail for invalid password format', async () => {
	const result = await registerUser({
		name: 'Jane Doe',
		username: 'jane',
		password: 'password'
	});

	assert.equal(result.status, 'error');

	const dbUser = await User.findOne({ username: 'jane' });
	assert.equal(dbUser, null);
});

test('loginUser should return token for valid credentials', async () => {
	await registerUser({
		name: 'Alice',
		username: 'alice',
		password: 'Passw0rd'
	});

	const result = await loginUser({ username: 'alice', password: 'Passw0rd' });

	assert.equal(result.status, 'success');
	assert.ok(result.token);

	const decoded = jwt.verify(result.token, process.env.JWT_SECRET_KEY);
	assert.equal(decoded.username, 'alice');
});

test('loginUser should fail for wrong password', async () => {
	await registerUser({
		name: 'Bob',
		username: 'bob',
		password: 'Passw0rd'
	});

	const result = await loginUser({ username: 'bob', password: 'Wrong1Pass' });

	assert.equal(result.status, 'invalid password');
	assert.equal(result.token, null);
});

test('loginUser should return not found for unknown username', async () => {
	const result = await loginUser({ username: 'unknown', password: 'Passw0rd' });

	assert.equal(result.status, 'not found');
	assert.equal(result.token, null);
});
