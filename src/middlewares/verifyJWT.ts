import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt
  console.log(token);
  
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader)

    //! POINT TO ES6 when using TypeScript

  if(token){
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, decoded: any) => {
          if(err) return res.status(403).send({msg: 'Forbidden'})
          req.user = decoded.username
          next()
      }
    );
  } else {
    res.status(400).send({
      msg: 'forbidden'
    })
  }
};

export default verifyToken
