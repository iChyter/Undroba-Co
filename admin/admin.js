const AdminDashboard = {
  async init() {
    this.checkAuth();
    this.setupMobileMenu();
    this.setupLogout();
    await this.loadStats();
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

  async loadStats() {
    const { data: products } = await supabase.from('productos').select('id');
    const { data: variantes } = await supabase.from('producto_variantes').select('stock');
    
    const productosActivos = products?.length || 0;
    const stockBajo = variantes?.filter(v => v.stock > 0 && v.stock <= 3).length || 0;

    document.getElementById('stat-productos').textContent = productosActivos;
    document.getElementById('stat-stock-bajo').textContent = stockBajo;
  }
};
