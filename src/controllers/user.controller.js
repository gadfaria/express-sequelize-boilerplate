import * as Yup from "yup";
import Address from "../models/Address";
import User from "../models/User";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/ApiError";
import { validate } from "../utils/validate";

//Yup is a JavaScript schema builder for value parsing and validation.

let userController = {
  add: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
      });

      const data = await validate(schema, req.body);

      const userExists = await User.findOne({
        where: { email: data.email },
      });

      if (userExists) throw new ConflictError("Email already in use");

      const user = await User.create(data);

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  addAddress: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        city: Yup.string().required(),
        state: Yup.string().required(),
        neighborhood: Yup.string().required(),
        country: Yup.string().required(),
      });

      const data = await validate(schema, req.body?.address);

      const user = await User.findByPk(req.userId);

      if (!user) throw new NotFoundError("User not found");

      const [address] = await Address.findOrCreate({ where: data });

      await user.addAddress(address);

      return res.status(200).json(await user.reload({ include: Address }));
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const users = await User.findAll();

      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  find: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      // Non-numeric ids would make the database throw instead of finding nothing
      const user = Number.isInteger(id) ? await User.findByPk(id) : null;

      if (!user) throw new NotFoundError("User not found");

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().when("password", ([password], field) =>
          password ? field.required() : field
        ),
        password: Yup.string().min(6),
        confirmPassword: Yup.string().when("password", ([password], field) =>
          password
            ? field.required().oneOf([Yup.ref("password")], "Passwords must match")
            : field
        ),
      });

      const { oldPassword, confirmPassword, ...changes } = await validate(
        schema,
        req.body
      );

      const user = await User.findByPk(req.userId);

      if (!user) throw new NotFoundError("User not found");

      if (changes.email && changes.email !== user.email) {
        const userExists = await User.findOne({
          where: { email: changes.email },
        });

        if (userExists) throw new ConflictError("Email already in use");
      }

      if (changes.password && !(await user.checkPassword(oldPassword)))
        throw new UnauthorizedError();

      const updatedUser = await user.update(changes);

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) throw new NotFoundError("User not found");

      await user.destroy();

      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
