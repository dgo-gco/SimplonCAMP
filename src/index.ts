import dotenv from "dotenv";
import App from './app'
import { CampingController } from "./controllers/camping.controller";
import UserController from "./controllers/userController";
dotenv.config();

//App is expecting two arguments, the application, and the port in the app.ts we can see
const app = new App(
  [
    new UserController(),
    new CampingController()
  ],
  Number(process.env.PORT)
);

app.listen();
