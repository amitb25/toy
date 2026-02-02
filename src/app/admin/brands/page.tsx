'use client'

import { Plus, MoreVertical, CheckCircle2, X, Pencil, Trash2, Award, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Brand {
  id: string
  name: string
  logo: string | null
  type: 'OWN' | 'THIRD_PARTY'
  status: boolean
  _count?: { products: number }
}

export default function BrandsAdmin() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({ name: '', type: 'THIRD_PARTY', logo: '', status: true })
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands')
      const data = await res.json()
      if (Array.isArray(data)) setBrands(data)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingBrand(null)
    setFormData({ name: '', type: 'THIRD_PARTY', logo: '', status: true })
    setShowModal(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({ name: brand.name, type: brand.type, logo: brand.logo || '', status: brand.status })
    setShowModal(true)
    setActiveMenu(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBrand) {
        await fetch(`/api/brands/${editingBrand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      setShowModal(false)
      fetchBrands()
    } catch (error) {
      console.error('Failed to save brand:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return
    try {
      await fetch(`/api/brands/${id}`, { method: 'DELETE' })
      fetchBrands()
    } catch (error) {
      console.error('Failed to delete brand:', error)
    }
    setActiveMenu(null)
  }

  const toggleStatus = async (brand: Brand) => {
    try {
      await fetch(`/api/brands/${brand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, status: !brand.status })
      })
      fetchBrands()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
    setActiveMenu(null)
  }

  const ownBrands = brands.filter(b => b.type === 'OWN')
  const thirdPartyBrands = brands.filter(b => b.type === 'THIRD_PARTY')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Brand Management</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your own and third-party partner brands.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#e23636] px-4 py-3 font-bold text-white text-sm uppercase tracking-wider hover:bg-white hover:text-[#e23636] transition-all"
        >
          <Plus size={18} /> Add Brand
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#151515] border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Award className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{ownBrands.length}</p>
              <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Exclusive Brands</p>
            </div>
          </div>
        </div>
        <div className="bg-[#151515] border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Star className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{thirdPartyBrands.length}</p>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Partner Brands</p>
            </div>
          </div>
        </div>
        <div className="bg-[#151515] border border-[#e23636]/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#e23636]/20 p-3 rounded-lg">
              <CheckCircle2 className="text-[#e23636]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{brands.length}</p>
              <p className="text-[10px] font-bold text-[#e23636] uppercase tracking-wider">Total Brands</p>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Table */}
      <div className="overflow-x-auto bg-[#151515] border border-white/5 rounded-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#e23636] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading brands...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="p-12 text-center">
            <Award size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">No brands found. Add your first brand!</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
              <tr>
                <th className="px-4 md:px-6 py-4">Brand Name</th>
                <th className="px-4 md:px-6 py-4">Type</th>
                <th className="px-4 md:px-6 py-4">Products</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                        brand.type === 'OWN'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {brand.type === 'OWN' ? <Award size={18} /> : brand.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    {brand.type === 'OWN' ? (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-[10px] font-bold text-yellow-500 uppercase">
                        <Award size={12} /> Exclusive
                      </span>
                    ) : (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400 uppercase">
                        <Star size={12} /> Partner
                      </span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-400">{brand._count?.products || 0} Items</td>
                  <td className="px-4 md:px-6 py-4">
                    <button
                      onClick={() => toggleStatus(brand)}
                      className={`flex items-center gap-1.5 text-sm font-medium ${brand.status ? 'text-green-500' : 'text-red-500'}`}
                    >
                      <div className={`h-2 w-2 rounded-full ${brand.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {brand.status ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === brand.id ? null : brand.id)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenu === brand.id && (
                      <div className="absolute right-6 top-12 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-red-500 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#151515] border border-white/10 rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Brand Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#e23636] focus:outline-none transition-colors"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Brand Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'OWN' })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      formData.type === 'OWN'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Award className={`mx-auto mb-2 ${formData.type === 'OWN' ? 'text-yellow-500' : 'text-gray-500'}`} size={24} />
                    <p className={`font-bold text-sm ${formData.type === 'OWN' ? 'text-yellow-500' : 'text-gray-400'}`}>Exclusive</p>
                    <p className="text-[10px] text-gray-500">Own Brand</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'THIRD_PARTY' })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      formData.type === 'THIRD_PARTY'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Star className={`mx-auto mb-2 ${formData.type === 'THIRD_PARTY' ? 'text-blue-500' : 'text-gray-500'}`} size={24} />
                    <p className={`font-bold text-sm ${formData.type === 'THIRD_PARTY' ? 'text-blue-500' : 'text-gray-400'}`}>Partner</p>
                    <p className="text-[10px] text-gray-500">Third Party</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Logo URL (Optional)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#e23636] focus:outline-none transition-colors"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 bg-transparent text-[#e23636] focus:ring-[#e23636]"
                />
                <label htmlFor="status" className="text-sm font-bold text-gray-400">Active (visible on store)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg font-bold text-gray-400 hover:border-white/30 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#e23636] text-white rounded-lg font-bold hover:bg-white hover:text-[#e23636] transition-all"
                >
                  {editingBrand ? 'Update Brand' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
