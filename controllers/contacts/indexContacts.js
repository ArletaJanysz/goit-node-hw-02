import { listContacts, addContact } from "../../models/contacts.js";
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

async function indexContacts(req, res, next) {
	try {
		const { page = 1, limit = 20, favorite } = req.query;
		const filters = {};

		if (favorite !== undefined) {
			filters.favorite = favorite;
		}

		const contacts = await listContacts(page, limit, filters);

		return res.status(200).json({
			contacts,
		});
	} catch (err) {
		return res.status(500).json(`An error occurred: ${err}`);
	}
}

async function createContacts(req, res, next) {
	const { body } = req;

	try {
		body.owner = req.user._id;

		const newContact = await addContact(body);
		return res.status(201).json(newContact);
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
}

export { indexContacts, createContacts, authenticateUser };
