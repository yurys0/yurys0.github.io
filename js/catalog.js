const API_URL = 'https://ceramic-api.onrender.com';

async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

function renderProduct(product) {
  // API возвращает относительные пути, преобразуем в абсолютный URL
  const imageUrl = product.image 
    ? new URL(product.image, API_URL).href 
    : 'assets/ceramic-vase-C84EBEm2.jpg';
  
  return `
    <article class="catalog__item">
      <img src="${imageUrl}" alt="${product.title || 'Product'}" loading="lazy">
      <div class="catalog__info">
        <h3>${product.title || 'Untitled'}</h3>
        <p>${product.price || '0'} €</p>
      </div>
    </article>
  `;
}

async function displayProducts(category = 'tea') {
  const grid = document.querySelector('.catalog__grid');
  if (!grid) return;

  grid.innerHTML = '<div class="catalog__loading">Loading…</div>';

  try {
    const products = await fetchProducts();
    let filteredProducts = [];

    switch (category) {
      case 'tea':
        filteredProducts = products.slice(0, 5);
        break;
      case 'kitchen':
        filteredProducts = products.slice(0, 3);
        break;
      case 'plants':
        filteredProducts = products.slice(0, 2);
        break;
      default:
        filteredProducts = products;
    }

    if (filteredProducts.length === 0) {
      grid.innerHTML = '<div class="catalog__error">No products found</div>';
      return;
    }

    grid.innerHTML = filteredProducts.map(renderProduct).join('');
  } catch (error) {
    grid.innerHTML = '<div class="catalog__error">Failed to load products. Please try again later.</div>';
  }
}

function initCatalog() {
  const filters = document.querySelectorAll('.catalog__filter');
  
  filters.forEach(filter => {
    filter.addEventListener('click', async () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      
      const category = filter.dataset.category;
      await displayProducts(category);
    });
  });

  displayProducts('tea');
}

document.addEventListener('DOMContentLoaded', initCatalog);
