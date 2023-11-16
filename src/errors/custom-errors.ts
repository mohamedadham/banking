export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InsufficientBalanceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class EntityAlreadyExistError extends Error {
  constructor(message: string) {
    super(message);
  }
}
