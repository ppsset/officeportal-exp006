const navLinks = document.querySelector('.nav-links');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const toolSearch = document.getElementById('toolSearch');
const categoryFilter = document.getElementById('categoryFilter');
const toolGrid = document.getElementById('toolGrid');
const contactForm = document.getElementById('contactForm');
const successMessage = document.querySelector('.form-success');

// Mobile navigation toggle
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when clicking link on mobile
navLinks.addEventListener('click', (event) => {
  if (event.target.tagName === 'A' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
  }
});

// Theme toggle with persistence
const savedTheme = localStorage.getItem('kh-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '🌙' : '🌞';
  localStorage.setItem('kh-theme', isDark ? 'dark' : 'light');
});

// Smooth scroll for nav links
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (targetId.startsWith('#')) {
      event.preventDefault();
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.querySelector('.footer-links a[href="#home"]').addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
});

// Tool search and filter
const filterTools = () => {
  const query = toolSearch.value.toLowerCase();
  const category = categoryFilter.value;

  toolGrid.querySelectorAll('.card').forEach((card) => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const body = card.querySelector('p').textContent.toLowerCase();
    const tags = Array.from(card.querySelectorAll('.tags span')).map((t) => t.textContent.toLowerCase());
    const matchesText = title.includes(query) || body.includes(query) || tags.some((tag) => tag.includes(query));
    const matchesCategory = category === 'all' || card.dataset.category === category;
    card.style.display = matchesText && matchesCategory ? 'block' : 'none';
  });
};

toolSearch.addEventListener('input', filterTools);
categoryFilter.addEventListener('change', filterTools);

// Contact form validation
const validators = {
  name: (value) => value.trim().length >= 2 || 'Name should be at least 2 characters.',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address.',
  topic: (value) => value.trim() !== '' || 'Please select a topic.',
  message: (value) => value.trim().length >= 10 || 'Message should be at least 10 characters.',
};

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.textContent = '';
  let hasError = false;

  Object.entries(validators).forEach(([field, validator]) => {
    const input = contactForm.elements[field];
    const errorEl = contactForm.querySelector(`[data-error-for="${field}"]`);
    const result = validator(input.value);
    if (result !== true) {
      hasError = true;
      errorEl.textContent = result;
      input.setAttribute('aria-invalid', 'true');
    } else {
      errorEl.textContent = '';
      input.removeAttribute('aria-invalid');
    }
  });

  if (!hasError) {
    successMessage.textContent = 'Thank you! Your request has been recorded.';
    contactForm.reset();
  }
});

// Prefill filter on load to ensure default state
filterTools();
