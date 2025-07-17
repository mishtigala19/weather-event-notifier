const twilio = require('twilio');
require('dotenv').config()

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(to, message) {
    try{
        return await client.message.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
    }
    catch(error){
        console.error('Twilio SMS Error:', error);
    }
}

module.exports = { sendSMS };