import { Search, Mail, Phone, MoreVertical, User } from 'lucide-react'

export default function CustomersAdmin() {
  const customers = [
    { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', orders: 5, joined: 'Oct 2026' },
    { id: '2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 87654 32109', orders: 2, joined: 'Nov 2026' },
    { id: '3', name: 'Suresh Raina', email: 'suresh@example.com', phone: '+91 76543 21098', orders: 12, joined: 'Jan 2026' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage your registered customers and their order history.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search customers by name, email..."
          className="w-full bg-[#151515] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#e23636] focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto bg-[#151515] border border-white/5 rounded-xl">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
            <tr>
              <th className="px-4 md:px-6 py-4">Customer</th>
              <th className="px-4 md:px-6 py-4">Contact Info</th>
              <th className="px-4 md:px-6 py-4 text-center">Orders</th>
              <th className="px-4 md:px-6 py-4">Joined</th>
              <th className="px-4 md:px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#e23636]/10 flex items-center justify-center text-[#e23636] font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-bold text-white text-sm">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Mail size={12} className="text-gray-500" /> {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Phone size={12} className="text-gray-500" /> {user.phone}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] h-8 rounded-full bg-[#e23636]/10 text-[#e23636] text-sm font-bold">
                    {user.orders}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreVertical size={18} />
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
