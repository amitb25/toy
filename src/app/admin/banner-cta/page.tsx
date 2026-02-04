'use client'

import { Plus, Edit2, Trash2, X, Eye, EyeOff, Megaphone } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'

interface BannerCTA {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image: string
  buttonText: string
  buttonLink: string
  active: boolean
  order: number
}

export default function BannerCTAAdmin() {
  const [banners, setBanners] = useState<BannerCTA[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerCTA | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '',
    active: true,
    order: 0
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banner-cta')
      const data = await res.json()
      if (Array.isArray(data)) setBanners(data)
    } catch (error) {
      console.error('Failed to fetch banner CTAs:', error)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingBanner(null)
    setFormData({ title: '', subtitle: '', description: '', image: '', buttonText: 'Shop Now', buttonLink: '', active: true, order: banners.length })
    setShowModal(true)
  }

  const openEditModal = (banner: BannerCTA) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
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
        response = await fetch(`/api/banner-cta/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        response = await fetch('/api/banner-cta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to save banner CTA')
        return
      }

      toast.success(editingBanner ? 'Banner CTA updated!' : 'Banner CTA added!')
      setShowModal(false)
      fetchBanners()
    } catch (error) {
      toast.error('Network error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner CTA?')) return
    try {
      const response = await fetch(`/api/banner-cta/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        toast.error('Failed to delete')
        return
      }
      toast.success('Deleted!')
      fetchBanners()
    } catch (error) {
      toast.error('Network error')
    }
  }

  const toggleActive = async (banner: BannerCTA) => {
    try {
      const response = await fetch(`/api/banner-cta/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, active: !banner.active })
      })
      if (!response.ok) {
        toast.error('Failed to update')
        return
      }
      toast.success(`${!banner.active ? 'Activated' : 'Deactivated'}!`)
      fetchBanners()
    } catch (error) {
      toast.error('Network error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Banner CTA</h1>
          <p className="text-text-muted text-sm mt-1">Full-width promotional banners (image only, no text overlay)</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#710014] to-[#9a001f] px-5 py-3 font-bold text-white text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#710014]/30 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Add CTA Banner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <p className="text-3xl font-black text-text-primary">{banners.length}</p>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">Total CTAs</p>
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
          <p className="text-text-muted">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-bg-card border border-border rounded-2xl overflow-hidden group hover:border-accent/30 transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-80 h-48 md:h-auto bg-bg-input flex-shrink-0">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Megaphone size={40} className="text-text-muted/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{banner.title}</h3>
                      {banner.subtitle && <p className="text-sm text-text-secondary mt-1">{banner.subtitle}</p>}
                      {banner.description && <p className="text-xs text-text-muted mt-2 line-clamp-2">{banner.description}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${banner.active ? 'bg-green-500/15 text-green-600' : 'bg-red-500/15 text-red-600'}`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex-1">
                      <span className="text-[10px] text-text-muted uppercase">Button:</span>
                      <span className="ml-2 text-sm font-bold text-accent">{banner.buttonText}</span>
                      <span className="ml-2 text-xs text-text-muted">-&gt; {banner.buttonLink}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toggleActive(banner)} className="p-2.5 rounded-xl text-text-muted hover:text-accent hover:bg-accent/10 transition-all">
                        {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => openEditModal(banner)} className="p-2.5 rounded-xl text-text-muted hover:text-accent hover:bg-accent/10 transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="p-2.5 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="py-20 text-center bg-bg-card border border-border rounded-2xl">
              <Megaphone size={56} className="mx-auto text-text-muted/50 mb-4" />
              <p className="text-text-muted">No CTA banners found. Add your first one!</p>
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
                {editingBanner ? 'Edit CTA Banner' : 'Add CTA Banner'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-accent/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Title (for admin reference)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                  placeholder="CTA title"
                  required
                />
              </div>

              <ImageUpload
                label="Full Width Banner Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                aspectRatio="banner"
              />

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Link URL (where to redirect on click)</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                  placeholder="/category/deals"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-2 border-border bg-bg-input text-green-500"
                />
                <span className="text-sm font-bold text-text-secondary">Active</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3.5 bg-bg-input border border-border rounded-xl font-bold text-text-secondary hover:border-accent/50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3.5 bg-gradient-to-r from-[#710014] to-[#9a001f] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#710014]/30 transition-all">
                  {editingBanner ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
