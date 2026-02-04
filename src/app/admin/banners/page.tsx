'use client'

import { Plus, Edit2, Trash2, Image as ImageIcon, X, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
  active: boolean
  order: number
}

export default function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    active: true,
    order: 0
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners?all=true')
      const data = await res.json()
      if (Array.isArray(data)) setBanners(data)
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingBanner(null)
    setFormData({ title: '', subtitle: '', image: '', link: '', active: true, order: banners.length })
    setShowModal(true)
  }

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      active: banner.active,
      order: banner.order
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let response
      if (editingBanner) {
        response = await fetch(`/api/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        response = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to save banner')
        return
      }

      toast.success(editingBanner ? 'Banner updated successfully!' : 'Banner added successfully!')
      setShowModal(false)
      fetchBanners()
    } catch (error) {
      console.error('Failed to save banner:', error)
      toast.error('Network error: Failed to save banner')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    try {
      const response = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to delete banner')
        return
      }
      toast.success('Banner deleted successfully!')
      fetchBanners()
    } catch (error) {
      console.error('Failed to delete banner:', error)
      toast.error('Network error: Failed to delete banner')
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, active: !banner.active })
      })
      if (!response.ok) {
        toast.error('Failed to update banner status')
        return
      }
      toast.success(`Banner ${!banner.active ? 'activated' : 'deactivated'}!`)
      fetchBanners()
    } catch (error) {
      toast.error('Network error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Hero Banners</h1>
          <p className="text-text-muted text-sm mt-1">Manage homepage hero slider banners</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#710014] to-[#9a001f] px-5 py-3 font-bold text-white text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#710014]/30 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <p className="text-3xl font-black text-text-primary">{banners.length}</p>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">Total Banners</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-green-500">{banners.filter(b => b.active).length}</p>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-red-500">{banners.filter(b => !b.active).length}</p>
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">Inactive</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Loading banners...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-bg-card border border-border rounded-2xl overflow-hidden group hover:border-accent/30 transition-all">
              <div className="relative h-40 bg-bg-input">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={40} className="text-text-muted/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg truncate">{banner.title}</h3>
                  {banner.subtitle && <p className="text-white/70 text-xs truncate">{banner.subtitle}</p>}
                </div>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleActive(banner)} className="p-2 bg-black/50 rounded-lg text-white hover:bg-accent transition-all">
                    {banner.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEditModal(banner)} className="p-2 bg-black/50 rounded-lg text-white hover:bg-accent transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="p-2 bg-black/50 rounded-lg text-white hover:bg-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-xs text-text-muted">Order: {banner.order}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${banner.active ? 'bg-green-500/15 text-green-600' : 'bg-red-500/15 text-red-600'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full py-20 text-center bg-bg-card border border-border rounded-2xl">
              <ImageIcon size={56} className="mx-auto text-text-muted/50 mb-4" />
              <p className="text-text-muted">No banners found. Add your first banner!</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-lg p-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-accent/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                  placeholder="Banner title"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                  placeholder="Banner subtitle (optional)"
                />
              </div>

              <ImageUpload
                label="Banner Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                aspectRatio="banner"
              />

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Button Link</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                  placeholder="/category/all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary focus:border-accent focus:outline-none"
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 rounded-lg border-2 border-border bg-bg-input text-green-500"
                    />
                    <span className="text-sm font-bold text-text-secondary">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3.5 bg-bg-input border border-border rounded-xl font-bold text-text-secondary hover:border-accent/50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3.5 bg-gradient-to-r from-[#710014] to-[#9a001f] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#710014]/30 transition-all">
                  {editingBanner ? 'Update' : 'Add'} Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
