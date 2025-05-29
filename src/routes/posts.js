const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const moment = require('moment');
const _ = require('lodash');

// 모든 게시물 조회
router.get('/', async (req, res, next) => {
  try {
    // MongoDB 연결 없이 더미 데이터 반환
    if (process.env.SKIP_MONGODB === 'true') {
      const dummyPosts = [
        {
          id: 1,
          title: '첫 번째 게시물',
          content: '이것은 첫 번째 게시물의 내용입니다. 더미 데이터로 생성되었습니다.',
          author: { username: '사용자1', email: 'user1@example.com' },
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          excerpt: '이것은 첫 번째 게시물의 내용입니다...'
        },
        {
          id: 2,
          title: '두 번째 게시물',
          content: '이것은 두 번째 게시물의 내용입니다. 더미 데이터로 생성되었습니다.',
          author: { username: '사용자2', email: 'user2@example.com' },
          createdAt: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
          excerpt: '이것은 두 번째 게시물의 내용입니다...'
        },
        {
          id: 3,
          title: '세 번째 게시물',
          content: '이것은 세 번째 게시물의 내용입니다. 더미 데이터로 생성되었습니다.',
          author: { username: '사용자3', email: 'user3@example.com' },
          createdAt: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
          excerpt: '이것은 세 번째 게시물의 내용입니다...'
        }
      ];
      return res.status(200).json(dummyPosts);
    }
    
    // MongoDB 연결이 있는 경우 실제 데이터 조회
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username email');
    
    // lodash를 사용한 데이터 처리 예시 (보안 취약점이 있는 버전 사용)
    const formattedPosts = _.map(posts, post => {
      return {
        ...post._doc,
        createdAt: moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        excerpt: _.truncate(post.content, { length: 100 })
      };
    });
    
    res.status(200).json(formattedPosts);
  } catch (err) {
    next(err);
  }
});

// 특정 게시물 조회
router.get('/:id', async (req, res, next) => {
  try {
    // MongoDB 연결 없이 더미 데이터 반환
    if (process.env.SKIP_MONGODB === 'true') {
      const dummyPost = {
        id: req.params.id,
        title: `게시물 ${req.params.id}`,
        content: `이것은 게시물 ${req.params.id}의 내용입니다. 더미 데이터로 생성되었습니다.`,
        author: { username: '사용자1', email: 'user1@example.com' },
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      return res.status(200).json(dummyPost);
    }
    
    // MongoDB 연결이 있는 경우 실제 데이터 조회
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email');
    
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    
    // moment를 사용한 날짜 포맷팅 예시 (보안 취약점이 있는 버전 사용)
    const formattedPost = {
      ...post._doc,
      createdAt: moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(post.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    };
    
    res.status(200).json(formattedPost);
  } catch (err) {
    next(err);
  }
});

// 게시물 생성
router.post('/', async (req, res, next) => {
  try {
    const { title, content, author } = req.body;
    
    // MongoDB 연결 없이 더미 응답 반환
    if (process.env.SKIP_MONGODB === 'true') {
      return res.status(201).json({
        id: Math.floor(Math.random() * 1000),
        title,
        content,
        author,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });
    }
    
    // MongoDB 연결이 있는 경우 실제 데이터 저장
    const newPost = new Post({
      title,
      content,
      author
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
});

// 게시물 업데이트
router.put('/:id', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    
    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
});

// 게시물 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndRemove(req.params.id);
    
    if (!deletedPost) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    
    res.status(200).json({ message: '게시물이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 특정 사용자의 모든 게시물 조회
router.get('/user/:userId', async (req, res, next) => {
  try {
    // MongoDB 연결 없이 더미 데이터 반환
    if (process.env.SKIP_MONGODB === 'true') {
      const dummyPosts = [
        {
          id: 1,
          title: '사용자의 첫 번째 게시물',
          content: '이것은 사용자의 첫 번째 게시물입니다.',
          author: {
            id: req.params.userId,
            username: `사용자${req.params.userId}`,
            email: `user${req.params.userId}@example.com`
          },
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: 2,
          title: '사용자의 두 번째 게시물',
          content: '이것은 사용자의 두 번째 게시물입니다.',
          author: {
            id: req.params.userId,
            username: `사용자${req.params.userId}`,
            email: `user${req.params.userId}@example.com`
          },
          createdAt: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
      ];
      return res.status(200).json(dummyPosts);
    }
    
    // MongoDB 연결이 있는 경우 실제 데이터 조회
    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username email');
    
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;