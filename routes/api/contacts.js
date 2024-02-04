import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
	indexContacts,
	createContacts,
} from "../../controllers/contacts/indexContacts.js";

import {
	showContacts,
	deleteContacts,
	updateContacts,
	updateStatusContactController,
} from "../../controllers/contacts/index.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", indexContacts);
router.get("/:contactId", showContacts);
router.delete("/:contactId", deleteContacts);
router.put("/:contactId", updateContacts);
router.post("/", createContacts);
router.patch("/:contactId/favorite", updateStatusContactController);

export default router;
