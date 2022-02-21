import * as express from "express";
import { signIn, signUp } from "../../controllers/auth";
import validateInputs from "../../validators";
import { singInValidator, signUpValidator } from "../../validators/auth";
// import { upload } from "../middleware/multer";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          rquired:
 *              -email
 *              -password
 *          properties:
 *              id:
 *                  type: string
 *                  description: the autogenerated uid of the user
 */

router.route("/signIn").post(validateInputs(singInValidator()), signIn);
router.route("/signUp").post(validateInputs(signUpValidator()), signUp);

export default router;