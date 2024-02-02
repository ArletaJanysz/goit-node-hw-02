import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridApiKey);

const sendVerificationEmail = async (to, verificationToken) => {
	const msg = {
		to,
		from: "arleta.janysz@gmail.com",
		subject: "Email Verification",
		text: `Click the following link to verify your email: http://your-api-url/users/verify/${verificationToken}`,
	};

	await sgMail.send(msg);
};

export { sendVerificationEmail };
