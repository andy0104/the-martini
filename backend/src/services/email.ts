import sgMail from '@sendgrid/mail';

export default async (receiverEmail: string, mailSubject: string, mailContent: string): Promise<boolean> => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: receiverEmail,
    from: 'Martini Support<testcode0104@gmail.com>', // Use the email address or domain you verified above
    subject: mailSubject,
    text: mailSubject,
    html: mailContent,
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