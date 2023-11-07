class HttpError extends Error {
  code: number;
  success: boolean;
  constructor(message: string, errorCode: number, errorSuccess?: boolean) {
    super(message); //Add a "message" properties
    this.code = errorCode; //Add a "code" properties
    this.success = errorSuccess; //Add a "success" properties
  }
}

export default HttpError;
