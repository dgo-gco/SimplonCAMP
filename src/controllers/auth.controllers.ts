import { Request, Response, Router } from "express";
import User from "../models/userModel";
import Controller from "../tools/controller.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

class authController implements Controller {
  path = "/auth";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/`);
    this.router.get(`${this.path}/refresh`);
    this.router.post(`${this.path}/logout`);
  }

  logIn = asyncHandler(async (req: any, res: any) => {
    try {
      const { username, password } = req.body;
      if (!(username || password)) {
        return res.status(200).json({
          msg: "All fields are required",
        });
      }

      const foundUser = await User.findOne({ username }).exec();

      if (!foundUser) {
        return res.status(200).json({
          msg: "Not authorized",
        });
      }

      const match = await bcrypt.compare(password, foundUser.password);

      if (!match) return res.status(200).json({ msg: "Not authorized" });

      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      const refreshToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
          },
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  });

  refresh = (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(200).json({ msg: "Not authorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.ACCESS_TOKEN_SECRET!,
      async (err: any, decoded: any) => {
        if (err) return res.status(403).json({ msg: "Forbidden" });

        const foundUser = await User.findOne({ username: decoded.username });
        if (!foundUser) return res.status(403).json({ msg: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
            },
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: "1d" }
        );
        res.json({ accessToken });
      }
    );
  };

  logOut = (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(200).json({ msg: "Not authorized" });
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ msg: "Cookie cleared" });
  };
}
