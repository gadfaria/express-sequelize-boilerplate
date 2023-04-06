import JwtService from "../services/jwt.service";

const authMiddleware = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);

    const decoded = JwtService.jwtVerify(token);

    req.userId = decoded;

    return next();
  } catch (error) {
    console.log("[EXPRESS] Unauthorized error with JWT validation \n", error);
    res.status(401).json({ error: "Token invalid" });
  }
};

export default authMiddleware;
