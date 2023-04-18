import { Request, Response, Router } from "express";
import User from "../models/userModel";
import Controller from "../tools/controller.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController implements Controller {
  path = "/users";
  router = Router();

  constructor() {
    this.initializeRoute();
  }

  initializeRoute() {
    this.router.get(`${this.path}/get-users`, this.getUsers);
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.logIn);
    this.router.put(`${this.path}/update/:id`, this.editUser);
    this.router.delete(`${this.path}/delete/:id`, this.deleteUser);
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      const allUsers = await User.find({})
      return res.status(200).json({
        msg: 'All users here',
        allUsers
      })
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      console.log(email)
      if (!(username || email || password)) {
        return res.status(200).json({
          msg: "All fields are required",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashPassword,
      });

      const token = jwt.sign({}, process.env.SECRET_TOKEN!, {
        expiresIn: "1d",
      });
      newUser.token = token;

      return res.status(200).json({
        msg: "User successfully created",
        newUser,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  };

  logIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!(email || password)) {
        return res.status(200).json({
          msg: "Please fill all the fields",
        });
      }
      const userExists = await User.findOne({ email });
      if (!userExists) {
        return res.status(200).json({
          msg: "Please register to log in",
        });
      }

      if (userExists && (await bcrypt.compare(password, userExists.password))) {
        const token = jwt.sign({}, process.env.SECRET_TOKEN!, {
          expiresIn: "1d",
        });
        userExists.token = token;
        return res.status(200).json({
          msg: "Successfully logged in",
          userExists
        });
      }
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  };

  editUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(id, req.body);
      if (!user) {
        return res.status(200).send({
          msg: "User not registered",
        });
      }
      return res.status(200).send({
        msg: "User found:",
        user,
      });
    } catch (error) {
      return res.status(500).send({
        msg: "Ups! Something went wrong",
      });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(200).send({
          msg: "User not registered",
        });
      }
      return res.status(200).send({
        msg: "User deleted",
        user,
      });
    } catch (error) {
      return res.status(500).send({
        msg: "Ups! Something went wrong",
      });
    }
  };
}

export default UserController;
