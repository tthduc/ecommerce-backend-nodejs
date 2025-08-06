const app = require('./src/app');
const port = 3055
const server = app.listen(3055, () => {
    console.log(`start server with port ${port}`)
})

process.on('SIGINT', () => {
    server.close( ()=> console.log(`Exit Server Express`))
})