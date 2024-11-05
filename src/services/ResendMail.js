// // import { EmailTemplate } from '../../components/EmailTemplate';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { firstName } = req.body;

//   try {
//     const { data } = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: ['delivered@resend.dev'],
//       subject: 'Hello world',
//       react: EmailTemplate({ firstName }),
//     });

//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// }









// const API_KEY = import.meta.env.VITE_RESEND_MAIL_API;
// import { Resend } from 'resend'; // Use named import



// const resend = new Resend('re_NVmgXJJM_HyTirgqV4z3Kh9R5VHoVxhmg');

// resend.apiKeys.create({ name: 'Production' });





// console.log(API_KEY);

// // Initialize the Resend client with your API key
// // const resend = new Resend(API_KEY);

// // Function to send an email
// export const sendEmail = async (to, subject, html) => {
//     try {
//         const response = await resend.emails.send({
//             from: 'kartikagrawal1818@gmail.com', // replace with your email
//             to,
//             subject,
//             html,
//         });
//         console.log('Email sent successfully:', response);
//         return response; // Return response for further processing if needed
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error; // Throw error to handle it in the calling function
//     }
// };
