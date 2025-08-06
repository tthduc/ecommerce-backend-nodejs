'use strict'
const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/shoDEV';
const { countConnect } = require('../helpers/check.connect.js');

// Singleton pattern to ensure only one instance of the database connection
class Database {
	constructor() {
		this.getMongoose();
	}

  	getMongoose() {
		if (1 == 1) {
			mongoose.set('debug', true);
			mongoose.set('debug', { color: true });
		}

		mongoose.connect(connectString, {}).then(() => {
			console.log('MongoDB connected successfully', countConnect());
		}).catch(err => {
			console.error('MongoDB connection error:', err);
		});
	}

	// Static method to get the singleton instance
	static getMongooseInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance.getMongoose();
  	}
}

const instance = Database.getMongooseInstance();

module.exports = instance