import * as Yup from "yup";
import { ValidationError } from "./ApiError";

/**
 * Validates data against a Yup schema and returns only the fields it declares
 * @param {Yup.ObjectSchema} schema
 * @param {object} data
 * @returns {Promise<object>} - Validated data without unknown fields
 */
export const validate = async (schema, data) => {
  try {
    return await schema.validate(data ?? {}, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError)
      throw new ValidationError(error.errors.join(", "));
    throw error;
  }
};
