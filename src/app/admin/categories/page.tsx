'use client'

import { Plus, Edit2, Trash2, LayoutGrid, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  enabled: boolean
  _count?: { products: number }
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', image: '', enabled: true })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (Array.isArray(data)) setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', image: '', enabled: true })
    setShowModal(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, image: category.image || '', enabled: category.enabled })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let response
      if (editingCategory) {
        response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to save category')
        return
      }

      toast.success(editingCategory ? 'Category updated successfully!' : 'Category added successfully!')
      setShowModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error('Network error: Failed to save category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to delete category')
        return
      }
      toast.success('Category deleted successfully!')
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Network error: Failed to delete category')
    }
  }

  const toggleEnabled = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, enabled: !category.enabled })
      })
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to update status')
        return
      }
      toast.success(`Category ${!category.enabled ? 'activated' : 'deactivated'} successfully!`)
      fetchCategories()
    } catch (error) {
      console.error('Failed to toggle category:', error)
      toast.error('Network error: Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Category Management</h1>
          <p className="text-text-muted text-sm mt-1">Create and organize product categories for your store.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#710014] to-[#9a001f] px-5 py-3 font-bold text-white text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#710014]/30 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-accent/5 transition-all">
          <p className="text-3xl font-black text-text-primary">{categories.length}</p>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">Total Categories</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-green-500">{categories.filter(c => c.enabled).length}</p>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-red-500">{categories.filter(c => !c.enabled).length}</p>
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">Inactive</p>
        </div>
        <div className="bg-gradient-to-br from-[#710014]/10 to-[#9a001f]/5 border border-[#710014]/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-[#710014]">{categories.reduce((acc, c) => acc + (c._count?.products || 0), 0)}</p>
          <p className="text-[10px] font-bold text-[#710014] uppercase tracking-wider mt-1">Total Products</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-bg-card border border-border rounded-2xl p-5 md:p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center overflow-hidden border border-accent/10">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <LayoutGrid size={26} className="text-accent" />
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2.5 rounded-xl text-text-muted hover:text-accent hover:bg-accent/10 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2.5 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-primary">{cat.name}</h3>
              <p className="text-sm text-text-muted mt-1">/{cat.slug}</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">{cat._count?.products || 0} Products</span>
                <button
                  onClick={() => toggleEnabled(cat)}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase transition-all hover:scale-105 ${
                    cat.enabled
                      ? 'bg-green-500/15 text-green-600 border border-green-500/20 hover:bg-green-500/25'
                      : 'bg-red-500/15 text-red-600 border border-red-500/20 hover:bg-red-500/25'
                  }`}
                >
                  {cat.enabled ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-20 text-center bg-bg-card border border-border rounded-2xl">
              <LayoutGrid size={56} className="mx-auto text-text-muted/50 mb-4" />
              <p className="text-text-muted">No categories found. Add your first category!</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-accent/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <ImageUpload
                label="Category Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                aspectRatio="square"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-2 border-border bg-bg-input text-green-500 focus:ring-green-500 focus:ring-offset-0"
                />
                <label htmlFor="enabled" className="text-sm font-bold text-text-secondary cursor-pointer">Active (visible on store)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3.5 bg-bg-input border border-border rounded-xl font-bold text-text-secondary hover:border-accent/50 hover:text-text-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3.5 bg-gradient-to-r from-[#710014] to-[#9a001f] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#710014]/30 hover:scale-[1.02] transition-all"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
