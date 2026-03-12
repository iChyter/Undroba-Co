const AdminPedidos = {
  async init() {
    this.checkAuth();
    this.setupLogout();
    this.setupFilters();
    await this.loadPedidos();
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

  setupFilters() {
    const filterProveedor = document.getElementById('filterProveedor');
    const filterEstado = document.getElementById('filterEstado');

    filterProveedor?.addEventListener('change', () => this.loadPedidos());
    filterEstado?.addEventListener('change', () => this.loadPedidos());
  },

  async loadPedidos() {
    const filterProveedor = document.getElementById('filterProveedor')?.value || '';
    const filterEstado = document.getElementById('filterEstado')?.value || '';

    let query = supabase.from('pedidos').select('*').order('fecha_pedido', { ascending: false });

    if (filterProveedor) {
      query = query.eq('proveedor', filterProveedor);
    }
    if (filterEstado) {
      query = query.eq('estado', filterEstado);
    }

    const { data: pedidos, error } = await query;

    const container = document.getElementById('pedidosList');
    
    if (error || !pedidos?.length) {
      container.innerHTML = '<p class="empty-state">No hay pedidos</p>';
      return;
    }

    container.innerHTML = pedidos.map(p => `
      <div class="pedido-item">
        <div class="pedido-header">
          <span class="pedido-proveedor ${p.proveedor}">${p.proveedor.toUpperCase()}</span>
          <span class="pedido-estado ${p.estado}">${this.getEstadoLabel(p.estado)}</span>
        </div>
        <div class="pedido-body">
          <h4 class="pedido-producto">${p.producto}</h4>
          <div class="pedido-details">
            <span>Cantidad: ${p.cantidad}</span>
            <span>Unitario: $${parseFloat(p.precio_unitario || 0).toFixed(2)}</span>
            <span>Total: $${parseFloat(p.precio_total || 0).toFixed(2)}</span>
          </div>
          <div class="pedido-dates">
            <span>Pedido: ${this.formatDate(p.fecha_pedido)}</span>
            ${p.fecha_estimada ? `<span>Estimado: ${this.formatDate(p.fecha_estimada)}</span>` : ''}
          </div>
          ${p.notas ? `<p class="pedido-notas">${p.notas}</p>` : ''}
        </div>
        <div class="pedido-actions">
          <button class="btn-edit" onclick="AdminPedidos.editPedido('${p.id}')">Editar</button>
          <button class="btn-delete" onclick="AdminPedidos.deletePedido('${p.id}')">Eliminar</button>
        </div>
      </div>
    `).join('');
  },

  getEstadoLabel(estado) {
    const labels = {
      pendiente: 'Pendiente',
      enviado: 'Enviado',
      recibido: 'Recibido',
      cancelado: 'Cancelado'
    };
    return labels[estado] || estado;
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES');
  },

  editPedido(id) {
    window.location.href = `editar-pedido.html?id=${id}`;
  },

  async deletePedido(id) {
    if (!confirm('¿Eliminar este pedido?')) return;

    const { error } = await supabase.from('pedidos').delete().eq('id', id);
    if (error) {
      this.showToast('Error al eliminar');
      return;
    }
    this.showToast('Pedido eliminado');
    this.loadPedidos();
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};
