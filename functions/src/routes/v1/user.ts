import * as express from "express";
import { getUsers, updateUser, deleteUser } from "../../controllers/user";

const router = express.Router();

router.get("/", getUsers);
router.patch("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
