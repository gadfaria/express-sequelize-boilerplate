import User from "../models/User";
import JwtService from "../services/jwt.service";
import * as Yup from "yup";
import { Errors } from "../utils/errors";
import {ValidationError, BadRequestError, UnauthorizedError} from "../utils/ApiError"

let loginController = {
  login: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body)))throw new ValidationError()

      let { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) throw new BadRequestError(Errors.NONEXISTENT_USER.message);

      if (!(await user.checkPassword(password)))throw new UnauthorizedError(Errors.WRONG_PASSWORD.message);


      const token = JwtService.jwtSign(user.id);

      return res.status(200).json({ user, token });
    } catch (error) {
      next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));

      res.status(200).json({ msg: "Authorized" });
    } catch (error) {
      next(error)
    }
  },
};

export default loginController;
