import * as functions from "firebase-functions";
import express from "express";

import routes from "./routes/v1";

import { isAutheticated } from "./middleware/auth";
import { upload } from "./middleware/multer";

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const app: express.Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(upload.single("photo"));

// app.use("/uploads", express.static("uploads"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Firebase cloud functions",
      version: "1.0.0",
      description: "My first firebase serverless functions",
    },
    servers: [
      {
        url: "http://localhost:5001/fir-crud-d3f59/us-central1/app",
      },
    ],
  },
  apis: ["./routes/v1/*.ts"],
};

const specs = swaggerJsDoc(options);

app.use("/", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/auth", routes.authRourer);
app.use("/users", isAutheticated, routes.userRouter);

exports.app = functions.https.onRequest(app);
