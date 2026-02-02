'use client'

import { Plus, Search, Filter, MoreVertical, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory, pricing, and product details.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-[#e23636] px-4 py-3 font-bold text-white text-sm uppercase tracking-wider hover:bg-white hover:text-[#e23636] transition-all">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#151515] border border-white/5 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#e23636] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 hover:border-white/30 hover:text-white transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#e23636] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#151515] border border-white/5 rounded-xl">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-4 md:px-6 py-4 text-center w-16">Image</th>
                <th className="px-4 md:px-6 py-4">Product</th>
                <th className="px-4 md:px-6 py-4">Category</th>
                <th className="px-4 md:px-6 py-4">Price</th>
                <th className="px-4 md:px-6 py-4">Stock</th>
                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.slice(0, 10).map((product) => {
                const images = product.images ? JSON.parse(product.images) : []
                return (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 md:px-6 py-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
                        {images[0] ? (
                          <img src={images[0]} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon size={18} className="text-gray-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-bold text-white text-sm leading-tight">{product.name}</p>
                      <p className="text-xs text-[#e23636] font-medium">{product.brand?.name}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-400">{product.category?.name || '-'}</td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-bold text-white">₹{product.price - product.discount}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-2">₹{product.price}</span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        product.stock > 10 ? 'bg-green-500/20 text-green-400' :
                        product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {product.stock} left
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:text-[#e23636] transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
