const Productos = {
  products: [],
  filteredProducts: [],
  filters: {
    categoria: '',
    genero: '',
    search: ''
  },

  async init() {
    await this.load();
    this.renderGrid();
    this.setupFilters();
  },

  async load() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading products:', error);
      return;
    }

    for (let product of data) {
      const { data: variantes } = await supabase
        .from('producto_variantes')
        .select('*')
        .eq('producto_id', product.id);

      product.variantes = variantes || [];
    }

    this.products = data;
    this.filteredProducts = data;
  },

  renderGrid() {
    const grid = document.getElementById('productsGrid');
    if (grid) {
      grid.innerHTML = this.renderProducts();
    }
  },

  renderProducts() {
    if (this.filteredProducts.length === 0) {
      return '<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray); padding: 3rem;">No products found</p>';
    }

    return this.filteredProducts.map(product => {
      const colors = [...new Set(product.variantes.map(v => v.color))];
      const firstImage = product.imagenes?.[0] || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect fill="%23ddd" width="300" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="%23999">Sin imagen</text></svg>';

      return `
        <div class="product-card" data-id="${product.id}">
          <img class="product-card-image" src="${firstImage}" alt="${product.nombre}">
          <div class="product-card-body">
            <h3 class="product-card-name">${product.nombre}</h3>
            <p class="product-card-category">${product.categoria} · ${product.genero}</p>
            <p class="product-card-price">$${product.precio_base.toLocaleString()}</p>
            <div class="product-card-colors">
              ${colors.map(c => {
                const variant = product.variantes.find(v => v.color === c);
                return `<div class="color-dot" style="background-color: ${variant?.color_hex || '#000'}" title="${c}"></div>`;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  setupFilters() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.applyFilters();
    });

    document.getElementById('categoriaFilter').addEventListener('change', (e) => {
      this.filters.categoria = e.target.value;
      this.applyFilters();
    });

    document.getElementById('generoFilter').addEventListener('change', (e) => {
      this.filters.genero = e.target.value;
      this.applyFilters();
    });

    document.getElementById('productsGrid').addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (card) {
        const productId = card.dataset.id;
        const product = this.products.find(p => p.id === productId);
        if (product) {
          App.openModal(product);
        }
      }
    });
  },

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchSearch = !this.filters.search || 
        product.nombre.toLowerCase().includes(this.filters.search) ||
        product.descripcion?.toLowerCase().includes(this.filters.search);
      
      const matchCategoria = !this.filters.categoria || 
        product.categoria === this.filters.categoria;
      
      const matchGenero = !this.filters.genero || 
        product.genero === this.filters.genero;

      return matchSearch && matchCategoria && matchGenero;
    });

    this.renderGrid();
  },

  renderModal(product, defaultVariant = null) {
    const colors = [...new Set(product.variantes.map(v => v.color))];
    const sizes = ['S', 'M', 'L', 'XL'];
    
    const firstColor = defaultVariant?.color || colors[0];
    const firstSize = defaultVariant?.talla || 'M';
    
    const currentVariants = product.variantes.filter(v => v.color === firstColor);

    document.getElementById('modalProductName').textContent = product.nombre;
    document.getElementById('modalProductPrice').textContent = `$${product.precio_base.toLocaleString()}`;
    document.getElementById('modalProductDesc').textContent = product.descripcion || '';
    
    const mainImage = product.imagenes?.[0] || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23ddd" width="400" height="400"/><text x="50%" y="50%" text-anchor="middle" fill="%23999">Sin imagen</text></svg>';
    document.getElementById('modalMainImage').src = mainImage;

    document.getElementById('modalThumbnails').innerHTML = 
      product.imagenes?.map((img, i) => 
        `<img src="${img}" class="${i === 0 ? 'active' : ''}" data-index="${i}">`
      ).join('') || '';

    document.getElementById('modalColors').innerHTML = colors.map(color => {
      const variant = product.variantes.find(v => v.color === color);
      return `
        <button class="color-option ${color === firstColor ? 'selected' : ''}" 
                data-color="${color}" 
                style="background-color: ${variant?.color_hex || '#000'}"
                title="${color}">
        </button>
      `;
    }).join('');

    document.getElementById('modalSizes').innerHTML = sizes.map(size => {
      const variant = currentVariants.find(v => v.talla === size);
      const stock = variant?.stock || 0;
      return `
        <button class="size-option ${size === firstSize ? 'selected' : ''} ${stock === 0 ? 'disabled' : ''}" 
                data-size="${size}" 
                data-stock="${stock}">
          ${size}
        </button>
      `;
    }).join('');

    this.updateStockInfo(firstColor, firstSize, product);

    document.querySelectorAll('#modalColors .color-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#modalColors .color-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const newColor = btn.dataset.color;
        this.updateSizesForColor(newColor, product);
      });
    });

    document.querySelectorAll('#modalSizes .size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('disabled')) return;
        document.querySelectorAll('#modalSizes .size-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const color = document.querySelector('#modalColors .color-option.selected').dataset.color;
        const size = btn.dataset.size;
        this.updateStockInfo(color, size, product);
      });
    });

    document.getElementById('addToCartBtn').onclick = () => {
      const color = document.querySelector('#modalColors .color-option.selected')?.dataset.color;
      const size = document.querySelector('#modalSizes .size-option.selected')?.dataset.size;
      if (color && size) {
        Carrito.add(product, color, size);
      }
    };

    document.getElementById('modalThumbnails').addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        document.querySelectorAll('#modalThumbnails img').forEach(img => img.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById('modalMainImage').src = e.target.src;
      }
    });
  },

  updateSizesForColor(color, product) {
    const sizes = ['S', 'M', 'L', 'XL'];
    const currentVariants = product.variantes.filter(v => v.color === color);
    
    document.getElementById('modalSizes').innerHTML = sizes.map(size => {
      const variant = currentVariants.find(v => v.talla === size);
      const stock = variant?.stock || 0;
      return `
        <button class="size-option ${stock > 0 ? '' : 'disabled'}" 
                data-size="${size}" 
                data-stock="${stock}">
          ${size}
        </button>
      `;
    }).join('');

    document.querySelectorAll('#modalSizes .size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('disabled')) return;
        document.querySelectorAll('#modalSizes .size-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.updateStockInfo(color, btn.dataset.size, product);
      });
    });

    const firstWithStock = currentVariants.find(v => v.stock > 0);
    if (firstWithStock) {
      const btn = document.querySelector(`#modalSizes .size-option[data-size="${firstWithStock.talla}"]`);
      if (btn) btn.click();
    }

    const variant = currentVariants.find(v => v.stock > 0);
    if (variant) {
      this.updateStockInfo(color, variant.talla, product);
    } else {
      document.getElementById('modalStock').innerHTML = '<span class="out">Out of stock</span>';
    }
  },

  updateStockInfo(color, size, product) {
    const variant = product.variantes.find(v => v.color === color && v.talla === size);
    const stock = variant?.stock || 0;
    
    const stockEl = document.getElementById('modalStock');
    if (stock === 0) {
      stockEl.innerHTML = '<span class="out">Out of stock</span>';
      document.getElementById('addToCartBtn').disabled = true;
    } else if (stock <= 3) {
      stockEl.innerHTML = `<span class="low">Last ${stock} units!</span>`;
      document.getElementById('addToCartBtn').disabled = false;
    } else {
      stockEl.innerHTML = `<span>Available stock: ${stock}</span>`;
      document.getElementById('addToCartBtn').disabled = false;
    }
  }
};
