const Admin = {
  currentSection: 'dashboard',
  editingProduct: null,
  tempImages: [],

  async init() {
    this.setupEventListeners();
    this.loadStats();
    await this.loadProductList();
    
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  },

  logout() {
    localStorage.removeItem('sb-session');
    Auth.signOut();
    window.location.href = 'login.html';
  },

  async loadProductList() {
    const section = document.getElementById('section-productos');
    if (section) {
      section.innerHTML = await this.renderProductList();
    }
  },

  setupEventListeners() {
    return `
      <h2 class="admin-section-title">Dashboard</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="stat-productos">0</div>
          <div class="stat-label">Productos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="stat-stock-bajo">0</div>
          <div class="stat-label">Stock Bajo</div>
        </div>
      </div>
    `;
  },

  async loadStats() {
    const { data: products } = await supabase.from('productos').select('id');
    const { data: variantes } = await supabase.from('producto_variantes').select('stock');
    
    const productosActivos = products?.length || 0;
    const stockBajo = variantes?.filter(v => v.stock > 0 && v.stock <= 3).length || 0;

    document.getElementById('stat-productos').textContent = productosActivos;
    document.getElementById('stat-stock-bajo').textContent = stockBajo;
  },

  async renderProductList() {
    const { data: products } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    return `
      <h2 class="admin-section-title">Productos</h2>
      <div class="products-list">
        ${products?.map(p => `
          <div class="product-list-item">
            <img class="product-list-image" src="${p.imagenes?.[0] || ''}" alt="${p.nombre}">
            <div class="product-list-info">
              <h4 class="product-list-name">${p.nombre}</h4>
              <p class="product-list-meta">${p.categoria} · ${p.genero} · $${p.precio_base}</p>
            </div>
            <div class="product-list-actions">
              <button class="btn-edit" onclick="Admin.editProduct('${p.id}')">Editar</button>
              <button class="btn-delete" onclick="Admin.deleteProduct('${p.id}')">Eliminar</button>
            </div>
          </div>
        `).join('') || '<p>No hay productos</p>'}
      </div>
    `;
  },

  renderProductForm(product = null) {
    this.editingProduct = product;
    this.tempImages = product?.imagenes ? [...product.imagenes] : [];

    return `
      <h2 class="admin-section-title">${product ? 'Editar' : 'Nuevo'} Producto</h2>
      <form class="admin-form" id="productForm">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" id="productName" value="${product?.nombre || ''}" required>
          </div>
          <div class="form-group">
            <label>Precio Base</label>
            <input type="number" id="productPrice" value="${product?.precio_base || ''}" required min="0">
          </div>
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea id="productDesc">${product?.descripcion || ''}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Categoría</label>
            <select id="productCategoria" required>
              <option value="">Seleccionar...</option>
              <option value="sueter" ${product?.categoria === 'sueter' ? 'selected' : ''}>Suéter</option>
              <option value="sudadera" ${product?.categoria === 'sudadera' ? 'selected' : ''}>Sudadera</option>
              <option value="camiseta" ${product?.categoria === 'camiseta' ? 'selected' : ''}>Camiseta</option>
              <option value="pantalon" ${product?.categoria === 'pantalon' ? 'selected' : ''}>Pantalón</option>
              <option value="short" ${product?.categoria === 'short' ? 'selected' : ''}>Short</option>
              <option value="zapatos" ${product?.categoria === 'zapatos' ? 'selected' : ''}>Zapatos</option>
            </select>
          </div>
          <div class="form-group">
            <label>Género</label>
            <select id="productGenero" required>
              <option value="">Seleccionar...</option>
              <option value="hombre" ${product?.genero === 'hombre' ? 'selected' : ''}>Hombre</option>
              <option value="mujer" ${product?.genero === 'mujer' ? 'selected' : ''}>Mujer</option>
              <option value="unisex" ${product?.genero === 'unisex' ? 'selected' : ''}>Unisex</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Imágenes</label>
          <div class="image-upload-area" id="imageUploadArea">
            <input type="file" class="image-upload-input" id="imageInput" accept="image/*" multiple>
            <div class="image-upload-icon">📷</div>
            <p class="image-upload-text">Click o arrastra imágenes aquí<br>Se convertirán a WebP automáticamente</p>
          </div>
          <div class="image-preview-grid" id="imagePreview"></div>
        </div>

        <div class="variants-section">
          <h4 class="variants-title">Colores y Tallas (Stock)</h4>
          <div id="variantsContainer">
            ${this.renderVariants(product?.variantes || [])}
          </div>
          <button type="button" class="btn-add-color" onclick="Admin.addColorVariant()">
            + Agregar Color
          </button>
        </div>

        <button type="submit" class="btn-add-variant">
          ${product ? 'Actualizar' : 'Crear'} Producto
        </button>
      </form>
    `;
  },

  renderVariants(variants = []) {
    if (variants.length === 0) {
      return `
        <div class="variant-color" data-color-index="0">
          <div class="variant-color-header">
            <input type="color" class="color-input" value="#000000" onchange="Admin.updateColorHex(this)">
            <input type="text" class="color-name-input" placeholder="Nombre del color" value="Negro">
          </div>
          <div class="variant-tallas">
            <div class="variant-tallas-grid">
              ${['S', 'M', 'L', 'XL'].map(t => `
                <div class="variant-talla">
                  <span>${t}</span>
                  <input type="number" placeholder="0" min="0" data-talla="${t}">
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    const colors = [...new Set(variants.map(v => v.color))];
    
    return colors.map((color, colorIndex) => {
      const colorVariant = variants.find(v => v.color === color);
      return `
        <div class="variant-color" data-color-index="${colorIndex}">
          <div class="variant-color-header">
            <input type="color" class="color-input" value="${colorVariant?.color_hex || '#000000'}" onchange="Admin.updateColorHex(this)">
            <input type="text" class="color-name-input" placeholder="Nombre del color" value="${color}">
          </div>
          <div class="variant-tallas">
            <div class="variant-tallas-grid">
              ${['S', 'M', 'L', 'XL'].map(t => {
                const v = variants.find(v => v.color === color && v.talla === t);
                return `
                  <div class="variant-talla">
                    <span>${t}</span>
                    <input type="number" placeholder="0" min="0" data-talla="${t}" value="${v?.stock || 0}">
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  addColorVariant() {
    const container = document.getElementById('variantsContainer');
    const index = container.children.length;
    
    const div = document.createElement('div');
    div.className = 'variant-color';
    div.dataset.colorIndex = index;
    div.innerHTML = `
      <div class="variant-color-header">
        <input type="color" class="color-input" value="#000000" onchange="Admin.updateColorHex(this)">
        <input type="text" class="color-name-input" placeholder="Nombre del color">
      </div>
      <div class="variant-tallas">
        <div class="variant-tallas-grid">
          ${['S', 'M', 'L', 'XL'].map(t => `
            <div class="variant-talla">
              <span>${t}</span>
              <input type="number" placeholder="0" min="0" data-talla="${t}">
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    container.appendChild(div);
  },

  updateColorHex(input) {
    // Auto updates as user picks color
  },

  setupEventListeners() {
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${btn.dataset.section}`).classList.add('active');

        this.currentSection = btn.dataset.section;
        
        if (btn.dataset.section === 'dashboard') {
          this.loadStats();
        }
      });
    });

    const imageArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');
    
    if (imageArea && imageInput) {
      imageArea.addEventListener('click', () => imageInput.click());
      
      imageArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageArea.classList.add('dragover');
      });
      
      imageArea.addEventListener('dragleave', () => {
        imageArea.classList.remove('dragover');
      });
      
      imageArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageArea.classList.remove('dragover');
        imageInput.files = e.dataTransfer.files;
        this.handleImageUpload();
      });
      
      imageInput.addEventListener('change', () => this.handleImageUpload());
    }

    const form = document.getElementById('productForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProduct();
      });
    }

    if (this.currentSection === 'dashboard') {
      this.loadStats();
    }
  },

  async handleImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('imagePreview');
    
    if (!imageInput || !preview) return;

    const files = imageInput.files;
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      const div = document.createElement('div');
      div.className = 'image-preview-item';
      div.innerHTML = `
        <img src="" alt="Preview">
        <div class="image-compressing">Comprimiendo...</div>
      `;
      preview.appendChild(div);

      try {
        const compressed = await ImageUtils.compressImage(files[i]);
        const reader = new FileReader();
        reader.onload = (e) => {
          div.querySelector('img').src = e.target.result;
          div.querySelector('.image-compressing').remove();
          this.tempImages.push({ file: compressed, dataUrl: e.target.result });
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error('Error compressing:', error);
        div.remove();
      }
    }
  },

  async saveProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const desc = document.getElementById('productDesc').value;
    const categoria = document.getElementById('productCategoria').value;
    const genero = document.getElementById('productGenero').value;

    if (!name || !price || !categoria || !genero) {
      App.showToast('Por favor completa todos los campos', 'error');
      return;
    }

    let imagenes = [...(this.editingProduct?.imagenes || [])];
    
    const newImages = this.tempImages.filter(img => img.file && !img.url);
    if (newImages.length > 0) {
      const productoId = this.editingProduct?.id || crypto.randomUUID();
      const uploadedUrls = await ImageUtils.uploadMultiple(
        newImages.map(img => img.file),
        productoId
      );
      imagenes = [...imagenes, ...uploadedUrls];
    }

    const productData = {
      nombre: name,
      descripcion: desc,
      categoria,
      genero,
      precio_base: price,
      imagenes,
      activo: true
    };

    let productId;
    
    if (this.editingProduct) {
      const { error } = await supabase
        .from('productos')
        .update(productData)
        .eq('id', this.editingProduct.id);
      
      if (error) {
        App.showToast('Error al actualizar producto', 'error');
        return;
      }
      productId = this.editingProduct.id;
    } else {
      const { data, error } = await supabase
        .from('productos')
        .insert(productData)
        .select()
        .single();
      
      if (error) {
        App.showToast('Error al crear producto', 'error');
        return;
      }
      productId = data.id;
    }

    await supabase
      .from('producto_variantes')
      .delete()
      .eq('producto_id', productId);

    const variantColors = document.querySelectorAll('.variant-color');
    const variantes = [];

    variantColors.forEach(colorDiv => {
      const colorName = colorDiv.querySelector('.color-name-input').value;
      const colorHex = colorDiv.querySelector('.color-input').value;
      
      const tallaInputs = colorDiv.querySelectorAll('.variant-talla input');
      tallaInputs.forEach(input => {
        const talla = input.dataset.talla;
        const stock = parseInt(input.value) || 0;
        
        if (colorName && stock > 0) {
          variantes.push({
            producto_id: productId,
            color: colorName,
            color_hex: colorHex,
            talla,
            stock
          });
        }
      });
    });

    if (variantes.length > 0) {
      await supabase.from('producto_variantes').insert(variantes);
    }

    App.showToast(this.editingProduct ? 'Producto actualizado' : 'Producto creado', 'success');
    this.render(document.getElementById('main'));
  },

  async editProduct(id) {
    const { data: product } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (!product) return;

    const { data: variantes } = await supabase
      .from('producto_variantes')
      .select('*')
      .eq('producto_id', id);

    product.variantes = variantes || [];

    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="nuevo"]').classList.add('active');
    
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-nuevo').classList.add('active');

    document.getElementById('section-nuevo').innerHTML = this.renderProductForm(product);
    this.setupEventListeners();
  },

  async deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      App.showToast('Error al eliminar producto', 'error');
      return;
    }

    App.showToast('Producto eliminado', 'success');
    this.renderProductList().then(html => {
      document.getElementById('section-productos').innerHTML = html;
    });
  }
};
