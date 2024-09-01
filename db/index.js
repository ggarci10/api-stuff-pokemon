const { MongoClient } = require('mongodb');

const config = require('../config.json');

/**
 * @description         es6 style module to support mongo connection and crud operations
 * @return {Object}     object containing functions
 */
const mongo = () => {
    const mongoURL = `mongodb+srv://${config.username}:${config.password}@cluster0.9gdke5f.mongodb.net/${config.database_name}?retryWrites=true&w=majority`;
    let db = null;

    /**
     * @description         connects to mongo atlas via url and sets db instace
     */
    async function connect() {
        try {
            const client = new MongoClient(mongoURL);
            await client.connect();

            db = client.db();

            console.log('Connected to Mongo DB');
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description                      performs an insert into the specified collection
     * @param {String} collectionName    name of a collection in mongo
     * @param {Object} data              data object to insert into mongo collection
     */
    async function save(collectionName, data) {
        try {
            const collection = db.collection(collectionName);
            await collection.insertOne(data);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description                      performs a query on a mongo collection by pokeId
     * @param {String} collectionName    name of a collection in mongo
     * @param {Object} pokeIdentifier    pokeId to query
     * @return {Object or Array}         the abilities object by poke id or all results
     */
    async function find(collectionName, pokeIdentifier) {
        try {
            const collection = db.collection(collectionName);

            if (pokeIdentifier) {
                return await collection.find({ searchTerm: pokeIdentifier }).next();
            } else {
                return await collection.find({}).toArray();
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description                      performs an update on a mongo collection by pokeId
     * @param {String} collectionName    name of a collection in mongo
     * @param {Object} pokeIdentifier    pokeId to query
     * @param {Object} data              data to update into mongo collection
     */
    async function update(collectionName, pokeIdentifier, selections) {
        try {
            
            const collection = db.collection(collectionName);


            collection.updateOne(pokeIdentifier, 
                { $set: { lastSearched: new Date() }, $addToSet: { selections } }
            );
            
        } catch (error) {
            console.log(error);
        }
    }

    return {
        connect,
        save,
        find,
        update
    };
};

module.exports = mongo();