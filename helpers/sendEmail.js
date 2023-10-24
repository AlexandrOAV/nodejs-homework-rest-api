import nodemailer from "nodemailer";
import 'dotenv/config';

const {UKR_NET_EMAIL, UKR_NET_PASSWORD} = process.env;

const nodeMailerConfig = {
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth : {
        user: UKR_NET_EMAIL,
        pass:UKR_NET_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodeMailerConfig);

const sendEmail = async (data) => {
    const email = { ...data, from: UKR_NET_EMAIL };
    try {
      await transport.sendMail(email);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

//    data = {
//     to:..,
//     subject: ...,
//     html:...
//    }
  
export default sendEmail;