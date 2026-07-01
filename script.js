const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('is-open') ?? false;
  navToggle.setAttribute('aria-expanded', String(open));
});

const normalisePath = (value) => {
  const url = new URL(value, location.href);
  return url.pathname.replace(/\/index\.html$/, '/');
};

const currentPath = normalisePath(location.href);
document.querySelectorAll('[data-nav] a').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.includes('#')) return;
  if (normalisePath(href) === currentPath) link.setAttribute('aria-current', 'page');
});

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;

  let url;
  try {
    url = new URL(href, location.href);
  } catch {
    return;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  const isSameOrigin = url.origin === location.origin;
  const currentParts = location.pathname.split('/').filter(Boolean);
  const targetParts = url.pathname.split('/').filter(Boolean);
  const currentRepo = location.hostname.endsWith('github.io') ? currentParts[0] : '';
  const leavesCurrentGithubRepo = Boolean(
    currentRepo &&
    isSameOrigin &&
    targetParts[0] &&
    targetParts[0] !== currentRepo
  );

  if (isSameOrigin && !leavesCurrentGithubRepo) return;
  link.setAttribute('target', '_blank');
  const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
  rel.add('noopener');
  rel.add('noreferrer');
  link.setAttribute('rel', Array.from(rel).join(' '));
});

const reveals = document.querySelectorAll('.reveal');
const showReveal = (element) => element.classList.add('is-visible');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showReveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach(showReveal);
}

(() => {
  const body = document.body;
  if (!body) return;

  const actions = document.createElement('nav');
  actions.className = 'floating-actions';
  actions.setAttribute('aria-label', 'Quick page links');

  const topButton = document.createElement('button');
  topButton.className = 'floating-top-button';
  topButton.type = 'button';
  topButton.textContent = 'Top';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  actions.appendChild(topButton);
  body.appendChild(actions);

  const syncFloatingActions = () => {
    actions.classList.toggle('is-visible', window.scrollY > 220);
  };

  syncFloatingActions();
  window.addEventListener('scroll', syncFloatingActions, { passive: true });
})();

document.querySelectorAll('[data-region-switcher]').forEach((switcher) => {
  const buttons = Array.from(switcher.querySelectorAll('[data-region-choice]'));
  const cards = Array.from(document.querySelectorAll('[data-region-card]'));

  const setRegion = (region) => {
    buttons.forEach((button) => {
      const active = button.getAttribute('data-region-choice') === region;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    cards.forEach((card) => {
      const visible = region === 'all' || card.getAttribute('data-region-card') === region;
      card.hidden = !visible;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => setRegion(button.getAttribute('data-region-choice') || 'all'));
  });

  setRegion('all');
});
