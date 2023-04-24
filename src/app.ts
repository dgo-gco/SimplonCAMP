// I Installed types in DevDependecies - This will ensure that the library is available during the compilation process and that your source code can reference its classes and methods
import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import Controller from "./tools/controller.interface";
import path from "path";
import cookieParser from 'cookie-parser';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    // this.express is being assigned the value of the imported express() function (before we assigned it to the app, and we had access by calling app)
    //in the class we'll have access to the same thing, but by callin this.express which is logic
    this.express = express();
    this.port = port;

    this.inizializarLosMiddleware();
    this.inizializarCors();
    this.inizializarYConectarBaseDatos();
    this.inizializarLosControllers(controllers);
  }

  private inizializarLosMiddleware(): void {
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json())
    this.express.use('/uploads', express.static(path.join('uploads')));
    this.express.use(cookieParser())
  }

  private inizializarCors(): void {
    this.express.use(cors({ 
      origin: "http://localhost:3000", 
      credentials: true 
     }))
  }

  private inizializarYConectarBaseDatos(): void {
    const { MONGODB_URI } = process.env;
    main().catch((err) => console.log(err));

    async function main() {
      await mongoose.connect(MONGODB_URI!);
      console.log("Connected to MongoDB");
    }  
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App is successfully listening on port ${this.port}`);
    });
  }

  private inizializarLosControllers(controllers: Controller[]): void {
    controllers.forEach((control: Controller) => {
      this.express.use("/api", control.router);
    });
  }
}

export default App;
