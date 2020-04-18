'use strict';

const request = require('supertest');
const mockDB = require('../data/mock-db');
const { server } = require('../lib/server');
const agent = request(server);

beforeAll(async () => await mockDB.connectMock());

afterAll(async () => await mockDB.closeMock());

describe('Testing Homepage & 404 Routes', () => {
  test('Should load home page', async () => {
    const res = await agent.get('/').send();
    expect(res.status).toBe(200);
    expect(res.text).toBe('<h2>Homepage</h2>');
  });

  test('Should load 404', async () => {
    const res = await agent.get('/fake-url').send();
    expect(res.status).toBe(404);
    expect(res.error.text).toBe('<h2>Error 404: Page Not Found</h2>');
  });
});

describe('Testing Signup Route', () => {
  test('Should load the created user', async () => {
    const res = await agent.post('/signup').send({
      username: 'Jack',
      password: 'JacksPass',
      email: 'Jeff@email.com',
      role: 'user',
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).username).toBe('Jack');
  });
});

describe('Testing Users Route', () => {
  test('Should load list of users', async () => {
    const res = await agent.get('/users').send();
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).length).toBe(1);
  });
});

describe('Testing Signin Route', () => {
  test('Should load signin text', async () => {
    const res = await agent
      .get('/signin')
      .send()
      .set('authorization', 'Basic SmFjazpKYWNrc1Bhc3M=');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Signed In!');
  });

  test('Should load 401 unauthorized text', async () => {
    const res = await agent.get('/signin').send();
    expect(res.status).toBe(401);
    expect(res.text).toBe('<h2>Error 401:</h2><p>Unauthorized access</p>');
  });
});
