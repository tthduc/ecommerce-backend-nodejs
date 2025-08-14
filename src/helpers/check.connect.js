// // use strict mode to enforce better coding practices
// 'use strict'

// const mongoose = require('mongoose');
// const os = require('os');
// const process = require('process');
// const _SECONDS = 5000; // 5 seconds
// const countConnect = () => {
//     const numConnections = mongoose.connections.length;
//     console.log(`Number of active connections: ${numConnections}`);
//     return numConnections;
// }

// const checkOverload = () => {
//     setInterval(() => {
//         const numConnections = mongoose.connections.length;
//         const numCores = os.cpus().length;
//         const memoryUsage = process.memoryUsage().rss;

//         const maxConnections = numCores * 2; // Example threshold: 2 connections per core
        
//         console.log(`Active connections: ${numConnections}, CPU cores: ${numCores}, Memory usage: ${memoryUsage} bytes`);
//         if (numConnections > maxConnections) {
//             console.warn('Warning: Too many active connections!');
//         }
//     }, _SECONDS); // Check every 5 seconds
// }

// module.exports = {
//     // countConnect,
//     // checkOverload
// };