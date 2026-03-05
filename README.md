# Undroba Co. - Tienda Streetwear

Tienda de ropa urbana/streetwear construida con Next.js 14, Tailwind CSS y Framer Motion.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## ⚙️ Configuración

### 1. Variables de entorno

Crea un archivo `.env.local` basado en `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
```

### 2. Supabase (Base de datos)

Crea un proyecto en [Supabase](https://supabase.com) y ejecuta:

```sql
-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. Deploy a Vercel

```bash
npm i -g vercel
vercel
```

## 📁 Estructura

```
/src
  /app
    /page.tsx          - Home
    /shop/page.tsx     - Catálogo
    /product/[id]      - Detalle producto
    /login             - Login admin
    /admin             - Panel admin
      /products        - CRUD productos
  /components          - Componentes reutilizables
  /context             - Contextos (carrito)
  /types               - TypeScript types
```

## 🎨 Características

- ✅ Diseño minimalista (negro/rojo)
- ✅ Catálogo con filtros
- ✅ Carrito persistente
- ✅ Pedidos por WhatsApp
- ✅ Panel admin completo
- ✅ CRUD de productos
- ✅ Animaciones con Framer Motion
- ✅ Responsive design

## 🔑 Credenciales Admin

- **Email:** admin@undroba.com
- **Contraseña:** undroba2024

## 📱 WhatsApp

Cambia el número en `.env.local` para recibir pedidos en tu WhatsApp.
