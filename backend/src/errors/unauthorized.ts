import CustomError from "./customerror";

export default class Unauthorized extends CustomError {
  public statusCode = 401;

  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, Unauthorized.prototype);    
  }

  serializeErrors() {
    return [{
      message: this.msg
    }];
  }
}