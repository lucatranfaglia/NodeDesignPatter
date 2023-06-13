import { getSecret } from '../utility/config';
import { MongoClient } from 'mongodb';

import * as dotenv from 'dotenv';
dotenv.config();


let _db;
export const mongoConnect = async function(){
    if(!process.env.SECRETNAME){
        throw new Error({"error": "SECRETNAME not found!"});
    }
    const secret = process.env.SECRETNAME;
    let uri;
    try {
        uri = await getMongoURL(secret)
    } catch (error) {
        throw new Error(error);
    }
    const options = {
        maxPoolSize: 10,
        maxConnecting: 10,
        connectTimeoutMS: 2000,
        socketTimeoutMS: 2000,
    }
    const client = new MongoClient(uri, options);
    try {
        _db = await client.connect();    
    } catch (error) {
        throw new Error(error);
    }
}
export const getDB = () => _db;
export const disconnectDB = () => _db.close()


/**
 * Create URI mongodb
 * @param {string} secretName 
 * @returns 
 */
const getMongoURL = async (secretName) => {	
    let AWSManager;
	try{
		AWSManager = await getSecret(secretName);
	} catch (error){
        console.log("AWSManager error: ", error);
		throw new Error(error);
	}
	try{
		const secret = JSON.parse(AWSManager.SecretString);
		return 'mongodb://'+secret.username+':'+secret.password+'@'+secret.host+':'+secret.port+'/'+secret.db;
	} catch (error){
		throw new Error(error);
	}
};

export default mongoConnect;