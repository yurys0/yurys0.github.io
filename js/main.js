// Burger menu toggle
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const menuClose = document.querySelector('.menu__close');

if (burger && menu) {
  burger.addEventListener('click', () => {
    menu.classList.add('menu--active');
    menu.classList.remove('menu--closing');
    document.body.style.overflow = 'hidden';
  });
}

if (menuClose && menu) {
  menuClose.addEventListener('click', () => {
    menu.classList.remove('menu--active');
    menu.classList.add('menu--closing');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      menu.classList.remove('menu--closing');
    }, 1000);
  });
}

// Swiper functionality (simple implementation)
function initSwiper() {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const swiperSlides = document.querySelectorAll('.swiper-slide');
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');
  const pagination = document.querySelector('.swiper-pagination');

  if (!swiperWrapper || swiperSlides.length === 0) {
    return;
  }


  let currentSlide = 0;
  function getSlidesPerView() {
    return window.innerWidth >= 1199 ? 3 : 1; // 74.9375rem = 1199px
  }

  function createPagination() {
    // Убираем пагинацию - не нужна
    if (pagination) {
      pagination.style.display = 'none';
    }
  }

  function updateSwiper() {
    swiperWrapper.style.transition = 'transform 0.5s ease-in-out';
    
    const slidesPerView = getSlidesPerView();
    const slideWidth = 100 / slidesPerView;
    
    // Всегда переключаем по одному слайду
    // На десктопе показываем 3 слайда одновременно, но переключаем по одному
    if (slidesPerView === 3) {
      // На десктопе: показываем текущий слайд в центре
      // Для этого сдвигаем так, чтобы текущий был в центре из 3
      // Если currentSlide = 0, показываем: [2, 0, 1] (offset = 2)
      // Если currentSlide = 1, показываем: [0, 1, 2] (offset = 0)
      // Если currentSlide = 2, показываем: [1, 2, 0] (offset = 1)
      let offset;
      if (currentSlide === 0) {
        offset = 2; // Показываем последний слайд (индекс 2) слева
      } else {
        offset = currentSlide - 1; // Показываем предыдущий слайд слева
      }
      swiperWrapper.style.transform = `translateX(-${offset * slideWidth}%)`;
    } else {
      // На мобильных просто показываем текущий слайд
      swiperWrapper.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
  }
  
  // Обновляем при изменении размера окна
  window.addEventListener('resize', () => {
    updateSwiper();
  });

  function goToSlide(slideIndex) {
    // Ограничиваем индекс только реальными 3 слайдами
    currentSlide = slideIndex % 3;
    updateSwiper();
  }

  function nextSlide() {
    // Переключаем на следующий слайд с зацикливанием (только 3 реальных слайда: 0, 1, 2)
    currentSlide = (currentSlide + 1) % 3;
    updateSwiper();
  }

  function prevSlide() {
    // Переключаем на предыдущий слайд с зацикливанием (только 3 реальных слайда: 0, 1, 2)
    currentSlide = (currentSlide - 1 + 3) % 3;
    updateSwiper();
  }

  // Создаем пагинацию при инициализации
  createPagination();

  // Привязываем обработчики событий с защитой от множественных кликов
  let isTransitioning = false;
  
  if (nextBtn) {
    nextBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!isTransitioning) {
        isTransitioning = true;
        nextSlide();
        setTimeout(() => {
          isTransitioning = false;
        }, 500); // Время анимации
      }
      return false;
    };
  }
  
  if (prevBtn) {
    prevBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!isTransitioning) {
        isTransitioning = true;
        prevSlide();
        setTimeout(() => {
          isTransitioning = false;
        }, 500); // Время анимации
      }
      return false;
    };
  }

  // Auto-play swiper
  let autoPlayInterval = setInterval(nextSlide, 5000);
  
  // Pause on hover
  const swiper = document.querySelector('.swiper');
  if (swiper) {
    swiper.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    swiper.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    });
  }

  // Инициализация
  updateSwiper();
}

// Инициализируем swiper после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  initSwiper();
});

// Form submission
const contactForm = document.querySelector('.form__forms');
if (contactForm) {
  const submitBtn = contactForm.querySelector('.btn-request');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      console.log('Form submitted:', data);
      alert('Thank you! Your request has been sent.');
      contactForm.reset();
    });
  }
}

// Newsletter form
const newsletterForm = document.querySelector('.footer__newsletter');
if (newsletterForm) {
  const submitBtn = newsletterForm.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.footer__newsletter__input');
      if (emailInput) {
        console.log('Newsletter subscription:', emailInput.value);
        alert('Thank you for subscribing!');
        emailInput.value = '';
      }
    });
  }
}
