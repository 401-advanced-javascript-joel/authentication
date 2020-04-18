'use strict';

const users = require('./users');

class Model {
  constructor(schema) {
    this.schema = schema;
  }

  async create(record) {
    let result;
    try {
      result = await this.schema.create(record);
    } catch (error) {
      console.error(error.message);
      result = { error };
    }
    return result;
  }

  async read() {
    let results;
    try {
      results = await this.schema.find({});
    } catch (error) {
      console.error(error.message);
      results = { error };
    }
    return results;
  }

  async readOne(record) {
    let result;
    try {
      result = await this.schema.findOne(record);
    } catch (error) {
      console.error(error.message);
      result = { error };
    }
    return result;
  }

  async update(id, record) {
    let result;
    try {
      result = await this.schema.findByIdAndUpdate(id, record, { new: true });
    } catch (error) {
      console.error(error.message);
      result = { error };
    }
    return result;
  }

  async delete(id) {
    let result;
    try {
      result = await this.schema.findByIdAndDelete(id);
    } catch (error) {
      console.error(error.message);
      result = { error };
    }
    return result;
  }
}

module.exports = {
  userModel: new Model(users),
};
