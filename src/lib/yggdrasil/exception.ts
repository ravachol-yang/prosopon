class YggdrasilException {
  error: string;
  errorMessage: string;
  constructor(error: string, errorMessage: string) {
    this.error = error;
    this.errorMessage = errorMessage;
  }
  toJSON() {
    return {
      error: this.error,
      errorMessage: this.errorMessage,
    };
  }
}

export class ForbiddenOperationException extends YggdrasilException {
  static status = 403;
  constructor(errorMessage: string) {
    super("ForbiddenOperationException", errorMessage);
  }
}

export class IllegalArgumentException extends YggdrasilException {
  static status = 403;
  constructor() {
    super("IllegalArgumentException", "Access token already has a profile assigned.");
  }
}
