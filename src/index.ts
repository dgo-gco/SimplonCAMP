import dotenv from "dotenv";
import App from './app'
import UserController from "./controllers/userController";
dotenv.config();

//App is expecting two arguments, the application, and the port in the app.ts we can see
const app = new App(
  [
    new UserController(),
  ],
  Number(process.env.PORT)
);

app.listen();
