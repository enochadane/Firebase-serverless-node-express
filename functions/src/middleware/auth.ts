import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import configs from "../config/configs";
import { admin } from "../config/firebase";

export const isAutheticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    req.body.idAuthorized = false;

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "UnAuthorized",
      });
    }

    const decoded: any = jwt.verify(token, configs.ACCESS_TOKEN_SECRET);
    const user = await admin.auth().getUser(decoded.id);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "UnAutorized",
      });
    }

    res.locals.userId = user.uid;
    res.locals.email = user.email;
    res.locals.isAuthorized = true;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
