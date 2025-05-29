/**
 * 메인 JavaScript 파일
 * 클라이언트 측 기능을 구현합니다.
 * 
 * 보안 취약점이 있는 lodash 버전을 사용하는 예시를 포함합니다.
 */

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  console.log('애플리케이션이 로드되었습니다.');
  
  // 토스트 메시지 초기화
  initializeToasts();
  
  // 폼 유효성 검사 초기화
  initializeFormValidation();
  
  // 모바일 메뉴 토글 초기화
  initializeMobileMenu();
});

/**
 * 토스트 메시지 초기화
 */
function initializeToasts() {
  // Bootstrap 토스트 초기화
  $('.toast').toast({
    autohide: true,
    delay: 3000
  });
  
  // 토스트 메시지 표시
  $('.toast').toast('show');
}

/**
 * 폼 유효성 검사 초기화
 */
function initializeFormValidation() {
  // 부트스트랩 폼 유효성 검사 활성화
  const forms = document.querySelectorAll('.needs-validation');
  
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      form.classList.add('was-validated');
    }, false);
  });
}

/**
 * 모바일 메뉴 토글 초기화
 */
function initializeMobileMenu() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  
  if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
      const target = document.querySelector(this.getAttribute('data-target'));
      if (target) {
        target.classList.toggle('show');
      }
    });
  }
}

/**
 * API 요청 함수
 * axios를 사용하여 API 요청을 보냅니다. (보안 취약점이 있는 버전 사용)
 */
function apiRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const config = {
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    axios(config)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.error('API 요청 오류:', error);
        reject(error);
      });
  });
}

/**
 * 날짜 포맷팅 함수
 * moment.js를 사용하여 날짜를 포맷팅합니다. (보안 취약점이 있는 버전 사용)
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(format);
}

/**
 * 문자열 처리 함수
 * lodash를 사용하여 문자열을 처리합니다. (보안 취약점이 있는 버전 사용)
 */
function truncateText(text, length = 100) {
  return _.truncate(text, {
    length: length,
    separator: /,? +/
  });
}

/**
 * 사용자 프로필 로드 함수
 */
function loadUserProfile(userId) {
  apiRequest('GET', `/api/users/${userId}`)
    .then(user => {
      // 사용자 프로필 정보 표시
      document.getElementById('username').textContent = user.username;
      document.getElementById('email').textContent = user.email;
      document.getElementById('role').textContent = user.role;
      document.getElementById('createdAt').textContent = formatDate(user.createdAt);
    })
    .catch(error => {
      showAlert('사용자 정보를 불러오는 중 오류가 발생했습니다.', 'danger');
    });
}

/**
 * 게시물 목록 로드 함수
 */
function loadPosts(page = 1, limit = 10) {
  apiRequest('GET', `/api/posts?page=${page}&limit=${limit}`)
    .then(response => {
      const postsContainer = document.getElementById('posts-container');
      
      if (postsContainer) {
        postsContainer.innerHTML = '';
        
        if (response.posts && response.posts.length > 0) {
          response.posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
          });
        } else {
          postsContainer.innerHTML = '<div class="alert alert-info">등록된 게시물이 없습니다.</div>';
        }
      }
    })
    .catch(error => {
      showAlert('게시물을 불러오는 중 오류가 발생했습니다.', 'danger');
    });
}

/**
 * 게시물 요소 생성 함수
 */
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'col-md-6 mb-4';
  
  postDiv.innerHTML = `
    <div class="card h-100">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <a href="/posts/${post._id}">${post.title}</a>
        </h5>
      </div>
      <div class="card-body">
        <p class="card-text">${truncateText(post.content, 150)}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            작성자: ${post.author ? post.author.username : '알 수 없음'}
          </small>
          <div>
            <span class="badge badge-primary mr-1">
              <i class="fa fa-eye"></i> ${post.views}
            </span>
            <span class="badge badge-danger">
              <i class="fa fa-heart"></i> ${post.likes}
            </span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <small class="text-muted">
          작성일: ${formatDate(post.createdAt)}
        </small>
      </div>
    </div>
  `;
  
  return postDiv;
}

/**
 * 알림 표시 함수
 */
function showAlert(message, type = 'info') {
  const alertsContainer = document.getElementById('alerts-container');
  
  if (alertsContainer) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `;
    
    alertsContainer.appendChild(alertDiv);
    
    // 5초 후 자동으로 알림 닫기
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => {
        alertsContainer.removeChild(alertDiv);
      }, 150);
    }, 5000);
  } else {
    console.log(`알림: ${message} (${type})`);
  }
}