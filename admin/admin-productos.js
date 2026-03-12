const AdminProductos = {
  async init() {
    this.checkAuth();
    this.setupMobileMenu();
    this.setupLogout();
    await this.loadProducts();
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

  setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        document.querySelector('.nav').classList.toggle('active');
      });
    }
  },

  setupLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  },

  async logout() {
    await Auth.signOut();
    localStorage.removeItem('sb-session');
    window.location.href = '../login.html';
  },

  async loadProducts() {
    const { data: products, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    const container = document.getElementById('productsList');
    
    if (error || !products?.length) {
      container.innerHTML = '<p>No hay productos</p>';
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="product-list-item">
        <img class="product-list-image" src="${p.imagenes?.[0] || ''}" alt="${p.nombre}">
        <div class="product-list-info">
          <h4 class="product-list-name">${p.nombre}</h4>
          <p class="product-list-meta">${p.categoria} · ${p.genero} · $${p.precio_base}</p>
        </div>
        <div class="product-list-actions">
          <button class="btn-edit" onclick="AdminProductos.editProduct('${p.id}')">Editar</button>
          <button class="btn-delete" onclick="AdminProductos.deleteProduct('${p.id}')">Eliminar</button>
        </div>
      </div>
    `).join('');
  },

  async deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;

    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar');
      return;
    }
    this.loadProducts();
  },

  editProduct(id) {
    window.location.href = `editar-producto.html?id=${id}`;
  }
};
