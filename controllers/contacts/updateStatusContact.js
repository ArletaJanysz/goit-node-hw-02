import { updateStatusContact } from "../../models/contacts.js";

import User from "../../models/users.js";

const authenticateUser = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: decoded._id, token });
		if (!user) {
			throw new Error();
		}
		req.user = user;
		req.token = token;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

async function updateStatusContactController(req, res) {
	const { contactId } = req.params;
	const { body } = req;

	try {
		if (!body.hasOwnProperty("favorite")) {
			return res.status(400).json({ message: "missing field favorite" });
		}

		const updatedContact = await updateStatusContact(contactId, body);

		return res.status(200).json(updatedContact);
	} catch (err) {
		if (err.message === "Contact not found") {
			return res.status(404).json({ message: "Not found" });
		} else {
			return res.status(400).json({ message: err.message });
		}
	}
}

export { updateStatusContactController };
