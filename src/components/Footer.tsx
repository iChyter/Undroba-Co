import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-red-900/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-1 text-2xl font-bold">
              <span className="text-white">Undroba</span>
              <span className="text-red-500">Co.</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Streetwear urbano para quienes definen su propio estilo.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces</h3>
            <div className="space-y-2">
              <Link href="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Tienda
              </Link>
              <Link href="/shop?category=hoodies" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Hoodies
              </Link>
              <Link href="/shop?category=camisetas" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Camisetas
              </Link>
              <Link href="/shop?category=pants" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Pants
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <p className="text-gray-400 text-sm">
              ¿Tienes dudas? Escríbenos por WhatsApp
            </p>
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Chatear por WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-red-900/30 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Undroba Co. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
