const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

// 모든 사용자 조회
router.get('/', async (req, res, next) => {
  try {
    // MongoDB 연결 없이 더미 데이터 반환
    if (process.env.SKIP_MONGODB === 'true') {
      const dummyUsers = [
        { id: 1, username: '사용자1', email: 'user1@example.com', role: 'user', createdAt: new Date() },
        { id: 2, username: '사용자2', email: 'user2@example.com', role: 'admin', createdAt: new Date() },
        { id: 3, username: '사용자3', email: 'user3@example.com', role: 'user', createdAt: new Date() }
      ];
      return res.status(200).json(dummyUsers);
    }
    
    // MongoDB 연결이 있는 경우 실제 데이터 조회
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// 특정 사용자 조회
router.get('/:id', async (req, res, next) => {
  try {
    // MongoDB 연결 없이 더미 데이터 반환
    if (process.env.SKIP_MONGODB === 'true') {
      const dummyUser = {
        id: req.params.id,
        username: '사용자' + req.params.id,
        email: `user${req.params.id}@example.com`,
        role: 'user',
        createdAt: new Date()
      };
      return res.status(200).json(dummyUser);
    }
    
    // MongoDB 연결이 있는 경우 실제 데이터 조회
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// 사용자 생성
router.post('/', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // MongoDB 연결 없이 더미 응답 반환
    if (process.env.SKIP_MONGODB === 'true') {
      return res.status(201).json({
        id: Math.floor(Math.random() * 1000),
        username,
        email,
        role: 'user',
        createdAt: new Date()
      });
    }
    
    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }
    
    const newUser = new User({
      username,
      email,
      password
    });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

// 사용자 정보 업데이트
router.put('/:id', async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// 사용자 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndRemove(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    
    res.status(200).json({ message: '사용자가 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 외부 API에서 사용자 데이터 가져오기 (axios 사용 예시)
router.get('/external/users', async (req, res, next) => {
  try {
    // 실제 외부 API 호출
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    res.status(200).json(response.data);
  } catch (err) {
    // API 호출 실패 시 더미 데이터 반환
    const dummyExternalUsers = [
      { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz' },
      { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'Shanna@melissa.tv' },
      { id: 3, name: 'Clementine Bauch', username: 'Samantha', email: 'Nathan@yesenia.net' }
    ];
    res.status(200).json(dummyExternalUsers);
  }
});

module.exports = router;