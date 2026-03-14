/**
 * Admin Productos - Undroba Co.
 * Gestión de productos del catálogo
 */

const AdminProductos = {
  // Datos de ejemplo para demostración
  mockData: {
    stats: {
      total: 48,
      activos: 42,
      agotados: 6,
      stockBajo: 8
    },
    products: [
      {
        id: 'PROD-001',
        nombre: 'Camiseta Oversize Roja',
        categoria: 'Camisetas',
        genero: 'Unisex',
        precio: 35.00,
        stock: 15,
        estado: 'activo',
        imagen: '👕',
        colores: ['Rojo', 'Negro', 'Blanco'],
        tallas: ['S', 'M', 'L', 'XL'],
        descripcion: 'Camiseta oversize 100% algodón',
        fecha: '2024-12-01'
      },
      {
        id: 'PROD-002',
        nombre: 'Sudadera Clásica Negra',
        categoria: 'Sudaderas',
        genero: 'Unisex',
        precio: 59.99,
        stock: 8,
        estado: 'activo',
        imagen: '🧥',
        colores: ['Negro', 'Gris'],
        tallas: ['S', 'M', 'L', 'XL', 'XXL'],
        descripcion: 'Sudadera con capucha clásica',
        fecha: '2024-12-02'
      },
      {
        id: 'PROD-003',
        nombre: 'Pantalón Cargo Verde',
        categoria: 'Pantalones',
        genero: 'Hombre',
        precio: 45.50,
        stock: 0,
        estado: 'agotado',
        imagen: '👖',
        colores: ['Verde', 'Negro', 'Beige'],
        tallas: ['30', '32', '34', '36'],
        descripcion: 'Pantalón cargo con múltiples bolsillos',
        fecha: '2024-12-03'
      },
      {
        id: 'PROD-004',
        nombre: 'Gorra Vintage Beige',
        categoria: 'Accesorios',
        genero: 'Unisex',
        precio: 22.00,
        stock: 3,
        estado: 'stock_bajo',
        imagen: '🧢',
        colores: ['Beige', 'Negro', 'Blanco'],
        tallas: ['Única'],
        descripcion: 'Gorra estilo vintage ajustable',
        fecha: '2024-12-04'
      },
      {
        id: 'PROD-005',
        nombre: 'Zapatillas Urbanas',
        categoria: 'Zapatos',
        genero: 'Unisex',
        precio: 89.99,
        stock: 12,
        estado: 'activo',
        imagen: '👟',
        colores: ['Blanco', 'Negro'],
        tallas: ['38', '39', '40', '41', '42', '43', '44'],
        descripcion: 'Zapatillas urbanas cómodas',
        fecha: '2024-12-05'
      },
      {
        id: 'PROD-006',
        nombre: 'Camiseta Básica Blanca',
        categoria: 'Camisetas',
        genero: 'Mujer',
        precio: 25.00,
        stock: 25,
        estado: 'activo',
        imagen: '👕',
        colores: ['Blanco', 'Negro', 'Gris'],
        tallas: ['XS', 'S', 'M', 'L'],
        descripcion: 'Camiseta básica essential',
        fecha: '2024-12-06'
      },
      {
        id: 'PROD-007',
        nombre: 'Chaqueta Denim',
        categoria: 'Chaquetas',
        genero: 'Mujer',
        precio: 75.00,
        stock: 5,
        estado: 'stock_bajo',
        imagen: '🧥',
        colores: ['Azul', 'Negro'],
        tallas: ['S', 'M', 'L'],
        descripcion: 'Chaqueta denim clásica',
        fecha: '2024-12-07'
      },
      {
        id: 'PROD-008',
        nombre: 'Shorts Deportivos',
        categoria: 'Shorts',
        genero: 'Hombre',
        precio: 32.50,
        stock: 18,
        estado: 'activo',
        imagen: '🩳',
        colores: ['Negro', 'Gris', 'Azul'],
        tallas: ['S', 'M', 'L', 'XL'],
        descripcion: 'Shorts deportivos transpirables',
        fecha: '2024-12-08'
      }
    ]
  },

  filteredProducts: [],
  currentProduct: null,

  init() {
    this.checkAuth();
    this.loadProducts();
    this.setupEventListeners();
  },

  checkAuth() {
    const sessionStr = localStorage.getItem('sb-session');
    if (!sessionStr) {
      window.location.href = '../login.html';
      return;
    }
    try {
      const sessionData = JSON.parse(sessionStr);
      if (!sessionData?.isAdmin) {
        window.location.href = '../login.html';
      }
    } catch (e) {
      window.location.href = '../login.html';
    }
  },

  async loadProducts() {
    try {
      // Intentar cargar datos reales de Supabase
      if (typeof supabase !== 'undefined') {
        const { data: products, error } = await supabase
          .from('productos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (products && products.length > 0) {
          this.filteredProducts = products;
          this.updateStats(products);
        } else {
          // Usar datos de ejemplo
          this.filteredProducts = this.mockData.products;
          this.updateStatsFromMock();
        }
      } else {
        // Usar datos de ejemplo
        this.filteredProducts = this.mockData.products;
        this.updateStatsFromMock();
      }
      
      this.renderProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      // Usar datos de ejemplo en caso de error
      this.filteredProducts = this.mockData.products;
      this.updateStatsFromMock();
      this.renderProducts();
    }
  },

  updateStatsFromMock() {
    document.getElementById('stat-total').textContent = this.mockData.stats.total;
    document.getElementById('stat-activos').textContent = this.mockData.stats.activos;
    document.getElementById('stat-agotados').textContent = this.mockData.stats.agotados;
    document.getElementById('stat-bajo').textContent = this.mockData.stats.stockBajo;
  },

  updateStats(products) {
    const stats = {
      total: products.length,
      activos: products.filter(p => p.estado === 'activo').length,
      agotados: products.filter(p => p.stock === 0).length,
      stockBajo: products.filter(p => p.stock > 0 && p.stock < 5).length
    };
    
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-activos').textContent = stats.activos;
    document.getElementById('stat-agotados').textContent = stats.agotados;
    document.getElementById('stat-bajo').textContent = stats.stockBajo;
  },

  setupEventListeners() {
    // Filtros
    const filterCategoria = document.getElementById('filterCategoria');
    const filterEstado = document.getElementById('filterEstado');
    const searchInput = document.getElementById('searchProducts');

    if (filterCategoria) {
      filterCategoria.addEventListener('change', () => this.applyFilters());
    }
    if (filterEstado) {
      filterEstado.addEventListener('change', () => this.applyFilters());
    }
    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyFilters());
    }
  },

  applyFilters() {
    const categoria = document.getElementById('filterCategoria').value;
    const estado = document.getElementById('filterEstado').value;
    const search = document.getElementById('searchProducts').value.toLowerCase();

    this.filteredProducts = this.mockData.products.filter(product => {
      const matchCategoria = !categoria || product.categoria === categoria;
      const matchEstado = !estado || product.estado === estado;
      const matchSearch = !search || 
        product.nombre.toLowerCase().includes(search) ||
        product.id.toLowerCase().includes(search);
      
      return matchCategoria && matchEstado && matchSearch;
    });

    this.renderProducts();
  },

  renderProducts() {
    const container = document.getElementById('productsList');
    if (!container) return;

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <h3>Sin productos</h3>
          <p>No se encontraron productos con los filtros seleccionados.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredProducts.map(product => this.createProductCard(product)).join('');
  },

  createProductCard(product) {
    const estadoClases = {
      activo: 'status-badge active',
      agotado: 'status-badge out',
      stock_bajo: 'status-badge low'
    };

    const estadoLabels = {
      activo: 'Activo',
      agotado: 'Agotado',
      stock_bajo: 'Stock Bajo'
    };

    const stockColor = product.stock === 0 ? '#ef4444' : product.stock < 5 ? '#f59e0b' : '#10b981';

    return `
      <div class="product-card">
        <div class="product-image">
          <span class="product-emoji">${product.imagen}</span>
          <span class="${estadoClases[product.estado]}">${estadoLabels[product.estado]}</span>
        </div>
        <div class="product-info">
          <div class="product-header">
            <h3 class="product-name">${product.nombre}</h3>
            <span class="product-price">$${product.precio.toFixed(2)}</span>
          </div>
          <div class="product-meta">
            <span class="product-tag">${product.categoria}</span>
            <span class="product-tag">${product.genero}</span>
          </div>
          <div class="product-details">
            <div class="product-stock" style="color: ${stockColor};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              ${product.stock} unidades
            </div>
            <div class="product-variants">
              ${product.colores.length} colores · ${product.tallas.length} tallas
            </div>
          </div>
          <p class="product-description">${product.descripcion}</p>
          <div class="product-actions">
            <button class="btn-action" onclick="event.stopPropagation(); AdminProductos.editProduct('${product.id}')" title="Editar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-action" onclick="event.stopPropagation(); AdminProductos.deleteProduct('${product.id}')" title="Eliminar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async deleteProduct(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      if (typeof supabase !== 'undefined') {
        const { error } = await supabase.from('productos').delete().eq('id', id);
        if (error) throw error;
      }
      
      // Eliminar del array mock
      this.mockData.products = this.mockData.products.filter(p => p.id !== id);
      this.applyFilters();
      this.showToast('Producto eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      this.showToast('Error al eliminar el producto', 'error');
    }
  },

  editProduct(id) {
    window.location.href = `editar-producto.html?id=${id}`;
  },

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
};

// Expose globally
window.AdminProductos = AdminProductos;
