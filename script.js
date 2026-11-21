// Booking form — Web3Forms
const bookingForm  = document.getElementById('booking-form');
const confirmation = document.getElementById('confirmation');

if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // Collect all named fields dynamically
    const fields = {};
    bookingForm.querySelectorAll('[name]').forEach(el => {
      if (el.name && el.value) fields[el.name] = el.value.trim();
    });
    const payload = {
      service: fields.service || 'General Inquiry',
      price: '',
      date: fields.date || '',
      time: fields.time || '',
      name: fields.name || '',
      phone: fields.phone || '',
      email: fields.email || '',
      location: fields.location || '',
      notes: fields.message || ''
    };

    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => {
        bookingForm.reset();
        confirmation.textContent = "Thank you! We'll be in touch soon to confirm your booking.";
        confirmation.className = 'visible';
      })
      .catch(() => {
        confirmation.textContent = 'Something went wrong. Please try again or call us at (678) 760-2296.';
        confirmation.className = 'error';
      })
      .finally(() => {
        submitBtn.textContent = 'Send Request';
        submitBtn.disabled = false;
      });
  });
}

// Active nav link
document.querySelectorAll('.main-nav a').forEach(link => {
  if (link.href === window.location.href || link.pathname === window.location.pathname) {
    link.classList.add('active');
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Smooth scroll (in-page anchors only)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
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
const textEl   = document.getElementById('testimonial-text');
const authorEl = document.getElementById('testimonial-author');

function showTestimonial() {
  if (textEl && authorEl) {
    textEl.textContent   = `"${testimonials[currentTestimonial].text}"`;
    authorEl.textContent = `— ${testimonials[currentTestimonial].author}`;
    currentTestimonial   = (currentTestimonial + 1) % testimonials.length;
  }
}

if (textEl && authorEl) {
  showTestimonial();
  setInterval(showTestimonial, 5000);
}

// Carousel
const track        = document.querySelector('.carousel-track');
const slides       = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.querySelector('.carousel-dots');
const prevBtn      = document.querySelector('.carousel-prev');
const nextBtn      = document.querySelector('.carousel-next');

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

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});
