const ImageUtils = {
  async compressImage(file, maxSize = 1200) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', {
                type: 'image/webp'
              });
              resolve(webpFile);
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          }, 'image/webp', 0.85);
        };
        img.onerror = () => reject(new Error('Error al cargar imagen'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsDataURL(file);
    });
  },

  async uploadMultiple(files, productoId, onProgress) {
    const urls = [];
    
    for (let i = 0; i < files.length; i++) {
      if (onProgress) onProgress(i + 1, files.length);
      
      try {
        const compressed = await this.compressImage(files[i]);
        const url = await uploadImage(compressed, productoId);
        urls.push(url);
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
      }
    }
    
    return urls;
  },

  previewImages(files, container) {
    container.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'image-preview-item';
        div.innerHTML = `
          <img src="${e.target.result}" alt="Preview">
          <button class="image-preview-remove" data-index="${index}">&times;</button>
        `;
        container.appendChild(div);
        
        div.querySelector('.image-preview-remove').addEventListener('click', () => {
          const dt = new DataTransfer();
          Array.from(files).forEach((f, i) => {
            if (i !== index) dt.items.add(f);
          });
          const newInput = container.closest('.image-upload-area').querySelector('.image-upload-input');
          newInput.files = dt.files;
          this.previewImages(newInput.files, container);
        });
      };
      reader.readAsDataURL(file);
    });
  }
};
