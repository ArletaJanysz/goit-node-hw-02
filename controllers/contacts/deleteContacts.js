import { removeContact } from "../../models/contacts.js";
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

async function deleteContacts(req, res, next) {
	const { contactId } = req.params;

	try {
		await removeContact(contactId);
		return res.status(200).json({ message: "Contact deleted" });
	} catch (err) {
		return res.status(404).json({ message: "Not found" });
	}
}

export { deleteContacts };
