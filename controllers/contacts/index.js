import { indexContacts } from "./indexContacts.js";
import { showContacts } from "./showContacts.js";
import { deleteContacts } from "./deleteContacts.js";
import { updateContacts } from "./updateContacts.js";
import { createContacts } from "./createContacts.js";
import { updateStatusContactController } from "./updateStatusContact.js";

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

export {
	deleteContacts,
	createContacts,
	updateContacts,
	showContacts,
	indexContacts,
	updateStatusContactController,
};
