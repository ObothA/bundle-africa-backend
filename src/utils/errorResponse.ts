interface ErrorResponse {
  message: string;
  statusCode: number;
}

class ErrorResponse extends Error {
  constructor(message?: string, statusCode?: number) {
    super(message);
    if (statusCode) {
      this.statusCode = statusCode;
    }
  }
}

export default ErrorResponse;
