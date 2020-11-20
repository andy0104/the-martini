import sgMail from '@sendgrid/mail';

export default async (): Promise<boolean> => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'andy0104@gmail.com',
    from: 'testcode0104@gmail.com', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
 
    if (error.response) {
      console.error(error.response.body)
    }
  }

  return true;
}