const redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.on('message', (channel, message) => {
            if (this.messageHandlers[channel]) {
                this.messageHandlers[channel](message);
            }
        });

        this.messageHandlers = {};
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            /**
             * 1. func publish return pending promise
             * 2. inside the promise, call this.publisher.publish
             * 3. in the callback of publish, resolve or reject the promise based on error
             */
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    return reject(err);
                }
                resolve(reply);
            });
        });
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (subscribedChannel, message) => {
            if (subscribedChannel === channel) {
                callback(channel, message);
            }
        });
    }

    unsubscribe(channel) {
        delete this.messageHandlers[channel];
        this.subscriber.unsubscribe(channel);
    }

    quit() {
        this.publisher.quit();
        this.subscriber.quit();
    }
}

module.exports = RedisPubSubService;