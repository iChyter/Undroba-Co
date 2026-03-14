/**
 * Admin Órdenes - Undroba Co.
 * Gestión de órdenes de clientes
 */

const AdminOrdenes = {
  // Datos de ejemplo para demostración
  mockData: {
    stats: {
      total: 156,
      pendientes: 23,
      procesando: 45,
      completadas: 78,
      canceladas: 10,
      ingresos: 28450
    },
    orders: [
      {
        id: 'ORD-001',
        cliente: 'María García',
        email: 'maria@email.com',
        telefono: '+54 11 6123-4567',
        fecha: '2024-12-15',
        total: 125.50,
        estado: 'completada',
        productos: [
          { nombre: 'Camiseta Oversize Roja', cantidad: 2, precio: 35.00 },
          { nombre: 'Gorra Vintage Beige', cantidad: 1, precio: 22.00 }
        ],
        direccion: 'Av. Corrientes 1234, CABA'
      },
      {
        id: 'ORD-002',
        cliente: 'Carlos López',
        email: 'carlos@email.com',
        telefono: '+54 11 6234-5678',
        fecha: '2024-12-15',
        total: 89.99,
        estado: 'procesando',
        productos: [
          { nombre: 'Sudadera Clásica Negra', cantidad: 1, precio: 59.99 },
          { nombre: 'Pantalón Cargo Verde', cantidad: 1, precio: 30.00 }
        ],
        direccion: 'Calle Florida 567, CABA'
      },
      {
        id: 'ORD-003',
        cliente: 'Ana Martínez',
        email: 'ana@email.com',
        telefono: '+54 11 6345-6789',
        fecha: '2024-12-14',
        total: 156.00,
        estado: 'pendiente',
        productos: [
          { nombre: 'Zapatillas Urbanas', cantidad: 1, precio: 89.99 },
          { nombre: 'Camiseta Básica Blanca', cantidad: 2, precio: 25.00 },
          { nombre: 'Shorts Deportivos', cantidad: 1, precio: 32.50 }
        ],
        direccion: 'Av. Santa Fe 890, CABA'
      },
      {
        id: 'ORD-004',
        cliente: 'Juan Pérez',
        email: 'juan@email.com',
        telefono: '+54 11 6456-7890',
        fecha: '2024-12-14',
        total: 45.50,
        estado: 'completada',
        productos: [
          { nombre: 'Pantalón Cargo Verde', cantidad: 1, precio: 45.50 }
        ],
        direccion: 'Calle Lavalle 123, CABA'
      },
      {
        id: 'ORD-005',
        cliente: 'Laura Sánchez',
        email: 'laura@email.com',
        telefono: '+54 11 6567-8901',
        fecha: '2024-12-13',
        total: 67.00,
        estado: 'cancelada',
        productos: [
          { nombre: 'Bufanda Tejida', cantidad: 1, precio: 28.00 },
          { nombre: 'Gorra Vintage Beige', cantidad: 1, precio: 22.00 },
          { nombre: 'Cinturón Cuero', cantidad: 1, precio: 17.00 }
        ],
        direccion: 'Av. Callao 456, CABA'
      },
      {
        id: 'ORD-006',
        cliente: 'Pedro Ruiz',
        email: 'pedro@email.com',
        telefono: '+54 11 6678-9012',
        fecha: '2024-12-13',
        total: 198.50,
        estado: 'procesando',
        productos: [
          { nombre: 'Chaqueta Denim', cantidad: 1, precio: 75.00 },
          { nombre: 'Camiseta Oversize Roja', cantidad: 2, precio: 35.00 },
          { nombre: 'Sudadera Clásica Negra', cantidad: 1, precio: 53.50 }
        ],
        direccion: 'Calle Reconquista 789, CABA'
      },
      {
        id: 'ORD-007',
        cliente: 'Sofía Torres',
        email: 'sofia@email.com',
        telefono: '+54 11 6789-0123',
        fecha: '2024-12-12',
        total: 34.99,
        estado: 'completada',
        productos: [
          { nombre: 'Camiseta Básica Blanca', cantidad: 1, precio: 25.00 },
          { nombre: 'Gorra Vintage Beige', cantidad: 1, precio: 9.99 }
        ],
        direccion: 'Av. 9 de Julio 321, CABA'
      },
      {
        id: 'ORD-008',
        cliente: 'Diego Morales',
        email: 'diego@email.com',
        telefono: '+54 11 6890-1234',
        fecha: '2024-12-12',
        total: 142.00,
        estado: 'pendiente',
        productos: [
          { nombre: 'Zapatillas Urbanas', cantidad: 1, precio: 89.99 },
          { nombre: 'Pantalón Cargo Verde', cantidad: 1, precio: 45.50 },
          { nombre: 'Cinturón Cuero', cantidad: 1, precio: 6.51 }
        ],
        direccion: 'Calle Maipú 654, CABA'
      }
    ]
  },

  filteredOrders: [],
  currentOrder: null,

  init() {
    this.checkAuth();
    this.loadOrders();
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

  async loadOrders() {
    try {
      // Intentar cargar datos reales de Supabase
      if (typeof supabase !== 'undefined') {
        const { data: orders, error } = await supabase
          .from('ordenes')
          .select('*')
          .order('fecha', { ascending: false });
        
        if (error) throw error;
        
        if (orders && orders.length > 0) {
          this.filteredOrders = orders;
          this.updateStats(orders);
        } else {
          // Usar datos de ejemplo
          this.filteredOrders = this.mockData.orders;
          this.updateStatsFromMock();
        }
      } else {
        // Usar datos de ejemplo
        this.filteredOrders = this.mockData.orders;
        this.updateStatsFromMock();
      }
      
      this.renderOrders();
    } catch (error) {
      console.error('Error loading orders:', error);
      // Usar datos de ejemplo en caso de error
      this.filteredOrders = this.mockData.orders;
      this.updateStatsFromMock();
      this.renderOrders();
    }
  },

  updateStatsFromMock() {
    document.getElementById('stat-total').textContent = this.mockData.stats.total;
    document.getElementById('stat-pendientes').textContent = this.mockData.stats.pendientes;
    document.getElementById('stat-procesando').textContent = this.mockData.stats.procesando;
    document.getElementById('stat-completadas').textContent = this.mockData.stats.completadas;
  },

  updateStats(orders) {
    const stats = {
      total: orders.length,
      pendientes: orders.filter(o => o.estado === 'pendiente').length,
      procesando: orders.filter(o => o.estado === 'procesando').length,
      completadas: orders.filter(o => o.estado === 'completada').length
    };
    
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-pendientes').textContent = stats.pendientes;
    document.getElementById('stat-procesando').textContent = stats.procesando;
    document.getElementById('stat-completadas').textContent = stats.completadas;
  },

  setupEventListeners() {
    // Filtros
    const filterEstado = document.getElementById('filterEstado');
    const filterFecha = document.getElementById('filterFecha');
    const searchInput = document.getElementById('searchOrders');

    if (filterEstado) {
      filterEstado.addEventListener('change', () => this.applyFilters());
    }
    if (filterFecha) {
      filterFecha.addEventListener('change', () => this.applyFilters());
    }
    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyFilters());
    }

    // Modal
    const modal = document.getElementById('orderModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeOrderModal();
        }
      });
    }
  },

  applyFilters() {
    const estado = document.getElementById('filterEstado').value;
    const fecha = document.getElementById('filterFecha').value;
    const search = document.getElementById('searchOrders').value.toLowerCase();

    this.filteredOrders = this.mockData.orders.filter(order => {
      const matchEstado = !estado || order.estado === estado;
      const matchFecha = !fecha || order.fecha === fecha;
      const matchSearch = !search || 
        order.cliente.toLowerCase().includes(search) ||
        order.id.toLowerCase().includes(search) ||
        order.email.toLowerCase().includes(search);
      
      return matchEstado && matchFecha && matchSearch;
    });

    this.renderOrders();
  },

  renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;

    if (this.filteredOrders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          <h3>Sin órdenes</h3>
          <p>No se encontraron órdenes con los filtros seleccionados.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredOrders.map(order => this.createOrderCard(order)).join('');
  },

  createOrderCard(order) {
    const estadoClases = {
      pendiente: 'status-pill pending',
      procesando: 'status-pill processing',
      completada: 'status-pill completed',
      cancelada: 'status-pill cancelled'
    };

    const estadoLabels = {
      pendiente: 'Pendiente',
      procesando: 'Procesando',
      completada: 'Completada',
      cancelada: 'Cancelada'
    };

    return `
      <div class="order-card" onclick="AdminOrdenes.openOrderDetail('${order.id}')">
        <div class="order-card-header">
          <div class="order-info">
            <span class="order-id">${order.id}</span>
            <span class="order-date">${this.formatDate(order.fecha)}</span>
          </div>
          <span class="${estadoClases[order.estado]}">${estadoLabels[order.estado]}</span>
        </div>
        <div class="order-card-body">
          <div class="order-client">
            <div class="client-avatar">${order.cliente.charAt(0)}</div>
            <div class="client-info">
              <div class="client-name">${order.cliente}</div>
              <div class="client-contact">${order.telefono}</div>
            </div>
          </div>
          <div class="order-products-preview">
            ${order.productos.slice(0, 2).map(p => `
              <span class="product-tag">${p.cantidad}x ${p.nombre}</span>
            `).join('')}
            ${order.productos.length > 2 ? `<span class="product-tag more">+${order.productos.length - 2}</span>` : ''}
          </div>
        </div>
        <div class="order-card-footer">
          <span class="order-total">$${order.total.toFixed(2)}</span>
          <button class="btn-view" onclick="event.stopPropagation(); AdminOrdenes.openOrderDetail('${order.id}')">
            Ver detalle
          </button>
        </div>
      </div>
    `;
  },

  openOrderDetail(orderId) {
    const order = this.mockData.orders.find(o => o.id === orderId);
    if (!order) return;

    this.currentOrder = order;
    const modal = document.getElementById('orderModal');
    const modalContent = document.getElementById('orderModalContent');

    const estadoClases = {
      pendiente: 'status-pill pending',
      procesando: 'status-pill processing',
      completada: 'status-pill completed',
      cancelada: 'status-pill cancelled'
    };

    const estadoLabels = {
      pendiente: 'Pendiente',
      procesando: 'Procesando',
      completada: 'Completada',
      cancelada: 'Cancelada'
    };

    modalContent.innerHTML = `
      <div class="modal-header">
        <div>
          <h2>${order.id}</h2>
          <p class="modal-date">${this.formatDate(order.fecha)}</p>
        </div>
        <span class="${estadoClases[order.estado]}">${estadoLabels[order.estado]}</span>
        <button class="modal-close" onclick="AdminOrdenes.closeOrderModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="order-section">
          <h3>Cliente</h3>
          <div class="client-detail">
            <div class="client-avatar large">${order.cliente.charAt(0)}</div>
            <div class="client-detail-info">
              <div class="detail-row">
                <span class="detail-label">Nombre:</span>
                <span class="detail-value">${order.cliente}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${order.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Teléfono:</span>
                <span class="detail-value">${order.telefono}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dirección:</span>
                <span class="detail-value">${order.direccion}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="order-section">
          <h3>Productos</h3>
          <div class="products-list-detail">
            ${order.productos.map(p => `
              <div class="product-item">
                <div class="product-info">
                  <span class="product-name">${p.nombre}</span>
                  <span class="product-qty">${p.cantidad} unidad${p.cantidad > 1 ? 'es' : ''}</span>
                </div>
                <span class="product-price">$${(p.precio * p.cantidad).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-total-section">
            <span class="total-label">Total</span>
            <span class="total-value">$${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="order-actions">
          ${order.estado === 'pendiente' ? `
            <button class="btn-primary" onclick="AdminOrdenes.updateOrderStatus('${order.id}', 'procesando')">
              Marcar como Procesando
            </button>
          ` : ''}
          ${order.estado === 'procesando' ? `
            <button class="btn-primary" onclick="AdminOrdenes.updateOrderStatus('${order.id}', 'completada')">
              Marcar como Completada
            </button>
          ` : ''}
          ${order.estado !== 'cancelada' && order.estado !== 'completada' ? `
            <button class="btn-secondary" onclick="AdminOrdenes.updateOrderStatus('${order.id}', 'cancelada')">
              Cancelar Orden
            </button>
          ` : ''}
        </div>
      </div>
    `;

    modal.classList.add('show');
  },

  closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    this.currentOrder = null;
  },

  updateOrderStatus(orderId, newStatus) {
    const order = this.mockData.orders.find(o => o.id === orderId);
    if (order) {
      order.estado = newStatus;
      this.renderOrders();
      this.closeOrderModal();
      this.showToast(`Orden ${orderId} actualizada a ${newStatus}`, 'success');
    }
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
window.AdminOrdenes = AdminOrdenes;
