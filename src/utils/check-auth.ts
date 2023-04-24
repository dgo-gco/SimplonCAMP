import jwt from "jsonwebtoken";

export const isAuth = async (context: any) => {
  try {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
      const token = authHeader.split("Bearer ")[1];
      if (!token) {
        try {
          const user = jwt.verify(token, process.env.SECRET_TOKEN!);
          return user;
        } catch (error) {
          throw new Error("Invalid token");
        }
      }
      throw new Error("Authentication token must be Bearer");
    }
  } catch (error) {
    throw new Error("auth token must be provided");
  }
};
