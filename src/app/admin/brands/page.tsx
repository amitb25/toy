'use client'

import { Plus, MoreVertical, CheckCircle2, X, Pencil, Trash2, Award, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'

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
      const res = await fetch('/api/brands?all=true')
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
      let response
      if (editingBrand) {
        response = await fetch(`/api/brands/${editingBrand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        response = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      if (!response.ok) {
        toast.error('Failed to save brand')
        return
      }

      toast.success(editingBrand ? 'Brand updated!' : 'Brand added!')
      setShowModal(false)
      fetchBrands()
    } catch (error) {
      console.error('Failed to save brand:', error)
      toast.error('Network error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return
    try {
      const response = await fetch(`/api/brands/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        toast.error('Failed to delete brand')
        return
      }
      toast.success('Brand deleted!')
      fetchBrands()
    } catch (error) {
      console.error('Failed to delete brand:', error)
      toast.error('Network error')
    }
    setActiveMenu(null)
  }

  const toggleStatus = async (brand: Brand) => {
    try {
      const response = await fetch(`/api/brands/${brand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, status: !brand.status })
      })
      if (!response.ok) {
        toast.error('Failed to update status')
        return
      }
      toast.success(`Brand ${!brand.status ? 'activated' : 'deactivated'}!`)
      fetchBrands()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Network error')
    }
    setActiveMenu(null)
  }

  const ownBrands = brands.filter(b => b.type === 'OWN')
  const thirdPartyBrands = brands.filter(b => b.type === 'THIRD_PARTY')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Brand Management</h1>
          <p className="text-text-muted text-sm mt-1">Organize your own and third-party partner brands.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#710014] to-[#9a001f] px-5 py-3 font-bold text-white text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#710014]/30 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Add Brand
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-[#B38F6F]/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#B38F6F]/20 p-3 rounded-lg">
              <Award className="text-[#B38F6F]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{ownBrands.length}</p>
              <p className="text-[10px] font-bold text-[#B38F6F] uppercase tracking-wider">Exclusive Brands</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-card border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Star className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{thirdPartyBrands.length}</p>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Partner Brands</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-card border border-[#710014]/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#710014]/20 p-3 rounded-lg">
              <CheckCircle2 className="text-[#710014]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-text-primary">{brands.length}</p>
              <p className="text-[10px] font-bold text-[#710014] uppercase tracking-wider">Total Brands</p>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Table */}
      <div className="overflow-x-auto bg-bg-card border border-border rounded-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#710014] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-muted">Loading brands...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="p-12 text-center">
            <Award size={48} className="mx-auto text-text-muted/50 mb-4" />
            <p className="text-text-muted">No brands found. Add your first brand!</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-bg-input text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
              <tr>
                <th className="px-4 md:px-6 py-4">Brand</th>
                <th className="px-4 md:px-6 py-4">Type</th>
                <th className="px-4 md:px-6 py-4">Products</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-accent/5 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold overflow-hidden ${
                        brand.type === 'OWN'
                          ? 'bg-[#B38F6F]/20 text-[#B38F6F]'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                        ) : brand.type === 'OWN' ? (
                          <Award size={18} />
                        ) : (
                          brand.name.charAt(0)
                        )}
                      </div>
                      <span className="font-bold text-text-primary">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    {brand.type === 'OWN' ? (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-[#B38F6F]/20 px-3 py-1 text-[10px] font-bold text-[#B38F6F] uppercase">
                        <Award size={12} /> Exclusive
                      </span>
                    ) : (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400 uppercase">
                        <Star size={12} /> Partner
                      </span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-text-secondary">{brand._count?.products || 0} Items</td>
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
                      className="text-text-muted hover:text-text-primary transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenu === brand.id && (
                      <div className="absolute right-6 top-12 bg-bg-card border border-border rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-accent/10 text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Brand Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Brand Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'OWN' })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      formData.type === 'OWN'
                        ? 'border-[#B38F6F] bg-[#B38F6F]/10'
                        : 'border-border hover:border-border'
                    }`}
                  >
                    <Award className={`mx-auto mb-2 ${formData.type === 'OWN' ? 'text-[#B38F6F]' : 'text-text-muted'}`} size={24} />
                    <p className={`font-bold text-sm ${formData.type === 'OWN' ? 'text-[#B38F6F]' : 'text-text-secondary'}`}>Exclusive</p>
                    <p className="text-[10px] text-text-muted">Own Brand</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'THIRD_PARTY' })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      formData.type === 'THIRD_PARTY'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-border hover:border-border'
                    }`}
                  >
                    <Star className={`mx-auto mb-2 ${formData.type === 'THIRD_PARTY' ? 'text-blue-500' : 'text-text-muted'}`} size={24} />
                    <p className={`font-bold text-sm ${formData.type === 'THIRD_PARTY' ? 'text-blue-500' : 'text-text-secondary'}`}>Partner</p>
                    <p className="text-[10px] text-text-muted">Third Party</p>
                  </button>
                </div>
              </div>

              <ImageUpload
                label="Brand Logo"
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                aspectRatio="square"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="w-5 h-5 rounded border-border bg-bg-input text-[#710014] focus:ring-[#710014]"
                />
                <label htmlFor="status" className="text-sm font-bold text-text-secondary cursor-pointer">Active (visible on store)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-bg-input border border-border rounded-lg font-bold text-text-secondary hover:border-accent/30 hover:text-text-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#710014] to-[#9a001f] text-white rounded-lg font-bold hover:shadow-lg hover:shadow-[#710014]/30 transition-all"
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
