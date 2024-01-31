import path from "path";
import { promises as fsPromises } from "fs";
import { v4 as uuidv4 } from "uuid";
import Jimp from "jimp";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../services/sendgridService.js";

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;

const uploadAvatar = async (req, res, next) => {
	try {
		const userId = req.user._id;

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const imagePath = path.join(__dirname, `../tmp/${req.file.filename}`);
		const avatar = await Jimp.read(imagePath);
		await avatar.resize(250, 250).writeAsync(imagePath);

		const avatarFileName = `${userId}-${uuidv4()}${path.extname(
			req.file.originalname
		)}`;
		const avatarPath = path.join(
			__dirname,
			`../public/avatars/${avatarFileName}`
		);
		await fsPromises.rename(imagePath, avatarPath);

		const avatarURL = `/avatars/${avatarFileName}`;
		await User.findByIdAndUpdate(userId, { avatarURL });

		await fsPromises.unlink(avatarPath);

		sendVerificationEmail(
			req.user.email,
			req.user.emailVerificationToken,
			sendgridApiKey
		);

		res.status(200).json({ avatarURL });
	} catch (error) {
		next(error);
	}
};

const verifyEmail = async (req, res, next) => {
	try {
		const { verificationToken } = req.params;

		const user = await User.findOne({
			emailVerificationToken: verificationToken,
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.emailVerificationToken = null;
		user.isEmailVerified = true;
		await user.save();

		res.status(200).json({ message: "Verification successful" });
	} catch (error) {
		next(error);
	}
};

const resendVerificationEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Missing required field email" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.isEmailVerified) {
			return res
				.status(400)
				.json({ message: "Verification has already been passed" });
		}

		const newVerificationToken = uuidv4();
		user.emailVerificationToken = newVerificationToken;
		await user.save();

		sendVerificationEmail(email, newVerificationToken, sendgridApiKey);

		res.status(200).json({ message: "Verification email sent" });
	} catch (error) {
		next(error);
	}
};

export { uploadAvatar, verifyEmail, resendVerificationEmail };
