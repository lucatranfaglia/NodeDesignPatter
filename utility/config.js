import { S3Client } from "@aws-sdk/client-s3";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    // Required
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET,
    // Optional
    region: process.env.AWS_REGION
}

export const s3 = new S3Client(config);

export const AWSClient = new SecretsManagerClient({
    // Required
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1'
});

/**
 * 
 * @param {*} secretName 
 * @returns 
 */
export const getSecret = async (secretName) => {
	try {
        const client = new SecretsManagerClient(config);
        const input = { 
            SecretId: secretName
        };
        const command = new GetSecretValueCommand(input);
        const response = await client.send(command);
        return response;
		
	} catch (error){
		throw new Error(error);
	}
};

export default s3;