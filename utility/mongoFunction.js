import * as dotenv from 'dotenv';
dotenv.config();

import {ObjectId} from 'mongodb';


import {getDB} from '../db/mongo';

/**
 * Ottengo 
 * @param {string} _id 
 * @returns 
 */
export async function findId(_id){
    if(!process.env.MONGO_DB && !process.env.MONGO_TABLE){
        throw new Error({"error": "table mongo not found!"});
    }
    const mongoDb = process.env.MONGO_DB;
    const table = process.env.MONGO_TABLE;

    const db = getDB();
    // ------------------------------------
    const collectionDB = db.db(mongoDb);  
    let collection;
    try {
        collection = collectionDB.collection(table);
    } catch (error) {
        throw new Error(error);
    }
    // ------------------------------------
    let query;
    try {
        query = await collection.findOne({"_id": new ObjectId(_id)});
    } catch (error) {
        throw new Error(`${error}`);
    }
    return query;
}


export default findId;