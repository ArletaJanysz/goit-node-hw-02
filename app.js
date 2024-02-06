// app.js
import express from "express";
import dotenv from "dotenv";
import contactsRouter from "./routes/api/contacts.js";
import usersRouter from "./routes/api/users.js";
import path from "path";
import multer from "multer";
import sgMail from "@sendgrid/mail";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "tmp");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const currentModuleFile = new URL(import.meta.url).pathname;
const currentModuleDir = path.dirname(currentModuleFile);
app.use(
	"/avatars",
	express.static(path.join(currentModuleDir, "public", "avatars"))
);

app.patch("/api/users/avatars", upload.single("avatar"), (req, res) => {
	res.status(200).json({ message: "Avatar uploaded successfully" });
});

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);


export { app };
