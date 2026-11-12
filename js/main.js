document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
     1. WORK 섹션: Swiper 슬라이더 & 탭 필터링
     ========================================= */
  const swiperContainer = document.querySelector('.work-swiper');
  const swiperWrapper = swiperContainer.querySelector('.swiper-wrapper');
  const allSlides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));
  const tabButtons = document.querySelectorAll('.tab-btn');

 const workSwiper = new Swiper('.work-swiper', {
        slidesPerView: 1.2,
        spaceBetween: 20,
        speed: 600,
        grabCursor: true,
        observer: true,
        observeParents: true,
        centerInsufficientSlides: true, /* 카드가 부족할 때 중앙 정렬 */
        navigation: {
            nextEl: '.next-btn',
            prevEl: '.prev-btn'
        },
        breakpoints: {
            768: {
                slidesPerView: 2.2,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3.5,
                spaceBetween: 24
            },
            1400: {
                slidesPerView: 5, /* PC 와이드 화면에서 5개 노출 */
                spaceBetween: 24
            }
        }
    });

  function filterSlides(category) {
    swiperContainer.classList.add('is-filtering');

    setTimeout(() => {
      swiperWrapper.innerHTML = '';

      const filtered = allSlides.filter(slide => {
        return category === 'all' || slide.dataset.category === category;
      });

      filtered.forEach(slide => swiperWrapper.appendChild(slide));

      workSwiper.update();
      workSwiper.slideTo(0, 0);
      swiperContainer.classList.remove('is-filtering');
    }, 250);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSlides(btn.dataset.filter);
    });
  });

  // 초기 로드 시 PART 01 노출
  filterSlides('part1');

/* =========================================
   비디오 카드 클릭 재생 및 초기화 제어
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  const videoWraps = document.querySelectorAll('.video-wrap');

  videoWraps.forEach(wrap => {
    const video = wrap.querySelector('video');
    const playBtn = wrap.querySelector('.duration-badge');

    if (!video || !playBtn) return;

    // HTML에서 설정한 원래 시간 텍스트 가져오기 (예: "▶ 1:15")
    const originalTimeText = playBtn.getAttribute('data-time');

    // 1. 버튼 클릭 시 재생/일시정지 토글
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // 상위 카드로 클릭 이벤트가 넘어가는 것 방지

      if (video.paused) {
        video.play();
        playBtn.textContent = '⏸ 일시정지';
        playBtn.classList.add('playing');
      } else {
        video.pause();
        playBtn.textContent = '▶ 계속 재생';
        playBtn.classList.remove('playing');
      }
    });

    // 2. 마우스가 화면(video-wrap) 밖으로 나갈 때 영상 리셋
    wrap.addEventListener('mouseleave', () => {
      if (!video.paused) {
        video.pause(); // 재생 멈춤
      }
      video.currentTime = 0; // 영상을 맨 처음(0초)으로 되감기
      playBtn.textContent = originalTimeText; // 텍스트를 원래 시간으로 복구
      playBtn.classList.remove('playing');    // 버튼 색상 원상 복구
    });
  });
});

  /* =========================================
     3. CONTACT 섹션: 전화번호/이메일 클립보드 복사
     ========================================= */
  const copyButtons = document.querySelectorAll('.copy-item');
  const toast = document.getElementById('toast');
  let toastTimer;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        toast.textContent = `[ ${textToCopy} ] 클립보드에 복사되었습니다!`;
        toast.classList.add('show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('show');
        }, 2500);
      });
    });
  });
});

window.openModal = function(...imagePaths) {
    const addedImgs = document.querySelectorAll('.multi_modal_img');
    addedImgs.forEach(img => img.remove());

    const modal = document.getElementById('image-modal');
    const baseImg = document.getElementById('modal-image');
    const modalContent = baseImg.parentElement;

    let current_scale = 1;
    let is_dragging = false;
    let start_x = 0, start_y = 0;
    let scroll_left = 0, scroll_top = 0;

    if (baseImg && imagePaths.length > 0) {
        modalContent.classList.add('zoom_container');
        
        modalContent.style.transform = 'none';
        modalContent.style.width = '90vw';
        modalContent.style.maxWidth = '700px';
        modalContent.style.height = '94vh';
        modalContent.style.maxHeight = 'none';
        modalContent.style.overflowY = 'auto';

        baseImg.src = imagePaths[0];
        baseImg.style.marginBottom = imagePaths.length > 1 ? '20px' : '0';
        baseImg.style.width = '100%';
        baseImg.style.height = 'auto';
        baseImg.style.maxHeight = 'none';
        baseImg.classList.add('prevent_drag_img');

        for (let i = 1; i < imagePaths.length; i++) {
            const newImg = document.createElement('img');
            newImg.src = imagePaths[i];
            newImg.className = 'multi_modal_img prevent_drag_img';
            newImg.style.width = '100%';
            newImg.style.height = 'auto';
            newImg.style.maxHeight = 'none';
            newImg.style.display = 'block';
            newImg.style.marginBottom = '20px';
            modalContent.appendChild(newImg);
        }
    }

    modalContent.onwheel = function(e) {
        e.preventDefault();
        
        const rect = modalContent.getBoundingClientRect();
        const mouse_x = e.clientX - rect.left;
        const mouse_y = e.clientY - rect.top;
        
        const old_scale = current_scale;
        const zoom_step = 0.2;
        
        if (e.deltaY < 0) {
            current_scale += zoom_step;
        } else {
            current_scale -= zoom_step;
            if (current_scale < 1) current_scale = 1;
        }
        
        modalContent.style.maxWidth = 'none';
        modalContent.style.width = `${800 * current_scale}px`;
        
        const scale_ratio = current_scale / old_scale;
        modal.scrollLeft += (mouse_x * scale_ratio - mouse_x);
        modal.scrollTop += (mouse_y * scale_ratio - mouse_y);
    };

    modal.onmousedown = function(e) {
        if (e.clientX >= modal.clientWidth) {
            return;
        }
        
        if (e.target.closest('[class*="close"]') || e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            return;
        }
        
        is_dragging = true;
        start_x = e.clientX;
        start_y = e.clientY;
        scroll_left = modal.scrollLeft;
        scroll_top = modal.scrollTop;
        modal.style.cursor = 'grabbing';
    }; 

    window.onmousemove = function(e) {
        if (!is_dragging) return;
        e.preventDefault();
        const walk_x = e.clientX - start_x;
        const walk_y = e.clientY - start_y;
        modal.scrollLeft = scroll_left - walk_x;
        modal.scrollTop = scroll_top - walk_y;
    };

    window.onmouseup = function() {
        is_dragging = false;
        modal.style.cursor = 'auto';
    };

    window.onmouseleave = function() {
        is_dragging = false;
        modal.style.cursor = 'auto';
    };

    modal.scrollTop = 0;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// 동영상 팝업 열기 (자동재생)
window.openVideoModal = function(videoSrc) {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    
    video.src = videoSrc;
    video.volume = 0.5; /* 💡 이 줄을 추가합니다. (0.0은 묵음, 1.0은 최대치이며 0.5가 50%를 의미합니다) */
    modal.style.display = "flex";
    document.body.style.overflow = 'hidden'; // 뒤쪽 배경 스크롤 방지
    video.play();
};

// 동영상 팝업 닫기 (재생 중지)
window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    
    video.pause();
    video.src = ""; // 창을 닫으면 영상 소리 완전 차단
    modal.style.display = "none";
    document.body.style.overflow = '';
};

// 배경 어두운 곳 클릭 시 동영상 팝업 닫기
window.addEventListener('mousedown', function(e) {
    const videoModal = document.getElementById('video-modal');
    if (e.target === videoModal) {
        closeVideoModal();
    }
});