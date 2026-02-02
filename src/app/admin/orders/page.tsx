import { Eye, Search, Download, Filter, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function OrdersAdmin() {
  const orders = [
    { id: 'AHQ-1001', customer: 'Rahul Sharma', date: 'Oct 24, 2026', amount: 2499, status: 'DELIVERED', payment: 'PAID (UPI)', items: 2 },
    { id: 'AHQ-1002', customer: 'Priya Patel', date: 'Oct 25, 2026', amount: 899, status: 'PROCESSING', payment: 'PAID (CARD)', items: 1 },
    { id: 'AHQ-1003', customer: 'Amit Kumar', date: 'Oct 25, 2026', amount: 1499, status: 'PENDING', payment: 'COD', items: 1 },
    { id: 'AHQ-1004', customer: 'Suresh Raina', date: 'Oct 25, 2026', amount: 4500, status: 'SHIPPED', payment: 'PAID (NET)', items: 4 },
  ]

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PROCESSING': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={12} />;
      case 'SHIPPED': return <Truck size={12} />;
      case 'PROCESSING': return <Package size={12} />;
      case 'PENDING': return <Clock size={12} />;
      case 'CANCELLED': return <XCircle size={12} />;
      default: return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor sales, track shipments, and manage customer fulfillment.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-[#151515] border border-white/10 px-4 py-2.5 text-sm font-bold text-gray-400 hover:border-white/30 hover:text-white transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#151515] border border-white/5 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search Order ID, Customer..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#e23636] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex rounded-lg border border-white/10 p-1 bg-[#0a0a0a]">
            {['All', 'Pending', 'Paid', 'COD'].map((tab, i) => (
              <button key={tab} className={`px-3 md:px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${i === 0 ? 'bg-[#e23636] text-white' : 'text-gray-500 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
          <button className="rounded-lg border border-white/10 bg-[#0a0a0a] p-2.5 text-gray-500 hover:border-white/30 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-[#151515] border border-white/5 rounded-xl">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
            <tr>
              <th className="px-4 md:px-6 py-4">Order ID</th>
              <th className="px-4 md:px-6 py-4">Customer</th>
              <th className="px-4 md:px-6 py-4">Status</th>
              <th className="px-4 md:px-6 py-4">Items</th>
              <th className="px-4 md:px-6 py-4">Total</th>
              <th className="px-4 md:px-6 py-4">Payment</th>
              <th className="px-4 md:px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-4 md:px-6 py-4 font-bold text-white">{order.id}</td>
                <td className="px-4 md:px-6 py-4">
                  <p className="font-medium text-white text-sm">{order.customer}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">{order.date}</p>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-400">{order.items} items</td>
                <td className="px-4 md:px-6 py-4 font-bold text-white">₹{order.amount}</td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`text-[10px] font-black ${order.payment.includes('PAID') ? 'text-green-500' : 'text-orange-500'}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-bold text-[#e23636] hover:text-white transition-colors">
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
