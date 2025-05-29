const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 사용자 스키마
 */
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, '사용자 이름은 필수입니다.'],
    trim: true,
    minlength: [3, '사용자 이름은 최소 3자 이상이어야 합니다.'],
    maxlength: [50, '사용자 이름은 최대 50자까지 가능합니다.']
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '유효한 이메일 주소를 입력해주세요.'
    ]
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다.']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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

// 비밀번호 해싱 등의 기능은 생략 (실제 프로덕션에서는 구현해야 함)

// 가상 필드 예시
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// 인스턴스 메서드 예시
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; // 응답에서 비밀번호 제외
  return user;
};

// 정적 메서드 예시
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

module.exports = mongoose.model('User', UserSchema);