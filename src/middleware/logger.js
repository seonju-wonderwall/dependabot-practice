const moment = require('moment');

/**
 * 요청 로깅 미들웨어
 * 모든 HTTP 요청에 대한 정보를 콘솔에 출력합니다.
 */
const logger = (req, res, next) => {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // 응답이 완료된 후 응답 상태 코드 로깅
  res.on('finish', () => {
    const statusCode = res.statusCode;
    const statusMessage = res.statusMessage || '';
    console.log(`[${timestamp}] ${method} ${url} - Status: ${statusCode} ${statusMessage}`);
  });
  
  next();
};

module.exports = logger;