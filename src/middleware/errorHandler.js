/**
 * 전역 에러 처리 미들웨어
 * 애플리케이션에서 발생하는 모든 에러를 처리합니다.
 */
const errorHandler = (err, req, res, next) => {
  // 에러 로깅
  console.error(`에러 발생: ${err.message}`);
  console.error(err.stack);
  
  // 몽구스 유효성 검사 에러 처리
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      error: '유효성 검사 실패',
      messages
    });
  }
  
  // 몽구스 중복 키 에러 처리
  if (err.code === 11000) {
    return res.status(400).json({
      error: '중복된 데이터',
      message: '이미 존재하는 데이터입니다.'
    });
  }
  
  // 몽구스 캐스팅 에러 처리
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: '잘못된 데이터 형식',
      message: `잘못된 ${err.path}: ${err.value}`
    });
  }
  
  // 기본 에러 응답
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || '서버 오류가 발생했습니다.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;