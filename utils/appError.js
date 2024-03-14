class AppError extends Error {
  constructor(message, statusCode) {
    //調用父類別 Error 的構造函數，並傳遞錯誤消息

    super(message);
    //把抓到的訊息丟出來
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
