import twilio from 'twilio';
import 'dotenv/config';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(to, message) {
    try{
        return await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
    }
    catch(error){
        console.error('Twilio SMS Error:', error);
    }
}

export default { sendSMS };
