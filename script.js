/*
Main Project by Jonas Schmedtman
Edit and Change by Masen on Aug 2024 
GitHub : https://github.com/DevMasen
*/
'use strict';
//! -----------------Main Project-------------------

//! HTML Elements
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLinksContainer = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');
const operationTabContainer = document.querySelector(
  '.operations__tab-container'
);
const operationTabs = document.querySelectorAll('.operations__tab');
const operationContents = document.querySelectorAll('.operations__content');
const lazyLoadingImages = document.querySelectorAll('img[data-src]');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');

//! Variables
let currentSlide = 0;
const maxSlides = slides.length;

//! Functions

const showPopup = function () {
  const message = document.createElement('div');
  message.classList.add('cookie-message');

  message.innerHTML =
    '<p><span class="cookie-title">This website uses cookies</span> <br> We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.</p> <br> <button class="btn btn--close-cookie">Allow</button> <button class="btn btn--close-cookie">Deny</button>';

  header.after(message);

  const cookieButtons = document.querySelectorAll('.btn--close-cookie');
  cookieButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      message.remove();
    })
  );
};

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//* Add Intersection Observer for header to show Sticky Navigation
const observeStickyNav = function (element = header) {
  new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) nav.classList.add('sticky');
        else nav.classList.remove('sticky');
      });
    },

    {
      root: null, // this count as viewport
      threshild: 0, // this mean when header compleatly leaved
      rootMargin: `-${getComputedStyle(nav).height}`, // increase and decrese  observe area
    }
  ).observe(element);
};

//* Add Intersection Observer for Sections Animation
const observeSections = function () {
  const sectionObserver = new IntersectionObserver(
    function (entries, observer) {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    },
    {
      root: null,
      threshold: 0.15,
    }
  );

  allSections.forEach(section => {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
  });
};

//* Add Intersection Observer for Lazy Images
const observeLazyImages = function () {
  const imageObserver = new IntersectionObserver(
    function (entries, observer) {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener('load', function (e) {
        entry.target.classList.remove('lazy-img');
      });
      observer.unobserve(entry.target);
    },
    {
      root: null,
      threshold: 0,
      rootMargin: '200px',
    }
  );
  lazyLoadingImages.forEach(img => imageObserver.observe(img));
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const changeSlide = function (slide) {
  slides.forEach(function (s, i) {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};

const changeDot = function (slide) {
  [...dotsContainer.children].forEach(dot =>
    dot.classList.remove('dots__dot--active')
  );
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const toNextSlide = function () {
  if (currentSlide === maxSlides - 1) currentSlide = 0;
  else currentSlide++;
  changeSlide(currentSlide);
  changeDot(currentSlide);
};

const toPreviousSlide = function () {
  if (currentSlide === 0) currentSlide = maxSlides - 1;
  else currentSlide--;
  changeSlide(currentSlide);
  changeDot(currentSlide);
};

//* IIFE for Initialization
(function () {
  observeStickyNav(); //* E016
  observeSections(); //* E017
  observeLazyImages(); //* E018
  showPopup();
  createDots();
  changeSlide(currentSlide);
  changeDot(currentSlide);
})();

//! Events
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//*E007
btnLearnMore.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//* E011
navLinksContainer.addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id === '#') return;
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//* E013
operationTabContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  // gaurd clause
  if (!clicked) return;

  // remove active classes
  operationTabs.forEach(t => t.classList.remove('operations__tab--active'));
  operationContents.forEach(c =>
    c.classList.remove('operations__content--active')
  );

  // add active classes to clicked
  clicked.classList.add('operations__tab--active');

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//* E014
nav.addEventListener('mouseover', e => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element !== link) element.style.opacity = 0.5;
      else element.style.transform = 'scale(1.1)';
    });
    logo.style.opacity = 0.5;
  }
});

nav.addEventListener('mouseout', () => {
  navLinks.forEach(element => {
    element.style.opacity = 1;
    element.closest('.nav').querySelector('img').style.opacity = 1;
    element.style.transform = '';
  });
});

//* E019
btnRight.addEventListener('click', toNextSlide);
btnLeft.addEventListener('click', toPreviousSlide);

//* E020
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && toNextSlide();
  e.key === 'ArrowLeft' && toPreviousSlide();
});

dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const { slide } = e.target.dataset;
  changeSlide(slide);
  changeDot(slide);
  currentSlide = +slide;
});

//!---------------Practice and Notes----------------

/*  //! E021 : Lifecycle Dom Events

//* Event That executes when DOM Built
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML Parsed and Dom Tree Built!', e);
});

//* Event that executes when Page fully loaded
window.addEventListener('load', function (e) {
  console.log('Page Fully Loaded!', e);
});
*/

//! E020 : Building A Slider Component  Part 2 (see Main Project)

//! E019 : Building A Slider Component  Part 1 (see Main Project)

//! E018 : Lazy Loading Images(see Main Project)

//* For change internet speed to test performance change internet speed in : inspect -> Network -> No throttling ---change to--> 3G

//! E017 : Revealing Elements On Scroll(see Main Project)

/*  //! E016 : The Intersection Observer Api(see Main Project)

const observerCallBack = function (entries) {
  entries.forEach(ent => {
    console.log(ent);
    // console.log(
    //   'You Break The Ratio :',
    //   ent.intersectionRatio,
    //   'for Element',
    //   ent.target
    // );
  });
};

const observerOptions = {
  root: null,
  threshold: [0, 0.1, 0.2],
};

new IntersectionObserver(observerCallBack, observerOptions).observe(section1);

*/

/*  //! E015 : Implementing A Sticky Navigation  The Scroll Event
//* Bad Way

//* Getting Section 1 width toward Top of page
const initialSection1Top =
  section1.getBoundingClientRect().top + window.scrollY;

//* Getting Current Scroll : window.scrollY & window.scrollX
window.addEventListener('scroll', function () {
  //* When scroll Y Passes the section 1
  if (window.scrollY > initialSection1Top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

/*  //! E014 : Passing Arguments To Event Handlers (see Main Project)
//* Jonas way

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
*/

//! E013 : Building A Tabbed Component (see Main Project)

/*  //! E012 : Dom Traversing
const h1 = document.querySelector('h1');
console.log(h1);

//* Going Downwards : Child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); // NodeList of All Nodes
console.log(h1.children); // HTMLCollection of Child Elements
h1.firstElementChild.style.color = 'yellow';
h1.lastElementChild.style.color = 'orangered';

//* Going Upwards : Parent
//* element.closest(Selector) != element.querySelector(Selector)

console.log(h1.parentNode);
console.log(h1.parentElement);

console.log(h1.closest('.header')); //Closest Parent Class Named header
console.log(h1.closest('a')); //null
console.log(h1.closest('h1'));

h1.closest('h1').style.background = 'var(--gradient-primary)';
h1.closest('header').style.background = 'var(--gradient-secondary)';

//* Going Sideways : Siblings
// Element
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// Node
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// All Sibling Elements
console.log(h1.parentElement.children);

// For Fun
[...h1.parentElement.children].forEach(el => {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

//! E011 : Event Delegation (see Main Project)
//* NOT GOOD WAY
// document.querySelectorAll('.nav__link').forEach(element => {
//   element.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

/*   //! E010 : Event Propagation In Practice
//* Building random color
const randInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const GenerateRandomColor = () =>
  `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`;

//* Adding EventListener to navlink and its parents
document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.currentTarget.style.backgroundColor = GenerateRandomColor();
  //* target is that one at first clicked
  //* currentTarget = this
  console.log('Link', e.target, e.currentTarget);
  // console.log(e.currentTarget === this);

  //* Cancling Bubling
  // e.stopPropagation();إ
});

document.querySelector('.nav__links').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = GenerateRandomColor();
    console.log('Container', e.target, e.currentTarget);
  },
  true
);

//* EventListener Third Argument : true => Capturing Phase, false => Bubling Phase
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = GenerateRandomColor();
    console.log('Nav', e.target, e.currentTarget);
  },
  true
);

*/

//! E009 : Event Propagation Bubbling And Capturing (see slides)

/*  //! E008 : Type of Events and Event Handlers
const logo = document.querySelector('.nav__logo');

//* Hover Event with 'mouseenter'
const showMessage = function () {
  console.log('You Hoverd on Logo');

  //* Deleting Event after one time execution
  logo.removeEventListener('mouseenter', showMessage);
};
logo.addEventListener('mouseenter', showMessage);

//* Old Way : on[event]
// logo.onclick = function () {
//   console.log('You clicked Logo');
// };

//* The last way is through html (see index.html)
*/

/*  //! E007 : Smooth Scrolling

btnLearnMore.addEventListener('click', function (e) {
  //* Getting Coordinates of an Element toward Viewport
  const section1Coordinates = section1.getBoundingClientRect();
  // console.log(section1Coordinates);

  //* Getting Current Scroll Position
  // console.log(
  //   `Y Scroll : ${window.pageXOffset} X Scroll : ${window.pageYOffset}`
  // );

  //* Exact Position of Section 1 = length from viewport + length of viewport from top

  //* Scroll to Exact Position of Section 1
  //? 1. Old way
  // window.scrollTo({
  //   left: section1Coordinates.left + window.pageXOffset,
  //   top: section1Coordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  //? 2.New way
  section1.scrollIntoView({ behavior: 'smooth' });

  //* Getting btnLearnMore Coordinates toward viewport
  //* Getting The element that clicked by e.target (similar to this)
  console.log(e.target.getBoundingClientRect());

  //* Getting the width and height of viewport
  console.log(
    `Viewport width: ${document.documentElement.clientWidth}\n Viewport height: ${document.documentElement.clientHeight}`
  );
});
*/

/*  //! E006 : Styles, Attributes and Classes

//* Styles
//? changed elements display in element.style in inspect mode

const navBtn = document.querySelector('.nav__link--btn');

// Set in-line styles
navBtn.style.backgroundColor = 'purple';
navBtn.style.width = '20rem';

// Get in-line styles
console.log(navBtn.style);
console.log(navBtn.style.width);
console.log(navBtn.style.height);

// Get all styles
console.log(getComputedStyle(navBtn));
console.log(getComputedStyle(navBtn).backgroundColor);
console.log(getComputedStyle(navBtn).height);

// change in-line style by computed style
navBtn.style.height =
  Number.parseFloat(getComputedStyle(navBtn).height, 10) + 20 + 'px';

// change the CSS root
document.documentElement.style.setProperty('--color-primary', 'orangered');

//* Attributes
const navLogo = document.querySelector('.nav__logo');

// Get Attributes
console.log(navLogo.src); //pure src
console.log(navLogo.alt);
console.log(navLogo.id);
console.log(navLogo.className);

// Set Attributes
navLogo.alt = 'Minimalist Logo';
console.log(navLogo.alt);

// Get non-standard Attributes
console.log(navLogo.designer); //undefined
console.log(navLogo.getAttribute('designer')); //masen

// Get src
console.log(navLogo.src);
console.log(navLogo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');

// Get href
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attributes
console.log(navLogo.dataset.randomNumber); //23

//* Classes
navLogo.classList.add('a', 'b');
navLogo.classList.remove('a', 'b');
navLogo.classList.toggle('a');
navLogo.classList.contains('a'); //not includes()

//* Do Not Use This
navLogo.className = 'masen';
console.log(navLogo);
*/

/*  //! E005 : Selecting Creating and Deleting Elements

//* Selecting

// All HTML document
console.log(document.documentElement);

// Head Element
console.log(document.head);

// Body Element
console.log(document.body);

// querySelector => Element
const navLogo = document.querySelector('.nav__logo');
console.log(navLogo);

const header = document.querySelector('header');

// querySelectorAll => NodeList
const btns = document.querySelectorAll('.btn');
console.log(btns);

// getElementById => Element
const section3 = document.getElementById('section--3');
console.log(section3);

// getElementsByTagName => HTML Collection -> Live Change
const divs = document.getElementsByTagName('div');
console.log(divs);

// getElementsByClassName => HTML Collection -> Live Change
const highlighted = document.getElementsByClassName('highlight');
console.log(highlighted);

//* Creating

// Creating div element
const message = document.createElement('div');

// Add class to it
message.classList.add('cookie-message');

// Changing its text
// message.textContent = 'This website uses cookies <br> We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.';

// Add children to it
message.innerHTML =
  '<p><span class="cookie-title">This website uses cookies</span> <br> We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.</p> <br> <button class="btn btn--close-cookie">Allow</button> <button class="btn btn--close-cookie">Deny</button>';


// Add Element to DOM
// header.insertAdjacentElement('afterbegin', message);
// header.prepend(message);
// header.append(message);
// header.before(message);
header.after(message);

// Make a clone of element
// const clonedmessage = message.cloneNode(true);
// clonedmessage.style.bottom = 'auto';
// clonedmessage.style.top = '0';
// header.after(clonedmessage);

// Remove an element from DOM
const cookieButtons = document.querySelectorAll('.btn--close-cookie');
cookieButtons.forEach(btn =>
  btn.addEventListener('click', () => {
    // old way
    // message.parentElement.removeChild(message);
  
    // new way
    message.remove();
    // clonedmessage.remove();
  })
  );
  */

//! E004 : How the DOM really works (see slides)

//! E003 : Project Bankist Website
//* for preventing scroll to start after clicking a link(<a>) :
// Event.preventDefault()
