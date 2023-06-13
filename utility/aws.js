
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from '../utility/config';
import { PutObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectTaggingCommand, DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3"
import { Response } from 'node-fetch';
/**
* 
* @param {string} ops : 'create', 'update', 'delete', 'rename', 'tag'
* @param {string} bucket 
* @param {string} path : percorso dove inserire il file => 'departmentid=' + departmentId + '/registryid=' + registryId + '/' + dynamo_requestId + '.json'
* @param {object} item : contenuto da inserire del file
* @param {string} pathNew : stringa contenente il path da sostituire (es. 22040024.json -> delete_22040024.json)
* @param {object} tag : tag da inserire nel file json
* @returns 
*/
export const crudS3 = async function(ops, bucket, path, item, pathNew="", tag={}) {
    // ----------------------------------------------------------------                                    
    if (!ops || !path || !bucket) {
        const error = {"error":"!ops || !path || !bucket not found!"};
        throw new Error(error);
    }
    // ----------------------------------------------------------------                                    
    // AWS Building path for S3 storage
    // ----------------------------------------------------------------
    let result;
    if (ops === 'update' || ops === 'create') {
        // ------------------------------------------------------------
        if (_.isEmpty(item)) {
            const error = {"error":"item NOT FOUND!"};
            throw new Error(error);
        }
        // ------------------------------------------------------------
        const params = {
            Bucket: bucket,
            Key: path,
            Body: JSON.stringify(item)
        };
        // ------------------------------------------------------------
        try {
            const command = new PutObjectCommand(params);
            result = await s3.send(command);
        }
        catch (error) {
            throw new Error(error);
        }

        return result;
    } 
    else if (ops === 'get') {
        const params = {
            Bucket: bucket,
            Key: path
        };
        // ------------------------------------------------------------
        try {
            const command = new GetObjectCommand(params);
            result = await s3.send(command);
        } catch (error) {
            throw new Error(error);
        }
        // ------------------------------------------------------------
        const response = new Response(result.Body);
        return await response.json();                 
    }
    else if (ops === 'rename') {
        const paramsCopy = {
            Bucket: bucket,
            CopySource: bucket +'/'+path,
            Key: pathNew
        };
        const paramsRemove = {
            Bucket: bucket,                
            Key: path
        };
        // ------------------------------------------------------------
        try {

            const command = new CopyObjectCommand(paramsCopy);
            const response = await client.send(command);
        } catch (error) {
            throw new Error(error);
        }
        // ------------------------------------------------------------
        try {
            result = await deleteObjectS3(paramsRemove)
        } catch (error) {
            throw new Error(error);
        }
        return result;
    }
    else if (ops === 'tag') {
        const params = {
            Bucket: bucket,                
            Key: path,
            Tagging: tag
        };
        // ------------------------------------------------------------
        try {            
            const command = new PutObjectTaggingCommand(params);
            const response = await s3.send(command);
        } catch (error) {
            throw new Error(error);
        }
        return;
    }
    else if(ops ==='delete'){
        const params = {
            Bucket: bucket,
            Key: path
        };
        try {
            const response = await deleteObjectS3(params)
        } catch (error) {
            throw new Error(error);
        }
        return;
    }
}

/**
 * Delete object to S3
 * @param {object} params 
 */
export const deleteObjectS3 = async function(params) {
    try {
        const command = new DeleteObjectCommand(params);
        return await s3.send(command);        
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Signed url S3
 * @param {string} bucket 
 * @param {string} key 
 * @param {string} fileType 
 */
export const getSignedUrlS3 = async function(bucket, key, fileType) {
    const signedUrlExpireSeconds = 60 * 60;
    try {
        const params = {
            Bucket: bucket,
            Key: key,
            Expires: signedUrlExpireSeconds,
        }        

        if(fileType){
            params['ResponseContentType'] = fileType;
        }
        const command = new GetObjectCommand(params);
        return await getSignedUrl(s3, command, params);     
        
    } catch (error) {
        throw new Error(error);
    }
}


/**
* Ottengo tutti i file presenti nel bucket
* @param {string} bucket 
* @returns 
*/
export const getAllFileS3 = async(bucket, dir, delimiter = '/') => {
    let array = [];
    let fileArray;

    const params = {
        Bucket: bucket           
    }; 

    if(dir){
        params['Prefix']= dir;
    }
    if(delimiter){
        params['Delimiter']= delimiter;
    }
    do {            
        const command = new ListObjectsV2Command(params);
        fileArray = await s3.send(command);                        
        if(fileArray){
            if(fileArray.NextContinuationToken){
                params['ContinuationToken'] = fileArray.NextContinuationToken;
            }
            if(fileArray.Contents){
                array.push(...fileArray.Contents);
            }
        }
    } while (fileArray.NextContinuationToken);
    
    return array;
}

export default crudS3;
