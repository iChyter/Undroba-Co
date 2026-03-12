const AdminCaja = {
  movimientos: [],

  async init() {
    this.checkAuth();
    this.setupLogout();
    this.setupFilters();
    this.setupForm();
    await this.loadMovimientos();
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
    const filterTipo = document.getElementById('filterTipo');
    const filterMes = document.getElementById('filterMes');

    filterMes.value = new Date().toISOString.slice(0, 7);

    filterTipo?.addEventListener('change', () => this.loadMovimientos());
    filterMes?.addEventListener('change', () => this.loadMovimientos());
  },

  setupForm() {
    const form = document.getElementById('movimientoForm');
    const fecha = document.getElementById('movimientoFecha');

    fecha.value = new Date().toISOString().split('T')[0];

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitMovimiento(form);
    });
  },

  async loadMovimientos() {
    const filterTipo = document.getElementById('filterTipo')?.value || '';
    const filterMes = document.getElementById('filterMes')?.value || '';

    let query = supabase.from('movimientos').select('*').order('fecha', { ascending: false });

    if (filterTipo) {
      query = query.eq('tipo', filterTipo);
    }
    if (filterMes) {
      const [year, month] = filterMes.split('-');
      query = query.gte('fecha', `${year}-${month}-01`);
      query = query.lt('fecha', `${year}-${parseInt(month) + 1}-01`);
    }

    const { data: movimientos, error } = await query;

    this.movimientos = movimientos || [];
    
    this.updateStats();
    this.renderMovimientos();
  },

  updateStats() {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    const movimientosMes = this.movimientos.filter(m => m.fecha?.startsWith(currentMonth));
    
    const ingresos = movimientosMes
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + parseFloat(m.monto || 0), 0);
    
    const gastos = movimientosMes
      .filter(m => m.tipo === 'gasto')
      .reduce((sum, m) => sum + parseFloat(m.monto || 0), 0);

    const saldo = ingresos - gastos;

    document.getElementById('saldoActual').textContent = `$${saldo.toFixed(2)}`;
    document.getElementById('ingresosMes').textContent = `$${ingresos.toFixed(2)}`;
    document.getElementById('gastosMes').textContent = `$${gastos.toFixed(2)}`;
  },

  renderMovimientos() {
    const container = document.getElementById('movimientosList');
    
    if (!this.movimientos.length) {
      container.innerHTML = '<p class="empty-state">No hay movimientos</p>';
      return;
    }

    container.innerHTML = this.movimientos.map(m => `
      <div class="movimiento-item">
        <div class="movimiento-icon ${m.tipo}">
          ${m.tipo === 'ingreso' ? '+' : '-'}
        </div>
        <div class="movimiento-info">
          <h4 class="movimiento-descripcion">${m.descripcion}</h4>
          <span class="movimiento-categoria">${this.getCategoriaLabel(m.categoria)}</span>
          <span class="movimiento-fecha">${this.formatDate(m.fecha)}</span>
        </div>
        <div class="movimiento-monto ${m.tipo}">
          ${m.tipo === 'ingreso' ? '+' : '-'}$${parseFloat(m.monto).toFixed(2)}
        </div>
        <div class="movimiento-actions">
          <button class="btn-delete" onclick="AdminCaja.deleteMovimiento('${m.id}')">Eliminar</button>
        </div>
      </div>
    `).join('');
  },

  getCategoriaLabel(categoria) {
    const labels = {
      venta: 'Venta',
      gasto_proveedor: 'Gasto Proveedor',
      gasto_envio: 'Gasto Envío',
      gasto_operativo: 'Gasto Operativo',
      otro: 'Otro'
    };
    return labels[categoria] || categoria;
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES');
  },

  async submitMovimiento(form) {
    const formData = new FormData(form);
    
    const movimiento = {
      tipo: formData.get('tipo'),
      monto: parseFloat(formData.get('monto')),
      fecha: formData.get('fecha'),
      categoria: formData.get('categoria'),
      descripcion: formData.get('descripcion')
    };

    const { error } = await supabase.from('movimientos').insert([movimiento]);

    if (error) {
      this.showToast('Error al guardar: ' + error.message);
      return;
    }

    this.showToast('Movimiento guardado');
    this.closeMovimientoModal();
    await this.loadMovimientos();
  },

  async deleteMovimiento(id) {
    if (!confirm('¿Eliminar este movimiento?')) return;

    const { error } = await supabase.from('movimientos').delete().eq('id', id);
    if (error) {
      this.showToast('Error al eliminar');
      return;
    }
    this.showToast('Movimiento eliminado');
    await this.loadMovimientos();
  },

  openMovimientoModal() {
    document.getElementById('movimientoModal').classList.add('show');
    document.getElementById('movimientoFecha').value = new Date().toISOString().split('T')[0];
  },

  closeMovimientoModal() {
    document.getElementById('movimientoModal').classList.remove('show');
    document.getElementById('movimientoForm').reset();
    document.getElementById('movimientoFecha').value = new Date().toISOString().split('T')[0];
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};
