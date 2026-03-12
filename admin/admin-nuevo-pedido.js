const AdminNuevoPedido = {
  async init() {
    this.checkAuth();
    this.setupLogout();
    this.setupForm();
    this.setDefaultDate();
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

  setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_pedido').value = today;
  },

  setupForm() {
    const form = document.getElementById('pedidoForm');
    const cantidad = document.getElementById('cantidad');
    const precioUnitario = document.getElementById('precio_unitario');
    const precioTotal = document.getElementById('precio_total');
    const gastosEnvio = document.getElementById('gastos_envio');

    const calculateTotal = () => {
      const cant = parseFloat(cantidad.value) || 0;
      const precio = parseFloat(precioUnitario.value) || 0;
      const envio = parseFloat(gastosEnvio.value) || 0;
      const total = (cant * precio) + envio;
      precioTotal.value = total.toFixed(2);
    };

    cantidad?.addEventListener('input', calculateTotal);
    precioUnitario?.addEventListener('input', calculateTotal);
    gastosEnvio?.addEventListener('input', calculateTotal);

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitForm(form);
    });
  },

  async submitForm(form) {
    const formData = new FormData(form);
    
    const pedido = {
      proveedor: formData.get('proveedor'),
      fecha_pedido: formData.get('fecha_pedido'),
      numero_pedido: formData.get('numero_pedido') || null,
      estado: formData.get('estado'),
      producto: formData.get('producto'),
      cantidad: parseInt(formData.get('cantidad')),
      precio_unitario: parseFloat(formData.get('precio_unitario')),
      precio_total: parseFloat(formData.get('precio_total')),
      gastos_envio: parseFloat(formData.get('gastos_envio')) || 0,
      fecha_estimada: formData.get('fecha_estimada') || null,
      notas: formData.get('notas') || null
    };

    const { error } = await supabase.from('pedidos').insert([pedido]);

    if (error) {
      this.showToast('Error al crear el pedido: ' + error.message);
      return;
    }

    this.showToast('Pedido creado correctamente');
    setTimeout(() => {
      window.location.href = 'pedidos.html';
    }, 1000);
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};
