import { ValidationError } from "express-validator";
import CustomError from "./customerror";

export default class RequestValidationError extends CustomError {
  public statusCode: number = 422;

  constructor(public formattedErrors: ValidationError[]) {
    super('Request validation error');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.formattedErrors.map(error => {
      return {
        message: error.msg,
        parameter: error.param
      }
    });
  }
}