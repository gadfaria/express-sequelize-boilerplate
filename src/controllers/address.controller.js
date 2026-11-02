import * as Yup from "yup";
import Address from "../models/Address";
import { ConflictError } from "../utils/ApiError";
import { validate } from "../utils/validate";

let addressController = {
  add: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        city: Yup.string().required(),
        state: Yup.string().required(),
        neighborhood: Yup.string().required(),
        country: Yup.string().required(),
      });

      const data = await validate(schema, req.body);

      const addressExists = await Address.findOne({ where: data });

      if (addressExists) throw new ConflictError("Address already exists");

      const address = await Address.create(data);

      return res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  },
};

export default addressController;
