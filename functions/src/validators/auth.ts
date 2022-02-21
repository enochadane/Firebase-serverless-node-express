import { check } from "express-validator";
// import { admin } from "../config/firebase";

// const isValidEmail: CustomValidator = async (email) => {
//   const user = await admin.auth().getUserByEmail(email);
//   if (user) {
//     return new Error("Email is in use by a different account.");
//   }
//   return true;
// };

export const signUpValidator = () => [
  check("email")
    .notEmpty()
    .withMessage("Email should not be empty.")
    .isEmail()
    .withMessage("Please, provide a valid email."),

  check("password")
    .notEmpty()
    .withMessage("Password should not be empty.")
    .isLength({ min: 8 })
    .withMessage("Password should not be less that 8 characters."),

  check("name").notEmpty().withMessage("Name should not be empty."),

  check("color").notEmpty().withMessage("Color should not be empty."),

  check("age").notEmpty().withMessage("Age should not be empty."),

  check("height").notEmpty().withMessage("Height should not be empty."),
];

export const singInValidator = () => [
  check("email")
    .notEmpty()
    .withMessage("Email should not be empty.")
    .isEmail()
    .withMessage("Please, provide a valid email."),

  check("password").notEmpty().withMessage("Password should not be empty."),
];
