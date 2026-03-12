const Cart = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('cartContainer');
    if (!container) return;
    
    const items = this.cart;
    
    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add products to continue</p>
          <a href="index.html" class="btn-primary" style="display: block; max-width: 200px; margin: 1rem auto; text-align: center; text-decoration: none;">
            Go to Shop
          </a>
        </div>
      `;
      return;
    }

    const { items: calculatedItems, subtotal, discount, total, discountInfo } = this.calculateTotals(items);

    container.innerHTML = `
      <div class="cart-items">
        ${calculatedItems.map((item, index) => `
          <div class="cart-item">
            <img class="cart-item-image" src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-item-info">
              <h3 class="cart-item-name">${item.nombre}</h3>
              <p class="cart-item-variant">${item.color} · Talla ${item.talla}</p>
              <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="Cart.updateQuantity(${index}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="quantity-btn" onclick="Cart.updateQuantity(${index}, 1)">+</button>
              </div>
            </div>
            <div class="cart-item-price">
              <p class="cart-item-unit-price">$${item.precioUnitario.toLocaleString()} c/u</p>
              <p class="cart-item-total">$${item.subtotal.toLocaleString()}</p>
            </div>
            <button class="cart-item-remove" onclick="Cart.removeItem(${index})">&times;</button>
          </div>
        `).join('')}
      </div>

      <div class="cart-summary">
        <div class="cart-discount-info">
          <p>1 unit: <span class="${discountInfo.type === '130' ? 'active' : ''}">130% price</span></p>
          <p>2 units: <span class="${discountInfo.type === '100' ? 'active' : ''}">100% price</span></p>
          <p>3+ units: <span class="${discountInfo.type === '90' ? 'active' : ''}">90% price</span></p>
        </div>
        <div class="cart-total">
          <span>Total:</span>
          <span class="cart-total-amount">$${total.toLocaleString()}</span>
        </div>
        <button class="btn-whatsapp" onclick="Cart.sendToWhatsApp()">
          📱 Send Order via WhatsApp
        </button>
      </div>
    `;
  },

  calculateTotals(items) {
    const grouped = {};
    
    items.forEach(item => {
      const key = `${item.productoId}-${item.color}-${item.talla}`;
      if (!grouped[key]) {
        grouped[key] = { ...item };
      } else {
        grouped[key].cantidad += item.cantidad;
      }
    });

    const groupedItems = Object.values(grouped);
    let subtotal = 0;
    let totalDescuento = 0;
    let discountType = '';

    groupedItems.forEach(item => {
      let precioUnitario = item.precio;
      let multiplicador = 1;

      if (item.cantidad === 1) {
        multiplicador = 1.30;
        discountType = '130';
      } else if (item.cantidad === 2) {
        multiplicador = 1.00;
        discountType = '100';
      } else {
        multiplicador = 0.90;
        discountType = '90';
      }

      const precioConDescuento = precioUnitario * multiplicador;
      const subtotalItem = precioConDescuento * item.cantidad;
      
      subtotal += precioUnitario * item.cantidad;
      totalDescuento += subtotalItem;
    });

    return {
      items: groupedItems,
      subtotal,
      discount: subtotal - totalDescuento,
      total: totalDescuento,
      discountInfo: { type: discountType }
    };
  },

  add(product, color, size) {
    const variant = product.variantes.find(v => v.color === color && v.talla === size);
    
    if (!variant || variant.stock < 1) {
      App.showToast('No stock available', 'error');
      return;
    }

    const existingIndex = this.cart.findIndex(
      item => item.productoId === product.id && item.color === color && item.talla === size
    );

    if (existingIndex > -1) {
      if (this.cart[existingIndex].cantidad >= variant.stock) {
        App.showToast('No more stock available', 'error');
        return;
      }
      this.cart[existingIndex].cantidad += 1;
    } else {
      this.cart.push({
        productoId: product.id,
        nombre: product.nombre,
        precio: product.precio_base,
        color,
        size,
        cantidad: 1,
        imagen: product.imagenes?.[0] || ''
      });
    }

    this.save();
    this.updateCartCount();
    App.closeModal();
    App.showToast('Product added to cart', 'success');
  },

  updateQuantity(index, change) {
    const item = this.cart[index];
    if (!item) return;

    const newQuantity = item.cantidad + change;
    
    if (newQuantity < 1) {
      this.removeItem(index);
      return;
    }

    item.cantidad = newQuantity;
    this.save();
    this.updateCartCount();
    this.render();
  },

  removeItem(index) {
    this.cart.splice(index, 1);
    this.save();
    this.updateCartCount();
    this.render();
    App.showToast('Product removed', 'success');
  },

  save() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  },

  updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
      const count = this.cart.reduce((sum, item) => sum + item.cantidad, 0);
      countEl.textContent = count;
    }
  },

  sendToWhatsApp() {
    const { items: calculatedItems, total } = this.calculateTotals(this.cart);
    
    let message = '🛒 *Mi Pedido en Undroba Co.*\n\n';
    message += '*Productos:*\n';
    
    calculatedItems.forEach(item => {
      message += `• ${item.nombre} (${item.color}, T${item.talla}) × ${item.cantidad} = $${item.subtotal.toLocaleString()}\n`;
    });

    message += `\n*Total: $${total.toLocaleString()}*`;

    const phone = '5491161747070';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  }
};
