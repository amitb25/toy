import { TrendingUp, ShoppingCart, AlertTriangle, IndianRupee, Package, Truck, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '₹4,52,000', icon: IndianRupee, change: '+12%' },
    { label: 'Orders Today', value: '24', icon: ShoppingCart, change: '+8%' },
    { label: 'Pending Orders', value: '8', icon: TrendingUp, change: '-5%' },
    { label: 'Low Stock', value: '3', icon: AlertTriangle, change: '+2' },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#151515] border border-white/5 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#e23636]/10 flex items-center justify-center text-[#e23636]">
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-lg md:text-2xl font-black text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-[#151515] border border-white/5 rounded-xl p-4 md:p-6">
          <h2 className="font-black text-white uppercase tracking-tight border-b border-white/5 pb-4 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[
              { id: 'AHQ-1001', items: 2, amount: '₹2,499', status: 'Processing' },
              { id: 'AHQ-1002', items: 1, amount: '₹1,299', status: 'Shipped' },
              { id: 'AHQ-1003', items: 3, amount: '₹4,799', status: 'Delivered' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e23636]/10 flex items-center justify-center">
                    <Package size={18} className="text-[#e23636]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{order.items} Items • {order.amount}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                  order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'Shipped' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-[#151515] border border-white/5 rounded-xl p-4 md:p-6">
          <h2 className="font-black text-white uppercase tracking-tight border-b border-white/5 pb-4 mb-4">Inventory Alerts</h2>
          <div className="space-y-4">
            {[
              { name: 'Iron Man Mark 85', stock: 2 },
              { name: 'Thor Mjolnir Replica', stock: 3 },
              { name: 'Black Panther Mask', stock: 1 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-red-500 font-medium">Only {item.stock} left in stock</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-[#e23636] hover:text-white transition-colors">
                  Add Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
