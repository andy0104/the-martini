import CustomError from "./customerror";

export default class DatabaseError extends CustomError {
  public statusCode = 502;
  
  constructor(public err: Error) {
    super('Database error');
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeErrors() {
    console.log(this.err.message);
    return [
      {
        message: this.err.message
      }
    ];
  }
}