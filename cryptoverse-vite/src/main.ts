import './style.css';

const path = window.location.pathname;

if (path === '/' || path === '/index.html') {
  import('./auth');
} else if (path === '/dashboard.html') {
  import('./dashboard');
}
