import { TokenExpiredError as JwtExpiredError } from "jsonwebtoken";
import JwtService from "../services/jwt.service";
import { BadTokenError, TokenExpiredError } from "../utils/ApiError";

const authMiddleware = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);

    req.userId = JwtService.jwtVerify(token);

    return next();
  } catch (error) {
    next(error instanceof JwtExpiredError ? new TokenExpiredError() : new BadTokenError());
  }
};

export default authMiddleware;
