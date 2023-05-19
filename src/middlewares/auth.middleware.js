import JwtService from "../services/jwt.service";
import {BadTokenError} from "../utils/ApiError"

const authMiddleware = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);

    const decoded = JwtService.jwtVerify(token);

    req.userId = decoded;

    return next();
  } catch (error) {
    next(new BadTokenError())
  }
};

export default authMiddleware;
