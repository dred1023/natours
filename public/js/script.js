// import axios from 'axios';
// import { showAlert } from '/.alerts';
// const stripe = stripe(`${process.env.STRIPE_SECRET_KEY}`);

// export const bookTour = async (tourId) => {
//   try {
//     const session = await axios.get(
//       `http://localhost:3000/api/v1/booking/${tourId}`,
//     );
//     console.log(session);
//     await stripe.redirectToCheckout({
//       seesionId: session.data.session.id,
//     });
//   } catch (err) {
//     showAlert('error', err);
//   }
// };
