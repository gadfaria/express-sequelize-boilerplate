import * as Yup from "yup";
import Address from "../models/Address";
import { Errors } from "../utils/errors";

let addressController = {
  add: async (req, res) => {
    try {
      const schema = Yup.object().shape({
        city: Yup.string().required(),
        state: Yup.string().required(),
        neighborhood: Yup.string().required(),
        country: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: Errors.VALIDATION_FAILS });

      const addressExists = await Address.findOne({
        where: { ...req.body },
      });

      if (addressExists)
        return res.status(400).json({ error: Errors.ADDRESS_ALREADY_EXISTS });

      const address = await Address.create(req.body);

      return res.status(200).json(address);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },
};

export default addressController;
