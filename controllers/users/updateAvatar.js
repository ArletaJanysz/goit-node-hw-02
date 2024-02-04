import path from "path";
import jimp from "jimp";
import fs from "fs/promises";

async function updateAvatar(req, res) {
	try {
		const { user } = req;

		if (!req.file) {
			return res.status(400).json({ message: "No avatar uploaded" });
		}

		const avatarPath = req.file.path;
		const avatarExt = path.extname(req.file.originalname);
		const uniqueFileName = `${user._id}_${Date.now()}${avatarExt}`;

		const image = await jimp.read(avatarPath);
		await image.resize(250, 250).write(path.join("tmp", uniqueFileName));

		const newPath = path.join("public", "avatars", uniqueFileName);
		await image.write(newPath);

		user.avatarURL = `/avatars/${uniqueFileName}`;
		await user.save();

		await fs.promises.unlink(avatarPath);

		return res.status(200).json({ avatarURL: user.avatarURL });
	} catch (err) {
		return res
			.status(500)
			.json({ message: `An error occurred: ${err.message}` });
	}
}

export { updateAvatar };
