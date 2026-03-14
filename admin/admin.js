/**
 * Admin Dashboard - Undroba Co.
 * Controlador principal del panel de administración
 */

const AdminDashboard = {
  // Datos de ejemplo para demostración
  mockData: {
    stats: {
      ingresos: 156420,
      ganancia: 42680,
      ordenes: 234,
      stockBajo: 8
    },
    salesChart: {
      current: [12500, 18200, 24500, 19800, 32100, 38600, 42300, 38900, 44500, 51200, 48600, 156420],
      previous: [9800, 15200, 21000, 17300, 28400, 32200, 36800, 34100, 39200, 42800, 41200, 44500]
    },
    categories: [
      { name: 'Camisetas', percent: 85, icon: '👕' },
      { name: 'Sudaderas', percent: 72, icon: '🧥' },
      { name: 'Pantalones', percent: 64, icon: '👖' },
      { name: 'Accesorios', percent: 45, icon: '🧢' },
      { name: 'Zapatos', percent: 38, icon: '👟' }
    ],
    topProducts: [
      { name: 'Camiseta Oversize Roja', category: 'Camisetas', sales: 2840, units: 142, emoji: '👕' },
      { name: 'Sudadera Clásica Negra', category: 'Sudaderas', sales: 2650, units: 89, emoji: '🧥' },
      { name: 'Pantalón Cargo Verde', category: 'Pantalones', sales: 2120, units: 106, emoji: '👖' },
      { name: 'Gorra Vintage Beige', category: 'Accesorios', sales: 1890, units: 189, emoji: '🧢' },
      { name: 'Zapatillas Urbanas', category: 'Zapatos', sales: 1650, units: 55, emoji: '👟' }
    ],
    recentOrders: [
      { customer: 'María García', product: 'Camiseta Oversize Roja', amount: 35.00, status: 'completed', avatar: 'M' },
      { customer: 'Carlos López', product: 'Sudadera Clásica Negra', amount: 59.99, status: 'processing', avatar: 'C' },
      { customer: 'Ana Martínez', product: 'Pantalón Cargo Verde', amount: 45.50, status: 'completed', avatar: 'A' },
      { customer: 'Juan Pérez', product: 'Gorra Vintage Beige', amount: 22.00, status: 'pending', avatar: 'J' },
      { customer: 'Laura Sánchez', product: 'Zapatillas Urbanas', amount: 89.99, status: 'completed', avatar: 'L' }
    ],
    transactions: [
      { product: 'Camiseta Oversize Roja', sku: 'CAM-RED-001', customer: 'María García', date: '2024-12-15', amount: 35.00, status: 'completed' },
      { product: 'Sudadera Clásica Negra', sku: 'SUD-BLK-002', customer: 'Carlos López', date: '2024-12-15', amount: 59.99, status: 'processing' },
      { product: 'Pantalón Cargo Verde', sku: 'PAN-GRN-003', customer: 'Ana Martínez', date: '2024-12-14', amount: 45.50, status: 'completed' },
      { product: 'Gorra Vintage Beige', sku: 'GOR-BEI-004', customer: 'Juan Pérez', date: '2024-12-14', amount: 22.00, status: 'pending' },
      { product: 'Zapatillas Urbanas', sku: 'ZAP-URB-005', customer: 'Laura Sánchez', date: '2024-12-14', amount: 89.99, status: 'completed' },
      { product: 'Camiseta Básica Blanca', sku: 'CAM-WHT-006', customer: 'Pedro Ruiz', date: '2024-12-13', amount: 25.00, status: 'shipped' },
      { product: 'Chaqueta Denim', sku: 'CHA-DNM-007', customer: 'Sofía Torres', date: '2024-12-13', amount: 75.00, status: 'completed' },
      { product: 'Shorts Deportivos', sku: 'SHO-BLK-008', customer: 'Diego Morales', date: '2024-12-12', amount: 32.50, status: 'completed' },
      { product: 'Bufanda Tejida', sku: 'BUF-GRY-009', customer: 'Carmen Vega', date: '2024-12-12', amount: 28.00, status: 'processing' },
      { product: 'Cinturón Cuero', sku: 'CIN-LTH-010', customer: 'Roberto Díaz', date: '2024-12-11', amount: 42.00, status: 'completed' }
    ]
  },

  chartInstance: null,

  async init() {
    this.checkAuth();
    this.setupMobileMenu();
    this.setupLogout();
    await this.loadDashboardData();
    this.renderCharts();
    this.renderCategories();
    this.renderTopProducts();
    this.renderRecentOrders();
    this.renderTransactions();
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
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (btn && sidebar) {
      // Crear overlay si no existe
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
      }
      
      // Abrir/cerrar menú
      btn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
      });
      
      // Cerrar al hacer clic en overlay
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
      
      // Cerrar al hacer clic en un enlace del menú
      sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          sidebar.classList.remove('mobile-open');
          overlay.classList.remove('active');
        });
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
    if (typeof Auth !== 'undefined') {
      await Auth.signOut();
    }
    localStorage.removeItem('sb-session');
    window.location.href = '../login.html';
  },

  async loadDashboardData() {
    try {
      // Intentar cargar datos reales de Supabase
      let productCount = 0;
      let orderCount = 0;

      if (typeof supabase !== 'undefined') {
        const { data: products } = await supabase.from('productos').select('id');
        const { data: pedidos } = await supabase.from('pedidos_proveedor').select('id');
        productCount = products?.length || 0;
        orderCount = pedidos?.length || 0;
      }

      // Si no hay datos reales, usar datos de ejemplo
      const stats = {
        ingresos: this.mockData.stats.ingresos,
        ganancia: this.mockData.stats.ganancia,
        ordenes: orderCount || this.mockData.stats.ordenes,
        stockBajo: this.mockData.stats.stockBajo
      };

      // Actualizar UI con animación
      this.animateValue('stat-ingresos', stats.ingresos, '$');
      this.animateValue('stat-ganancia', stats.ganancia, '$');
      this.animateValue('stat-ordenes', stats.ordenes, '');
      this.animateValue('stat-stock-bajo', stats.stockBajo, '');

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Usar datos de ejemplo si hay error
      this.animateValue('stat-ingresos', this.mockData.stats.ingresos, '$');
      this.animateValue('stat-ganancia', this.mockData.stats.ganancia, '$');
      this.animateValue('stat-ordenes', this.mockData.stats.ordenes, '');
      this.animateValue('stat-stock-bajo', this.mockData.stats.stockBajo, '');
    }
  },

  animateValue(elementId, end, prefix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      
      element.textContent = prefix + this.formatNumber(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  formatNumber(num) {
    return num.toLocaleString('es-ES');
  },

  renderCharts() {
    const chartEl = document.getElementById('sales-chart');
    if (!chartEl) return;

    const options = {
      chart: {
        type: 'area',
        height: 320,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Geologica, sans-serif'
      },
      series: [
        {
          name: '2024',
          data: this.mockData.salesChart.current
        },
        {
          name: '2023',
          data: this.mockData.salesChart.previous
        }
      ],
      colors: ['#E53935', '#8B0000'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100],
          colorStops: [
            [
              { offset: 0, color: '#E53935', opacity: 0.4 },
              { offset: 100, color: '#E53935', opacity: 0 }
            ],
            [
              { offset: 0, color: '#8B0000', opacity: 0.4 },
              { offset: 100, color: '#8B0000', opacity: 0 }
            ]
          ]
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      grid: {
        strokeDashArray: 4,
        borderColor: '#27272a',
        xaxis: { lines: { show: false } }
      },
      dataLabels: { enabled: false },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: '#a1a1aa', useSeriesColors: false },
        markers: { radius: 12 }
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: '#71717a', fontSize: '12px' }
        }
      },
      yaxis: {
        labels: {
          style: { colors: '#71717a', fontSize: '12px' },
          formatter: (value) => {
            if (value >= 1000) {
              return '$' + (value / 1000).toFixed(1) + 'k';
            }
            return '$' + value;
          }
        }
      },
      tooltip: {
        theme: 'dark',
        x: { show: false },
        y: {
          formatter: (value) => '$' + value.toLocaleString('es-ES')
        },
        style: {
          fontSize: '13px',
          fontFamily: 'Geologica, sans-serif'
        },
        background: {
          color: '#141414',
          borderColor: '#27272a',
          borderWidth: 1
        },
        marker: { show: true }
      }
    };

    this.chartInstance = new ApexCharts(chartEl, options);
    this.chartInstance.render();
  },

  renderCategories() {
    const container = document.getElementById('categories-list');
    if (!container) return;

    container.innerHTML = this.mockData.categories.map(cat => `
      <div class="progress-item">
        <div class="progress-info">
          <span class="category-label">
            <span class="category-icon">${cat.icon}</span>
            ${cat.name}
          </span>
          <span class="progress-percent">${cat.percent}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${cat.percent}%"></div>
        </div>
      </div>
    `).join('');

    // Animar las barras después de renderizar
    setTimeout(() => {
      const bars = container.querySelectorAll('.progress-bar-fill');
      bars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, index * 100);
      });
    }, 100);
  },

  renderTopProducts() {
    const container = document.getElementById('top-products');
    if (!container) return;

    container.innerHTML = this.mockData.topProducts.map((product, index) => `
      <div class="top-product-item">
        <div class="top-product-rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</div>
        <div class="top-product-image">${product.emoji}</div>
        <div class="top-product-info">
          <div class="top-product-name">${product.name}</div>
          <div class="top-product-category">${product.category}</div>
        </div>
        <div class="top-product-stats">
          <div class="top-product-sales">$${product.sales.toLocaleString('es-ES')}</div>
          <div class="top-product-units">${product.units} unidades</div>
        </div>
      </div>
    `).join('');
  },

  renderRecentOrders() {
    const container = document.getElementById('recent-orders');
    if (!container) return;

    const statusLabels = {
      completed: 'Completada',
      processing: 'Procesando',
      pending: 'Pendiente'
    };

    container.innerHTML = this.mockData.recentOrders.map(order => `
      <div class="recent-order-item">
        <div class="order-avatar">${order.avatar}</div>
        <div class="order-info">
          <div class="order-customer">${order.customer}</div>
          <div class="order-product">${order.product}</div>
        </div>
        <div class="order-meta">
          <div class="order-amount">$${order.amount.toFixed(2)}</div>
          <span class="order-status ${order.status}">${statusLabels[order.status]}</span>
        </div>
      </div>
    `).join('');
  },

  renderTransactions() {
    const tbody = document.getElementById('transactions-tbody');
    if (!tbody) return;

    const statusLabels = {
      completed: 'Completada',
      processing: 'Procesando',
      pending: 'Pendiente',
      shipped: 'Enviado'
    };

    const statusClasses = {
      completed: 'completed',
      processing: 'processing',
      pending: 'pending',
      shipped: 'shipped'
    };

    tbody.innerHTML = this.mockData.transactions.map(tx => `
      <tr>
        <td><input type="checkbox"></td>
        <td>
          <div class="product-cell">
            <div class="product-image">👕</div>
            <div class="product-details">
              <div class="name">${tx.product}</div>
              <div class="sku">${tx.sku}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="customer-cell">
            <div class="customer-avatar">${tx.customer.charAt(0)}</div>
            <span class="customer-name">${tx.customer}</span>
          </div>
        </td>
        <td>${this.formatDate(tx.date)}</td>
        <td class="amount">$${tx.amount.toFixed(2)}</td>
        <td>
          <span class="status-pill ${statusClasses[tx.status]}">
            ${statusLabels[tx.status]}
          </span>
        </td>
        <td>
          <button class="more-btn" title="Ver detalles">···</button>
        </td>
      </tr>
    `).join('');
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  },

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
};

// Expose globally
window.AdminDashboard = AdminDashboard;
