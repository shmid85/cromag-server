//REPLACED BY MONGOOSE
// const { MongoClient } = require('mongodb')
// const chalk = require('chalk')
// const log = console.log

// const dbName = 'cromag'
// let dbConnection;

// const connectToDb = (calback) => {
//     MongoClient.connect(url)
//         .then(client => {
//             log(chalk.green('DB is connected!'))
//             dbConnection = client.db(dbName)
//             return calback()
//         })
//         .catch(err => {
//             log(chalk.red('DB connection error!'))
//             calback(err)
//         })

// }

// const getDb = () => dbConnection

// module.exports = {
//     connectToDb,
//     getDb
// }