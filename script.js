// Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const nav = $('#primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close on link click (mobile)
    $$('#primary-nav a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Theme toggle with persistence
  const themeBtn = $('#themeToggle');
  const root = document.documentElement;
  const THEME_KEY = 'pref-theme';

  const applyTheme = (mode) => {
    if (mode === 'dark') {
      root.classList.add('dark');
      themeBtn?.setAttribute('aria-pressed', 'true');
    } else {
      root.classList.remove('dark');
      themeBtn?.setAttribute('aria-pressed', 'false');
    }
  };

  // Initialize theme
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored ?? (prefersDark ? 'dark' : 'light'));

  themeBtn?.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  });

  // Smooth scroll for internal links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
    }
  });

  // Intersection Observer for reveal animations
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Active nav link highlighting on scroll
  const sections = ['about','skills','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = $$('#primary-nav a');
  const setActive = () => {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        current = `#${sec.id}`;
      }
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
  };
  window.addEventListener('scroll', setActive);
  setActive();

  // Back to top button
  const toTop = $('#toTop');
  const toggleToTop = () => {
    if (window.scrollY > 400) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  };
  window.addEventListener('scroll', toggleToTop);
  toggleToTop();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Footer year
  const yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});