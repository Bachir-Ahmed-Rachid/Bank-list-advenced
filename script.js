'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dots = document.querySelector('.dots');
const { height } = nav.getBoundingClientRect();
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnOpenModal =>
  btnOpenModal.addEventListener('click', openModal)
);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', () => {
  // const section1Coord = section1.getBoundingClientRect();
  // window.scrollTo(section1Coord.left, section1Coord.top + window.pageYOffset);
  section1.scrollIntoView({ behavior: 'smooth' });
});

const commonParent = document.querySelector('.nav__links');
commonParent.addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const destination = document.querySelector(e.target.getAttribute('href'));
    destination.scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
tabsContainer.addEventListener('click', e => {
  //get the target button
  const target = e.target.closest('.operations__tab');
  if (!target) return;
  //remove all selected tabs and there content
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(tabContent => {
    tabContent.classList.remove('operations__content--active');
  });

  //activated selected tab and it's content
  target.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${target.dataset.tab}`)
    .classList.add('operations__content--active');
});

const HandelHover = function (e) {
  const link = e.target;
  if (link.classList.contains('nav__link')) {
    const childrenLink = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    childrenLink.forEach(childLink => {
      if (childLink !== link) {
        childLink.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
//Navigation changing opacity
nav.addEventListener('mouseover', HandelHover.bind(0.5));
nav.addEventListener('mouseout', HandelHover.bind(1));

//sticky navigation
const section1Coord = section1.getBoundingClientRect();
window.addEventListener('scroll', () => {
  if (window.scrollY > section1Coord.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

// sticky navbar using observer API

const observer = new IntersectionObserver(
  function (entries) {
    const [{ isIntersecting }] = entries;
    if (!isIntersecting) {
      nav.classList.add('sticky');
    }
    if (isIntersecting) {
      nav.classList.remove('sticky');
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${height}px`,
  }
);
observer.observe(header);
//Reval section
const allSection = document.querySelectorAll('section');
const RevalObserver = new IntersectionObserver(
  function (entries, observer) {
    const [{ isIntersecting, target }] = entries;
    if (!isIntersecting) return;
    target.classList.remove('section--hidden');
    observer.unobserve(target);
  },
  {
    root: null,
    threshold: 0.15,
  }
);
allSection.forEach(section => {
  RevalObserver.observe(section);
  section.classList.add('section--hidden');
});

//image lazy loading
const lazyImages = document.querySelectorAll('img[data-src]');
const LazyImageObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    //when changing the src of image we can add an event handler that it's trigged when the src load
    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `200px`,
  }
);
lazyImages.forEach(image => {
  LazyImageObserver.observe(image);
});

///Slider

//variables----------
let currSlide = 0;
const maxSlides = slides.length - 1;
//functions---------
const getSlide = function (showSlide) {
  slides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${(i - showSlide) * 100}%)`)
  );
};
const prev = function () {
  if (currSlide === 0) {
    currSlide = maxSlides;
  } else {
    currSlide--;
  }
  getSlide(currSlide);
  activateDot(currSlide);
};
const next = function () {
  if (currSlide === maxSlides) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  getSlide(currSlide);
  activateDot(currSlide);
};

const activateDot = function (currSlide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${currSlide}"]`)
    .classList.add('dots__dot--active');
};

const dotsInitialization = function () {
  slides.forEach((_, i) => {
    dots.insertAdjacentHTML(
      'beforeEnd',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const HandelClickDot = function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    currSlide = Number(slide);
    getSlide(currSlide);
    activateDot(currSlide);
  }
};

const initialization = function () {
  getSlide(0);
  dotsInitialization();
  activateDot(0);
};

//execute initialization
initialization();

//eventsHandler------
btnSliderLeft.addEventListener('click', prev);
btnSliderRight.addEventListener('click', next);

document.addEventListener('keydown', e => {
  e.key === 'ArrowLeft' && prev();
  e.key === 'ArrowRight' && next();
});

dots.addEventListener('click', HandelClickDot);

// const section2 = document.querySelector('#section--2');
// const sectionDiv = document.querySelector('.divTest');
// const sectionH2 = document.querySelector('.h2Test');

// sectionH2.addEventListener('click', () => {
//   console.log('sectionH2 is clicked');
// });
// sectionDiv.addEventListener('click', () => {
//   console.log('sectionDiv is clicked');
// });
// section2.addEventListener('click', () => {
//   console.log('section2 is clicked');
// });
// const h1 = document.querySelector('h1');
// console.log(h1.closest('.header'));
