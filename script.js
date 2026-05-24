const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuSearch = document.getElementById('menu-search');
const menuCards = document.querySelectorAll('.menu-card, .food-card');
const toast = document.getElementById('toast');

const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    navMenu.classList.remove('open');
  }
});

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
};

const addCartButtons = document.querySelectorAll('.add-cart');
addCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('article').querySelector('h3')?.textContent || 'item';
    showToast(`${item} added to cart`);
    button.classList.add('active');
    window.setTimeout(() => button.classList.remove('active'), 600);
  });
});

menuSearch.addEventListener('input', () => {
  const query = menuSearch.value.trim().toLowerCase();
  menuCards.forEach((card) => {
    const keywords = card.dataset.keywords;
    const visible = keywords.includes(query) || query === '';
    card.style.display = visible ? '' : 'none';
  });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (response.ok) {
        showToast(result.message || 'Message sent successfully!');
        contactForm.reset();
      } else {
        showToast(result.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      showToast('Unable to send message. Try again later.');
    }
  });
}

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
    }
  });
});

const revealElements = document.querySelectorAll('section, .menu-card, .food-card, .review-card, .location-card, .owner-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((element) => observer.observe(element));
