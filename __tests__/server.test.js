'use strict';

const request = require('supertest');
const mockDB = require('../data/mock-db');
const { server } = require('../lib/server');
const agent = request(server);

// roles
let user;
let editor;
let admin;

beforeAll(async () => {
  await mockDB.connectMock();
  user = await agent.post('/signup').send({
    username: 'user',
    password: 'user',
    email: 'user@email.com',
    role: 'user',
  });
  user = JSON.parse(user.text);

  editor = await agent.post('/signup').send({
    username: 'editor',
    password: 'editor',
    email: 'editor@email.com',
    role: 'editor',
  });
  editor = JSON.parse(editor.text);

  admin = await agent.post('/signup').send({
    username: 'admin',
    password: 'admin',
    email: 'admin@email.com',
    role: 'admin',
  });
  admin = JSON.parse(admin.text);
});

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
    expect(JSON.parse(res.text).length).toBe(4); // 3 roles users plus 1 above.
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

describe('Testing Public Route', () => {
  test('Should load for all users', async () => {
    const res = await agent.get('/public').send();
    expect(res.status).toBe(200);
    expect(res.text).toBe('This is a public page');
  });
});

describe('Testing Private Route', () => {
  test('Should load for signed in users', async () => {
    const res = await agent
      .get('/private')
      .send()
      .set('authorization', 'Bearer ' + user.token);
    expect(res.status).toBe(200);
    expect(res.text).toBe('This is a private page');
  });
});

describe('Testing Readonly Route', () => {
  test('Should load for user role or above', async () => {
    const res = await agent
      .get('/readonly')
      .send()
      .set('authorization', 'Bearer ' + user.token);
    expect(res.status).toBe(200);
    expect(res.text).toBe('You can read this content');
  });
});

describe('Testing Create Route', () => {
  test('Should load for editor role or above', async () => {
    const res = await agent
      .post('/create')
      .send()
      .set('authorization', 'Bearer ' + editor.token);
    expect(res.status).toBe(200);
    expect(res.text).toBe('You can create content');
  });
});

describe('Testing Update Route', () => {
  test('Should load for editor role or above', async () => {
    const res = await agent
      .put('/update')
      .send()
      .set('authorization', 'Bearer ' + editor.token);
    expect(res.status).toBe(200);
    expect(res.text).toBe('You can update content');
  });
});

describe('Testing Delete Route', () => {
  test('Should load for admin role', async () => {
    const res = await agent
      .delete('/delete')
      .send()
      .set('authorization', 'Bearer ' + admin.token);
    expect(res.status).toBe(200);
    expect(res.text).toBe('You can delete content');
  });
});

describe('Testing Everything Route', () => {
  test('Should load for admin role', async () => {
    const res = await agent
      .get('/everything')
      .send()
      .set('authorization', 'Bearer ' + admin.token);
    expect(res.status).toBe(200);
    expect(res.text).toBe('You’re a super user!');
  });
});
