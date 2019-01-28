class HTTPError extends Error {
  constructor(statusCode, message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError);
    }
    this.name = "HTTPError";
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = HTTPError;
