import { debug } from 'console';
import { oauth } from "../repository/oauthRepository.js";



/**
 * get file spec (json) in S3
 * @returns 
 */
export const oauthController = async function (req, res) {
    try {        
        const result = await oauth();    
        res.status(result.statusCode ? result.statusCode : 200).json( result ? result : 'Success');                        
    } catch (error) {
        if (error instanceof Error) {
            const statusCode = 500;
            const message = error.message ? error.message : error
            res.status(statusCode).json(message);            
        } else {
            res.status(500).send({"error": error});
        }
    }   
}

export default oauthController;