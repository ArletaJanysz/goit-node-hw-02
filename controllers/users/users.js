import User from "../../models/users.js";

async function verifyUser(req, res) {
	try {
		const { verificationToken } = req.params;

		const user = await User.findOne({ verificationToken });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.verify = true;
		user.verificationToken = null;
		await user.save();

		return res.status(200).json({ message: "Verification successful" });
	} catch (err) {
		return res
			.status(500)
			.json({ message: `An error occurred: ${err.message}` });
	}
}

async function resendVerificationEmail(req, res) {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "missing required field email" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.verify) {
			return res
				.status(400)
				.json({ message: "Verification has already been passed" });
		}

		const verificationLink = `${process.env.BASE_URL}/api/users/verify/${user.verificationToken}`;
		const msg = {
			to: user.email,
			from: "arleta.janysz@gmail.com",
			subject: "Email Verification",
			text: `Click on the following link to verify your email: ${verificationLink}`,
			html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
		};
		await sgMail.send(msg);

		return res.status(200).json({ message: "Verification email sent" });
	} catch (err) {
		return res
			.status(500)
			.json({ message: `An error occurred: ${err.message}` });
	}
}

export { verifyUser, resendVerificationEmail };
