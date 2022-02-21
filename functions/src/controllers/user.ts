import { Request, Response, NextFunction } from "express";
import { db } from "../config/firebase";
// import { IUser } from "../models/user";

type UserType = {
  name: string;
  color: string;
  age: number;
  height: number;
};

//store last document
let latestDoc: any = null;

export const getUsers = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const name = req.query.name as string;
    const color = req.query.color as string;
    const age = req.query.age as string;

    let users: UserType[] = [];
    const ref = db
      .collection("users")
      .where("name", "==", name.toLowerCase())
      .where("color", "==", color.toLowerCase())
      .where("age", "==", parseInt(age))
      .orderBy("created_at")
      .startAfter(latestDoc || 0)
      .limit(2);
    const querySnapshot = await ref.get();
    querySnapshot.forEach((doc: any) => {
      let { name, age, color, height } = doc.data();
      const obj = {
        name,
        age,
        color,
        height,
      };
      users = [...users, obj];
    });

    latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return res.status(200).json({ success: true, message: users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: (error as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  console.log("update user function");

  const {
    body: { name, age, color, height },
    params: { userId },
  } = req;

  try {
    const user = db.collection("users").doc(userId);
    const currentData = (await user.get()).data() || {};

    const userObject = {
      email: currentData.email,
      password: currentData.password,
      created_at: currentData.created_at,
      name: name || currentData.name,
      age: age || currentData.age,
      color: color || currentData.color,
      height: height || currentData.height,
    };

    await user.set(userObject).catch((error) => {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    });

    const {
      name: username,
      age: userage,
      color: usercolor,
      height: userheight,
    } = userObject;
    const userInfo = {
      username,
      userage,
      usercolor,
      userheight,
    };

    return res.status(201).json({
      success: true,
      message: userInfo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = db.collection("users").doc(userId);

    await user.delete().catch((error) => {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    });

    return res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
