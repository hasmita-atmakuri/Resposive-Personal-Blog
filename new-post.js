document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('newPostForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const image = document.getElementById('image').value.trim();
    const summary = document.getElementById('summary').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !author || !image || !summary || !content) return;

    const newPost = {
      id: slugify(title) + '-' + Date.now(),
      title,
      date: new Date().toISOString().slice(0, 10),
      author,
      image,
      summary,
      content
    };

    const posts = readLocalPosts();
    posts.unshift(newPost);
    localStorage.setItem('userPosts', JSON.stringify(posts));

    sessionStorage.setItem('flashMessage', 'Your post has been published.');
    window.location.href = 'index.html';
  });
});

function readLocalPosts() {
  try {
    const raw = localStorage.getItem('userPosts');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}


