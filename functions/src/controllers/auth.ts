import { Request, Response } from "express";
import * as config from "../config/configs";
import * as jwt from "jsonwebtoken";
import { admin, db } from "../config/firebase";
import { IUser } from "../models/user";
import * as bcrypt from "bcrypt";
import { DateTime } from "luxon";

// const uploadImage = (req: any, res: any) => {
//   if (!req.file) {
//     res.status(400).json({ success: false, message: "Error: No files found" });
//   } else {
//     const blob = bucket.file(req.file.originalname);
//     const blobWriter = blob.createWriteStream({
//       metadata: {
//         contentType: req.file.mimetype,
//       },
//     });

//     blobWriter.on("error", (err) => {
//       console.log(err);
//     });

//     blobWriter.on("finish", () => {
//       // const photoURL = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
//       res
//         .status(200)
//         .json({ success: true, message: "File uploaded successflly" });
//     });

//     blobWriter.end(req.file.buffer);
//   }
// }

// Singin from web client
// POST method
// REST API https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDutAKmI2xvAqHOn3Mixhc2sjQWzlDCXRQ

export const signIn = async (req: Request, res: Response) => {
  try {
    const user = await admin.auth().getUserByEmail(req.body.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }
    await admin.auth().updateUser(user.uid, {
      emailVerified: true,
    });
    const payload = {
      id: user.uid,
      email: user.email,
    };

    const dbUser: any = await (
      await db.collection("users").doc(user.uid).get()
    ).data();

    const isMatched = await bcrypt.compare(req.body.password, dbUser?.password);

    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const token = await jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: "5d",
    });

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .end({ success: false, message: (error as Error).message });
  }
};

export const signUp = async (req: Request, res: Response) => {
  // uploadImage(req, res);

  const user: IUser = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    name: req.body.name.toLowerCase(),
    color: req.body.color.toLowerCase(),
    height: req.body.height,
    age: req.body.age,
    photoURL: req.body.photoURL,
    createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_FULL),
  };
  console.log(user);
  let userFound = false;
  try {
    const existingUser = await admin.auth().getUserByEmail(user.email);
    if (existingUser) {
      userFound = true;
    }
    console.log(existingUser, "existing user");
  } catch (error) {}

  // let photoURL: String;
  // if (req.file) {
  //   photoURL = req.file.path;
  // }

  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(req.body.password, salt);

  if (userFound) {
    return res
      .status(401)
      .send({ success: false, message: "User already exists" });
  } else {
    admin
      .auth()
      .createUser({
        email: user.email,
        password: user.password,
      })
      .then((cred) => {
        return db.collection("users").doc(cred.uid).set({
          email: user.email,
          password: hashed_password,
          name: user.name,
          color: user.color,
          height: user.height,
          age: user.age,
          created_at: user.createdAt,
        });
      })
      .catch((error) => {
        console.log((error as Error).message);
        return res.status(401).send({ message: (error as Error).message });
      });
    return res
      .status(201)
      .send({ success: true, message: "User created successfully" });
  }
};

export const signOut = async () => {};
