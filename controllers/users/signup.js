import Joi from "joi";
import User from "../../models/users.js";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

const signupSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

async function signup(req, res) {
	try {
		const { error } = signupSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "Email in use" });
		}

		const hashedPassword = await bcrypt.hash(password, 8);

		const verificationToken = crypto.randomBytes(16).toString("hex");

		const newUser = new User({
			email,
			password: hashedPassword,
			subscription: "starter",
			verificationToken,
		});

		await newUser.save();

		const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
		const msg = {
			to: newUser.email,
			from: "kaczorowska.karolina@gmail.com",
			subject: "Email Verification",
			text: `Click on the following link to verify your email: ${verificationLink}`,
			html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
		};
		await sgMail.send(msg);

		return res.status(201).json({
			message:
				"User registered successfully. Check your email for verification.",
		});
	} catch (err) {
		return res
			.status(500)
			.json({ message: `An error occurred: ${err.message}` });
	}
}

async function uploadAvatar(req, res) {
	try {
		const { user } = req;
		if (!user) {
			return res.status(401).json({ message: "Not authorized" });
		}
		a;
		const avatarInfo = req.file;

		user.avatar = `/avatars/${avatarInfo.filename}`;
		await user.save();

		return res.status(200).json({
			message: "Avatar uploaded successfully",
			user: {
				email: user.email,
				subscription: user.subscription,
				avatar: user.avatar,
			},
		});
	} catch (err) {
		return res
			.status(500)
			.json({ message: `An error occurred: ${err.message}` });
	}
}

export { signup, uploadAvatar };
