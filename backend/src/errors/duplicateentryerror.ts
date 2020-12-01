import CustomError from "./customerror";

export default class DuplicateEntryError extends CustomError {
  public statusCode = 409;

  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, DuplicateEntryError.prototype);
  }
  
  serializeErrors() {
    return [{
      message: this.msg
    }]
  }
}