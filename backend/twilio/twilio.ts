import twilio from 'twilio';
console.log('export twilio client1');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
console.log('export twilio client2');
export { twilioClient };

// const sendSms = (phone: string, message: string) => {
//   //const client = require('twilio')(accountSid, authToken);
//   twilioClient.messages
//     .create({
//        body: message,
//        from: process.env.TWILIO_PHONE_NUMBER,
//        to: phone
//      })
//     .then(message => console.log(message.sid));
// }

// module.exports = sendSms;


// client.messages 
//       .create({ 
//          body: 'abc 45678',  
//          messagingServiceSid: 'MG6ce29ea11201a9a263ad776b6280406c',      
//          to: '+14692584617' 
//        }) 
//       .then(message => console.log(message.sid)) 
//       .done();