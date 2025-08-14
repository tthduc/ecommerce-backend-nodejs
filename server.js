const app = require('./src/app');
const port = process.env.PORT || 3052;
const server = app.listen(port, () => {
    console.log(`start server with port ${port}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
    process.exit(0);
})