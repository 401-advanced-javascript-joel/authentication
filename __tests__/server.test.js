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
      username: 'Sam',
      password: 'wize',
      email: 'sam@email.com',
      role: 'admin',
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).user.username).toBe('Sam');
  });

  test('Should fail to create duplicate user', async () => {
    const res = await agent.post('/signup').send({
      username: 'Sam',
      password: 'wize',
      email: 'sam@email.com',
      role: 'admin',
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe('<h2>Error 400:</h2><p>User already exists!</p>');
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
      .post('/signin')
      .send()
      .set('authorization', 'Basic U2FtOndpemU=');
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).user.username).toBe('Sam');
  });

  test('Should load 401 unauthorized text', async () => {
    const res = await agent.post('/signin').send();
    expect(res.status).toBe(401);
    expect(res.text).toBe(
      '<h2>Error 401:</h2><p>Invalid credentials or token. Please sign in.</p>',
    );
  });
});

describe('Testing User Route', () => {
  test('Should load signed in user data', async () => {
    const response = await agent
      .post('/signin')
      .send()
      .set('authorization', 'Basic U2FtOndpemU=');
    const token = JSON.parse(response.text).token;
    const res = await agent
      .get('/user')
      .send()
      .set('authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).username).toBe('Sam');
  });

  test('Should load signed in user data', async () => {
    const response = await agent
      .post('/signin')
      .send()
      .set('authorization', 'Basic U2FtOndpemU=');
    const token = JSON.parse(response.text).token + 'A';
    const res = await agent
      .get('/user')
      .send()
      .set('authorization', 'Bearer ' + token);
    expect(res.status).toBe(401);
    expect(res.text).toBe(
      '<h2>Error 401:</h2><p>Invalid credentials or token. Please sign in.</p>',
    );
  });
});
