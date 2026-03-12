const AdminEditar = {
  productId: null,
  product: null,
  tempImages: [],

  async init() {
    this.checkAuth();
    this.setupMobileMenu();
    this.setupLogout();
    this.setupForm();
    this.setupImageUpload();
    this.setupVariants();
    await this.loadProduct();
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

  setupForm() {
    const form = document.getElementById('productForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.updateProduct();
      });
    }
  },

  setupImageUpload() {
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
  },

  setupVariants() {
    const addBtn = document.getElementById('addColorBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addColorVariant());
    }
  },

  async loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get('id');
    
    if (!this.productId) {
      window.location.href = 'productos.html';
      return;
    }

    const { data: product, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', this.productId)
      .single();

    if (error || !product) {
      window.location.href = 'productos.html';
      return;
    }

    const { data: variantes } = await supabase
      .from('producto_variantes')
      .select('*')
      .eq('producto_id', this.productId);

    this.product = product;
    this.product.variantes = variantes || [];

    document.getElementById('productName').value = product.nombre;
    document.getElementById('productPrice').value = product.precio_base;
    document.getElementById('productDesc').value = product.descripcion || '';
    document.getElementById('productCategoria').value = product.categoria;
    document.getElementById('productGenero').value = product.genero;

    this.tempImages = [...(product.imagenes || [])];
    this.renderImagePreview();
    this.renderVariants();
  },

  renderImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = this.tempImages.map((url, index) => `
      <div class="image-preview-item">
        <img src="${url}" alt="Preview">
        <button class="image-preview-remove" data-index="${index}">&times;</button>
      </div>
    `).join('');

    preview.querySelectorAll('.image-preview-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        this.tempImages.splice(index, 1);
        this.renderImagePreview();
      });
    });
  },

  renderVariants() {
    const container = document.getElementById('variantsContainer');
    const colors = [...new Set(this.product.variantes.map(v => v.color))];
    
    container.innerHTML = colors.map((color, colorIndex) => {
      const colorVariant = this.product.variantes.find(v => v.color === color);
      return `
        <div class="variant-color" data-color-index="${colorIndex}">
          <div class="variant-color-header">
            <input type="color" class="color-input" value="${colorVariant?.color_hex || '#000000'}">
            <input type="text" class="color-name-input" placeholder="Nombre del color" value="${color}">
          </div>
          <div class="variant-tallas">
            <div class="variant-tallas-grid">
              ${['S', 'M', 'L', 'XL'].map(t => {
                const v = this.product.variantes.find(v => v.color === color && v.talla === t);
                return `<div class="variant-talla"><span>${t}</span><input type="number" placeholder="0" min="0" data-talla="${t}" value="${v?.stock || 0}"></div>`;
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
        <input type="color" class="color-input" value="#000000">
        <input type="text" class="color-name-input" placeholder="Nombre del color">
      </div>
      <div class="variant-tallas">
        <div class="variant-tallas-grid">
          <div class="variant-talla"><span>S</span><input type="number" placeholder="0" min="0" data-talla="S"></div>
          <div class="variant-talla"><span>M</span><input type="number" placeholder="0" min="0" data-talla="M"></div>
          <div class="variant-talla"><span>L</span><input type="number" placeholder="0" min="0" data-talla="L"></div>
          <div class="variant-talla"><span>XL</span><input type="number" placeholder="0" min="0" data-talla="XL"></div>
        </div>
      </div>
    `;
    
    container.appendChild(div);
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
        div.remove();
      }
    }
  },

  async updateProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const desc = document.getElementById('productDesc').value;
    const categoria = document.getElementById('productCategoria').value;
    const genero = document.getElementById('productGenero').value;

    if (!name || !price || !categoria || !genero) {
      alert('Por favor completa todos los campos');
      return;
    }

    let imagenes = this.tempImages.filter(img => typeof img === 'string');

    const newImages = this.tempImages.filter(img => img.file && !img.url);
    if (newImages.length > 0) {
      const uploadedUrls = await ImageUtils.uploadMultiple(
        newImages.map(img => img.file),
        this.productId
      );
      imagenes.push(...uploadedUrls);
    }

    const productData = {
      nombre: name,
      descripcion: desc,
      categoria,
      genero,
      precio_base: price,
      imagenes
    };

    await supabase.from('productos').update(productData).eq('id', this.productId);

    await supabase.from('producto_variantes').delete().eq('producto_id', this.productId);

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
            producto_id: this.productId,
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

    alert('Producto actualizado');
    window.location.href = 'productos.html';
  }
};
