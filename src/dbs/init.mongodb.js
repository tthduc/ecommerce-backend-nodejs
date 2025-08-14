'use strict'
const mongoose = require('mongoose');
const config = require('../configs/config.mongo.js');
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
console.log('Connecting to MongoDB at:', connectString);

// Singleton pattern to ensure only one instance of the database connection
class Database {
	constructor() {
		this.connection = null;
		this.getMongoose(); 
	}
	
  	getMongoose() {
		if (this.connection) {
			return this.connection;
		}

		if (1 == 1) {
			mongoose.set('debug', true);
			mongoose.set('debug', { color: true });
		}

		this.connection = mongoose.connect(connectString, {}).then(() => {
			console.log('MongoDB connected successfully');
		}).catch(err => {
			console.error('MongoDB connection error:', err);
		});

		return this.connection;
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