const API_URL = 'https://ceramic-api.onrender.com';

async function fetchPosts() {
  try {
    const response = await fetch(`${API_URL}/api/posts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

function renderPost(post) {
  // API возвращает относительные пути, преобразуем в абсолютный URL
  const imageUrl = post.image 
    ? new URL(post.image, API_URL).href 
    : 'assets/crafts-CfI0I3C6.jpg';
  
  return `
    <article class="card__item">
      <div class="card__info">
        <img class="card__img" src="${imageUrl}" alt="${post.title || 'Post'}" loading="lazy">
        <div class="card__title-btn">
          <h3 class="card__title">${post.title || 'Untitled'}</h3>
          <button class="btn-read card__btn">read</button>
        </div>
      </div>
      <p class="card__p">${post.excerpt || post.content?.substring(0, 200) + '...' || 'No description'} €</p>
    </article>
  `;
}

async function displayPosts() {
  const grid = document.querySelector('.cards__grid');
  if (!grid) return;

  grid.innerHTML = '<div class="card__loading">Loading…</div>';

  try {
    const posts = await fetchPosts();

    if (!posts || posts.length === 0) {
      grid.innerHTML = '<div class="card__error">No posts found</div>';
      return;
    }

    grid.innerHTML = posts.map(renderPost).join('');
  } catch (error) {
    grid.innerHTML = '<div class="card__error">Failed to load posts. Please try again later.</div>';
  }
}

document.addEventListener('DOMContentLoaded', displayPosts);
