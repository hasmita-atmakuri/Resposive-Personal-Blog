document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderPosts();
  showFlashAlert();
});

async function loadPosts() {
  try {
    const response = await fetch('posts.json');
    if (!response.ok) throw new Error('Failed to load posts.json');
    const remote = await response.json();
    const local = readLocalPosts();
    const merged = [...local, ...remote];
    return sortPostsByDateDesc(merged);
  } catch (err) {
    const fallback = [
      {
        id: 'fallback-post',
        title: 'Welcome to the Blog',
        date: '2025-09-25',
        author: 'Hasmita',
        image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1600&auto=format&fit=crop',
        summary: 'This is a fallback post shown if posts.json cannot be loaded.',
        content: '<p>Use a local server to load the full set of posts from posts.json.</p>'
      }
    ];
    const local = readLocalPosts();
    return sortPostsByDateDesc([...local, ...fallback]);
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function renderPosts() {
  const container = document.getElementById('posts');
  if (!container) return;
  const posts = await loadPosts();

  container.innerHTML = posts.map(post => postCardHtml(post)).join('');

  posts.forEach(post => {
    const btn = document.querySelector(`[data-read="${post.id}"]`);
    if (btn) btn.addEventListener('click', () => openPostModal(post));
    const titleLink = document.querySelector(`[data-title="${post.id}"]`);
    if (titleLink) titleLink.addEventListener('click', (e) => { e.preventDefault(); openPostModal(post); });
  });
}

function postCardHtml(post) {
  return `
    <div class="col-12 col-md-6">
      <div class="card h-100 post-card">
        <img src="${post.image}" class="card-img-top post-img" alt="${escapeHtml(post.title)}">
        <div class="card-body d-flex flex-column">
          <a href="#" class="stretched-link text-decoration-none" data-title="${post.id}">
            <h5 class="card-title">${escapeHtml(post.title)}</h5>
          </a>
          <div class="text-muted small mb-2">${escapeHtml(post.author)} · ${formatDate(post.date)}</div>
          <p class="card-text flex-grow-1">${escapeHtml(post.summary)}</p>
          <div class="mt-2">
            <button class="btn btn-sm btn-primary" data-read="${post.id}">Read More</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function openPostModal(post) {
  const modalEl = document.getElementById('postModal');
  const titleEl = document.getElementById('postModalLabel');
  const imageEl = document.getElementById('postModalImage');
  const metaEl = document.getElementById('postMeta');
  const contentEl = document.getElementById('postContent');

  if (!modalEl || !titleEl || !imageEl || !metaEl || !contentEl) return;

  titleEl.textContent = post.title;
  imageEl.src = post.image;
  imageEl.alt = post.title;
  metaEl.textContent = `${post.author} · ${formatDate(post.date)}`;
  contentEl.innerHTML = post.content;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function readLocalPosts() {
  try {
    const raw = localStorage.getItem('userPosts');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (_) {
    return [];
  }
}

function sortPostsByDateDesc(posts) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function showFlashAlert() {
  const area = document.getElementById('alertArea');
  if (!area) return;
  const msg = sessionStorage.getItem('flashMessage');
  if (msg) {
    area.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">${escapeHtml(msg)}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    sessionStorage.removeItem('flashMessage');
  }
}


