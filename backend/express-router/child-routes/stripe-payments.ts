// import * as express from 'express';
// const app = express();
// import { CustomRequest, CustomResponse } from 'backend/models/expressTypes'

// // This is your real test secret API key.
// const stripe = require('stripe')(
//   'sk_test_51I4HuZG8qStoymYEaaECOz1Q11NBSFUyp700dp8a8vLoA16D8FqOyO0AIsijH1Scnq0WEjy4gNBQTHUCvyGjYPYL00UERdzRPS'
// );

// function calculateOrderAmount(items) {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   let amount = 0;
//   items.forEach((item) => {
//     amount = amount + item.price;
//   });
//   return amount * 100;
// }

// app.post('/create-payment-intent', async (req: CustomRequest, res: CustomResponse) => {
//   const items = req.body.items;
//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: 'usd'
//   });
//   res.send({
//     clientSecret: paymentIntent.client_secret
//   });
// });

// export default app;
