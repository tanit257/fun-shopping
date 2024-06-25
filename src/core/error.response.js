"use strict";

const { extend } = require("lodash");

const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ReasonStatusCode = {
  [StatusCode.OK]: "OK",
  [StatusCode.CREATED]: "Created",
  [StatusCode.NO_CONTENT]: "No Content",
  [StatusCode.BAD_REQUEST]: "Bad Request",
  [StatusCode.UNAUTHORIZED]: "Unauthorized",
  [StatusCode.FORBIDDEN]: "Forbidden",
  [StatusCode.NOT_FOUND]: "Not Found",
  [StatusCode.CONFLICT]: "Conflict",
  [StatusCode.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.CONFLICT],
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.BAD_REQUEST],
    statusCode = StatusCode.BAD_REQUEST
  ) {
    console.log("====", message, statusCode);
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.NOT_FOUND],
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.FORBIDDEN],
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.UNAUTHORIZED],
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[StatusCode.INTERNAL_SERVER_ERROR],
    statusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  InternalServerError,
};
