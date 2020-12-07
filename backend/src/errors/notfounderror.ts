import CustomError from "./customerror";

export default class NotFoundError extends CustomError {
  public statusCode = 404;

  constructor() {
    super('The page you are looking for does not exist');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{
      message: 'The page you are looking for does not exist'
    }];
  }
}