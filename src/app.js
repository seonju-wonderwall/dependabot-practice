const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment');
const _ = require('lodash');

// 라우트 파일 가져오기
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

// 미들웨어 가져오기
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Express 앱 초기화
const app = express();

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

// 템플릿에서 사용할 전역 변수 설정
app.use((req, res, next) => {
  res.locals.moment = moment;
  res.locals._ = _;
  next();
});

// 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// API 라우트
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'API 엔드포인트에 오신 것을 환영합니다.',
    endpoints: [
      '/api/users',
      '/api/posts',
      '/users',
      '/posts'
    ]
  });
});

// 홈 라우트
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Express 애플리케이션',
    message: 'Dependabot 연습용 구식 Express 애플리케이션에 오신 것을 환영합니다!'
  });
});

// 에러 핸들러 미들웨어 (반드시 다른 미들웨어 이후에 설정)
app.use(errorHandler);

// MongoDB 연결 설정
const MONGODB_URI = 'mongodb://localhost:27017/dependabot_practice';

// 환경 변수 설정 - MongoDB 연결 건너뛰기
process.env.SKIP_MONGODB = 'true';

// 환경 변수 SKIP_MONGODB가 설정되어 있지 않은 경우에만 MongoDB 연결 시도
if (process.env.SKIP_MONGODB !== 'true') {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then(() => {
      console.log('MongoDB에 연결되었습니다.');
    })
    .catch(err => {
      console.error('MongoDB 연결 오류:', err);
      console.log('MongoDB 연결 없이 계속 진행합니다.');
    });
} else {
  console.log('MongoDB 연결을 건너뛰고 계속 진행합니다.');
}

// 서버 시작
const PORT = process.env.PORT || 3005; // 기본 포트를 3005로 변경
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT}에서 애플리케이션에 접속할 수 있습니다.`);
});

module.exports = app;