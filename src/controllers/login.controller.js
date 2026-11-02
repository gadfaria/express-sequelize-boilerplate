import * as Yup from "yup";
import User from "../models/User";
import JwtService from "../services/jwt.service";
import { UnauthorizedError } from "../utils/ApiError";
import { validate } from "../utils/validate";

let loginController = {
  login: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      const { email, password } = await validate(schema, req.body);

      const user = await User.findOne({ where: { email } });

      // Same error for unknown email and wrong password, so emails can't be enumerated
      if (!user || !(await user.checkPassword(password)))
        throw new UnauthorizedError();

      const token = JwtService.jwtSign(user.id);

      return res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));

      res.status(200).json({ msg: "Logged out" });
    } catch (error) {
      next(error);
    }
  },
};

export default loginController;
