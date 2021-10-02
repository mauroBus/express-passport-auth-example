import StatusCodes from 'http-status-codes'

export class AppError extends Error {
  status: number

  constructor(
    msg: string,
    status?: number,
    stack = null,
  ) {
    super(msg)
    this.status = status || StatusCodes.BAD_REQUEST

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
