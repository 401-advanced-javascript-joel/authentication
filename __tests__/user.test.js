'use strict';

const mockDB = require('../data/mock-db');
const { userModel } = require('../lib/models/model');
const errorSpy = jest.spyOn(console, 'error');

beforeAll(async () => await mockDB.connectMock());

afterAll(async () => await mockDB.closeMock());

describe('Testing userModel create method', () => {
  test('Should create new user', async () => {
    errorSpy.mockClear();
    const result = await userModel.create({
      username: 'Jill',
      password: 'JillsPass',
      email: 'Jill@email.com',
      role: 'admin',
    });
    expect(result.username).toBe('Jill');
  });

  test('Should fail to create new user', async () => {
    const result = await userModel.create({});
    expect(result.error).not.toBe(undefined);
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe('Testing userModel read method', () => {
  test('Should read all users', async () => {
    await userModel.create({
      username: 'Jack',
      password: 'JacksPass',
      email: 'Jeff@email.com',
      role: 'user',
    });
    const results = await userModel.read();
    expect(results.length).toBe(2);
  });
});

describe('Testing userModel readOne method', () => {
  test('Should read the specified user', async () => {
    const user = await userModel.create({
      username: 'Joel',
      password: 'JoelsPass',
      email: 'Joel@email.com',
      role: 'editor',
    });
    const result = await userModel.readOne({ username: 'Joel' });
    expect(result._id).toEqual(user._id);
  });

  test('Should fail to read the user given nonexisting username', async () => {
    const result = await userModel.readOne({ username: 'Theo' });
    expect(result).toBeNull();
  });
});

describe('Testing userModel update method', () => {
  test('Should update the user', async () => {
    const user = await userModel.create({
      username: 'Jane',
      password: 'JanesPass',
      email: 'Jane@email.com',
      role: 'editor',
    });
    const update = { email: 'updated@email.com' };
    const result = await userModel.update(user._id, update);
  });

  test('Should fail to update the user given nonexisting id', async () => {
    const id = '5e926a2a17c00458508ad631';
    const update = { email: 'updated@email.com' };
    const result = await userModel.update(id, update);
    expect(result).toBeNull();
  });

  test('Should fail to update the user given invalid id', async () => {
    errorSpy.mockClear();
    const id = '5e926a2a17c00458508ad63';
    const update = { email: 'updated@email.com' };
    const result = await userModel.update(id, update);
    expect(result.error).not.toBe(undefined);
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe('Testing userModel delete method', () => {
  test('should delete specified user', async () => {
    const user = await userModel.create({
      username: 'Joe',
      password: 'JoesPass',
      email: 'Joe@email.com',
      role: 'editor',
    });
    const result = await userModel.delete(user._id);
    expect(result._id).toEqual(user._id);
  });

  test('should fail to delete when given a nonexisting id', async () => {
    const id = '5e926a2a17c00458508ad631';
    const result = await userModel.delete(id);
    expect(result).toBeNull();
  });

  test('should fail to delete when given an invalid id', async () => {
    errorSpy.mockClear();
    const id = '5e926a2a17c00458508ad63';
    const result = await userModel.delete(id);
    expect(result.error).not.toBe(undefined);
    expect(errorSpy).toHaveBeenCalled();
  });
});
