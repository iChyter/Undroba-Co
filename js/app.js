const App = {
  user: null,
  isAdmin: false,
  cart: JSON.parse(localStorage.getItem('cart')) || [],

  initShop() {
    this.loadUser();
    this.updateCartCount();
    this.setupMobileMenu();
    this.setupModal();
  },

  initCart() {
    this.loadUser();
    this.updateCartCount();
    this.setupMobileMenu();
  },

  initAdmin() {
    this.loadUser();
    this.updateCartCount();
    this.setupMobileMenu();
    this.checkAdminAuth();
  },

  async checkAdminAuth() {
    const session = localStorage.getItem('sb-session');
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    
    const sessionData = JSON.parse(session);
    this.user = sessionData?.user || null;
    this.isAdmin = sessionData?.isAdmin || false;
    
    if (!this.isAdmin) {
      window.location.href = 'login.html';
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

  setupModal() {
    const closeBtn = document.getElementById('modalClose');
    const overlay = document.querySelector('.modal-overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    if (overlay) {
      overlay.addEventListener('click', () => this.closeModal());
    }
  },

  async loadUser() {
    const sessionStr = localStorage.getItem('sb-session');
    if (sessionStr) {
      try {
        const sessionData = JSON.parse(sessionStr);
        this.user = sessionData?.user || null;
        this.isAdmin = sessionData?.isAdmin || false;
        this.updateAuthUI();
      } catch (e) {
        localStorage.removeItem('sb-session');
      }
    }
  },

  updateAuthUI() {
    const authLink = document.getElementById('authLink');
    if (!authLink) return;

    if (this.user) {
      authLink.textContent = 'Logout';
      authLink.href = 'login.html?logout=true';
    }
  },

  async logout() {
    await Auth.signOut();
    this.user = null;
    this.isAdmin = false;
    localStorage.removeItem('sb-session');
    this.updateAuthUI();
    this.showToast('Logged out', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
  },

  updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
      const count = this.cart.reduce((sum, item) => sum + item.cantidad, 0);
      countEl.textContent = count;
    }
  },

  openModal(product, variant) {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      Productos.renderModal(product, variant);
    }
  },

  closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.className = 'toast ' + type;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }
};

const Login = {
  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'true') {
      await App.logout();
      return;
    }

    await App.loadUser();
    App.updateCartCount();
    App.setupMobileMenu();
    this.setupForm();
  },

  setupForm() {
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleLogin();
      });
    }
  },

  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    try {
      const { data, error } = await Auth.signIn(email, password);
      console.log('Auth response:', { data, error });
      
      if (error) throw error;
      
      // Try to get user from response or session
      let user = data?.user || data?.data?.user;
      if (!user) {
        // Check if there's a session
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Session:', sessionData);
        if (sessionData?.session?.user) {
          user = sessionData.session.user;
        } else {
          throw new Error('No se pudo obtener el usuario');
        }
      }

      const isAdmin = Auth.isAdmin(email);
      
      localStorage.setItem('sb-session', JSON.stringify({
        user: user,
        isAdmin: isAdmin
      }));

      App.showToast('Logged in successfully', 'success');
      
      if (isAdmin) {
        window.location.href = 'admin/index.html';
      } else {
        window.location.href = 'index.html';
      }
    } catch (error) {
      errorEl.textContent = error.message || 'Invalid email or password';
      errorEl.style.display = 'block';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('admin.html')) {
    // Admin page handles its own init
  } else if (path.includes('login.html')) {
    Login.init();
  } else if (path.includes('cart.html')) {
    // Cart page handles its own init
  } else {
    App.initShop();
  }
});
