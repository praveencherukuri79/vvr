// const { MongoClient } = require('mongodb');
// import * as mongoose from 'mongoose';

// //import { MongoClient } from 'mongodb';

// export async function mongoConnect() {
//     //const mongoDB_uri = 'mongodb+srv://admin:PraveenVudu99@corecluster.fney4.mongodb.net/test?retryWrites=true&w=majority';

//     let DB_URI = process.env.DATABASE_URI.replace('{{user}}', process.env.DATABASE_USER);
//     DB_URI.replace('{{password}}', process.env.DATABASE_PASSWORD);
//     DB_URI.replace('{{dbname}}', process.env.DATABASE_TABLE);

//     const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//     await client.connect();

//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();

//         // Make the appropriate DB calls
//         //await  listDatabases(client);

//         let databasesList = await client.db().admin().listDatabases();
//         let returnlist = [];
//         console.log("Databases:");
//         databasesList.databases.forEach(db => {
//             console.log(` - ${db.name}`);
//             returnlist.push(db.name);
//         });

//         return returnlist;

//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }

// }

// export async function mongoConnect2(){
//     let list;
//     console.log('step 1');
//     mongoose.connection.on('open', async ref=> {
//         await console.log('Connected to mongo server.');
//         //trying to get collection names
//         mongoose.connection.db.listCollections().toArray(async (err, names) => {
//             console.log('step 2');
//             console.log(names); // [{ name: 'dbname.myCollection' }]
//             list = await names;
//             //module.exports.Collection = names;
//         });
//     })
//     console.log('step 3');
//     return list;
// }

// // export async function mongoConnect3(){
// //     let list;
// //     console.log('step 1');
// //    let ref =  await mongoose.connection.on('open');
// //    //, async ref=> {
// //         console.log('Connected to mongo server.');
// //         //trying to get collection names
// //       let names =  await mongoose.connection.db.listCollections().toArray();
// //         //async (err, names) => {
// //             console.log('step 2');
// //             console.log(names); // [{ name: 'dbname.myCollection' }]
// //             list = names;
// //             //module.exports.Collection = names;
// //         });
// //     })
// //     console.log('step 3');
// //     return list;
// // }


// async function listDatabases(client) {
//     let databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };