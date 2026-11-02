import { UniqueConstraintError } from "sequelize";
import { ConflictError, IsApiError } from "../utils/ApiError";

/**
 * Global error handler for all routes
 * @param {Error} err
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  // A unique column rejected the write, e.g. two signups racing for the same email
  if (err instanceof UniqueConstraintError) err = new ConflictError();

  if (IsApiError(err))
    return res.status(err.statusCode).json({ type: err.type, message: err.message });

  // Client errors raised by express itself, e.g. a malformed JSON body
  if (err.expose && err.status < 500)
    return res.status(err.status).json({ type: "BAD_REQUEST", message: err.message });

  console.log(err);
  const message =
    process.env.NODE_ENV === "development" ? err.message : "Something went wrong";
  return res.status(500).json({ type: "SERVER_ERROR", message });
};
