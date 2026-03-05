'use client';

import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Productos', value: '24', icon: Package, change: '+3 esta semana' },
  { label: 'Pedidos', value: '156', icon: ShoppingCart, change: '+12 esta semana' },
  { label: 'Ingresos', value: '$12.5M', icon: DollarSign, change: '+18% vs mes anterior' },
  { label: 'Visitas', value: '3,240', icon: TrendingUp, change: '+25% esta semana' }
];

const recentOrders = [
  { id: '1', customer: 'Juan Pérez', items: 2, total: 130000, status: 'pending', date: '2024-01-15' },
  { id: '2', customer: 'María García', items: 1, total: 85000, status: 'confirmed', date: '2024-01-15' },
  { id: '3', customer: 'Carlos López', items: 3, total: 195000, status: 'shipped', date: '2024-01-14' },
  { id: '4', customer: 'Ana Martínez', items: 1, total: 45000, status: 'delivered', date: '2024-01-14' },
];

export default function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'confirmed': return 'bg-blue-600';
      case 'shipped': return 'bg-purple-600';
      case 'delivered': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <stat.icon className="text-red-500" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-green-500 text-sm mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Pedidos Recientes</h2>
          <Link href="/admin/orders" className="text-red-500 hover:text-red-400 text-sm">
            Ver todos →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left text-gray-400 text-sm px-6 py-4">ID</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Cliente</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Items</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Total</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Estado</th>
                <th className="text-left text-gray-400 text-sm px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-t border-zinc-800 hover:bg-zinc-800/30">
                  <td className="px-6 py-4 text-white">#{order.id}</td>
                  <td className="px-6 py-4 text-white">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-400">{order.items}</td>
                  <td className="px-6 py-4 text-white">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
