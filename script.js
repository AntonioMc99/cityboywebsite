// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      mobileMenu?.classList.add('hidden');
    }
  });
});

// Testimonials
const testimonials = [
  { text: "Amazing experience! The kids were so engaged.", author: "Sarah M." },
  { text: "Educational and fun. Highly recommend!", author: "John D." },
  { text: "Professional and entertaining. Worth every penny.", author: "Lisa K." },
  { text: "The reptiles were incredible! Kids loved it.", author: "Mike R." },
  { text: "Best birthday party ever! Thank you!", author: "Emily T." }
];

let currentTestimonial = 0;
const textEl = document.getElementById('testimonial-text');
const authorEl = document.getElementById('testimonial-author');

function showTestimonial() {
  if (textEl && authorEl) {
    textEl.textContent = `"${testimonials[currentTestimonial].text}"`;
    authorEl.textContent = `— ${testimonials[currentTestimonial].author}`;
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  }
}

if (textEl && authorEl) {
  showTestimonial();
  setInterval(showTestimonial, 5000);
}

// Carousel
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.querySelector('.carousel-dots');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

if (track && slides.length) {
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  setInterval(() => goTo(current + 1), 4000);
}