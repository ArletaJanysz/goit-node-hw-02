// routes/api/users.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { signup } from "../../controllers/users/signup.js";
import { login } from "../../controllers/users/login.js";
import { logout } from "../../controllers/users/logout.js";
import { currentUser } from "../../controllers/users/currentUser.js";
import { updateSubscription } from "../../controllers/users/updateSubscription.js";
import { uploadAvatar } from "../../controllers/users/signup.js";
import { updateAvatar } from "../../controllers/users/updateAvatar.js";
import { verifyUser } from "../../controllers/users/users.js";
import { resendVerificationEmail } from "../../controllers/users/users.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current", currentUser);
router.patch("/update-subscription", updateSubscription);
router.post("/upload-avatar", uploadAvatar);
router.patch("/avatars", updateAvatar);
router.post("/verify", resendVerificationEmail);
router.get("/verify/:verificationToken", verifyUser);

export default router;
