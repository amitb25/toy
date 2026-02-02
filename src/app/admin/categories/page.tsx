'use client'

import { Plus, Edit2, Trash2, LayoutGrid } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Category Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and organize product categories for your store.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-[#e23636] px-4 py-3 font-bold text-white text-sm uppercase tracking-wider hover:bg-white hover:text-[#e23636] transition-all">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#e23636] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#151515] border border-white/5 rounded-xl p-5 md:p-6 transition-all hover:border-[#e23636]/30 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#e23636]/10 flex items-center justify-center text-[#e23636]">
                  <LayoutGrid size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-500 hover:text-[#e23636] transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">/{cat.slug}</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">{cat._count?.products || 0} Products</span>
                <span className="rounded-full bg-green-500/20 text-green-400 px-3 py-1 text-[10px] font-bold uppercase">
                  Active
                </span>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <LayoutGrid size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500">No categories found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
