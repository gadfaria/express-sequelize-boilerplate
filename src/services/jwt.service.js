import crypto from "crypto";
import jwt from "jsonwebtoken";

/*
  Revoked tokens (jti -> exp). It lives in memory, so it is cleared on restart
  and not shared between instances. Use a store like Redis in production.
*/
const blacklist = new Map();

const removeExpiredTokens = () => {
  const now = Math.floor(Date.now() / 1000);
  for (const [jti, exp] of blacklist) {
    if (exp <= now) blacklist.delete(jti);
  }
};

const assertJwtEnabled = () => {
  if (process.env.SERVER_JWT !== "true")
    throw new Error("[JWT] JWT flag is not set");
};

const JwtService = {
  jwtSign: (payload) => {
    assertJwtEnabled();

    return jwt.sign({ payload }, process.env.SERVER_JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: Number(process.env.SERVER_JWT_TIMEOUT),
      jwtid: crypto.randomUUID(),
    });
  },

  jwtGetToken: (request) => {
    assertJwtEnabled();

    const [scheme, token] = (request.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token)
      throw new Error("[JWT] JWT token not provided");

    return token;
  },

  jwtVerify: (token) => {
    assertJwtEnabled();

    const decoded = jwt.verify(token, process.env.SERVER_JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (blacklist.has(decoded.jti))
      throw new Error("[JWT] JWT token was revoked");

    return decoded.payload;
  },

  jwtBlacklistToken: (token) => {
    removeExpiredTokens();

    const { jti, exp } = jwt.decode(token);
    console.log(`[JWT] Adding JWT with id ${jti} to blacklist`);
    blacklist.set(jti, exp);
  },
};

export default JwtService;
