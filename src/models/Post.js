const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 게시물 스키마
 */
const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, '제목은 필수입니다.'],
    trim: true,
    minlength: [3, '제목은 최소 3자 이상이어야 합니다.'],
    maxlength: [100, '제목은 최대 100자까지 가능합니다.']
  },
  content: {
    type: String,
    required: [true, '내용은 필수입니다.'],
    minlength: [10, '내용은 최소 10자 이상이어야 합니다.']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '작성자는 필수입니다.']
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 인덱스 설정
PostSchema.index({ title: 'text', content: 'text' });

// 인스턴스 메서드 예시
PostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// 정적 메서드 예시
PostSchema.statics.findByTag = function(tag) {
  return this.find({ tags: tag });
};

// 가상 필드 예시
PostSchema.virtual('excerpt').get(function() {
  return this.content.length > 100 
    ? this.content.substring(0, 100) + '...' 
    : this.content;
});

// 미들웨어 예시 (저장 전 업데이트 시간 갱신)
PostSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);