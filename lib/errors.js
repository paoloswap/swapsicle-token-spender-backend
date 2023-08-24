class LowBalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = "LowBalanceError";
  }
}

class LowGasError extends Error {
  constructor(message) {
    super(message);
    this.name = "LowGasError";
  }
}

module.exports = {
  LowBalanceError,
  LowGasError,
}