'use client'

import { Plus, Search, Image as ImageIcon, Edit2, Trash2, X, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'

interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  stock: number
  images: string
  ageGroup: string
  safetyInfo: string | null
  status: boolean
  featured: boolean
  categoryId: string
  brandId: string
  brand?: { id: string; name: string }
  category?: { id: string; name: string }
}

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    stock: '0',
    images: [] as string[],
    ageGroup: 'All',
    safetyInfo: '',
    status: true,
    featured: false,
    categoryId: '',
    brandId: ''
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/products?all=true'),
        fetch('/api/categories?all=true'),
        fetch('/api/brands?all=true')
      ])
      const [productsData, categoriesData, brandsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        brandsRes.json()
      ])
      if (Array.isArray(productsData)) setProducts(productsData)
      if (Array.isArray(categoriesData)) setCategories(categoriesData)
      if (Array.isArray(brandsData)) setBrands(brandsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '0',
      stock: '0',
      images: [],
      ageGroup: 'All',
      safetyInfo: '',
      status: true,
      featured: false,
      categoryId: categories[0]?.id || '',
      brandId: brands[0]?.id || ''
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    const images = product.images ? JSON.parse(product.images) : []
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount.toString(),
      stock: product.stock.toString(),
      images: images,
      ageGroup: product.ageGroup,
      safetyInfo: product.safetyInfo || '',
      status: product.status,
      featured: product.featured,
      categoryId: product.categoryId,
      brandId: product.brandId
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        images: JSON.stringify(formData.images)
      }

      let response
      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to save product')
        return
      }

      toast.success(editingProduct ? 'Product updated successfully!' : 'Product added successfully!')
      setShowModal(false)
      fetchAll()
    } catch (error) {
      console.error('Failed to save product:', error)
      toast.error('Network error: Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to delete product')
        return
      }
      toast.success('Product deleted successfully!')
      fetchAll()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Network error: Failed to delete product')
    }
  }

  const toggleStatus = async (product: Product) => {
    try {
      const images = product.images ? JSON.parse(product.images) : []
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          images: JSON.stringify(images),
          status: !product.status
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.details || errorData.error || 'Failed to update status')
        return
      }
      toast.success(`Product ${!product.status ? 'activated' : 'deactivated'} successfully!`)
      fetchAll()
    } catch (error) {
      console.error('Failed to toggle status:', error)
      toast.error('Network error: Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Products</h1>
          <p className="text-text-muted text-sm mt-1">Manage your inventory, pricing, and product details.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#710014] to-[#9a001f] px-5 py-3 font-bold text-white text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#710014]/30 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-accent/5 transition-all">
          <p className="text-3xl font-black text-text-primary">{products.length}</p>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">Total Products</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-green-500">{products.filter(p => p.status).length}</p>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-yellow-500">{products.filter(p => p.featured).length}</p>
          <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mt-1">Featured</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-red-500">{products.filter(p => p.stock < 10).length}</p>
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">Low Stock</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-bg-card border border-border rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-bg-card border border-border rounded-2xl">
          <Package size={56} className="mx-auto text-text-muted/50 mb-4" />
          <p className="text-text-muted">No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-bg-card border border-border rounded-2xl shadow-sm">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-bg-input text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
              <tr>
                <th className="px-4 md:px-6 py-4 text-center w-16">Image</th>
                <th className="px-4 md:px-6 py-4">Product</th>
                <th className="px-4 md:px-6 py-4">Category</th>
                <th className="px-4 md:px-6 py-4">Price</th>
                <th className="px-4 md:px-6 py-4">Stock</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const images = product.images ? JSON.parse(product.images) : []
                return (
                  <tr key={product.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-4 md:px-6 py-4">
                      <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-bg-input border border-border overflow-hidden flex items-center justify-center shadow-sm">
                        {images[0] ? (
                          <img src={images[0]} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon size={20} className="text-text-muted/50" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-bold text-text-primary text-sm leading-tight">{product.name}</p>
                      <p className="text-xs text-accent font-semibold mt-0.5">{product.brand?.name}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-text-secondary">{product.category?.name || '-'}</td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-bold text-text-primary">Rs.{product.price - product.discount}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-text-muted line-through ml-2">Rs.{product.price}</span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                        product.stock > 10 ? 'bg-green-500/15 text-green-600 border border-green-500/20' :
                        product.stock > 0 ? 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/20' :
                        'bg-red-500/15 text-red-600 border border-red-500/20'
                      }`}>
                        {product.stock} left
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-all hover:scale-105 ${
                          product.status
                            ? 'bg-green-500/15 text-green-600 border border-green-500/20 hover:bg-green-500/25'
                            : 'bg-red-500/15 text-red-600 border border-red-500/20 hover:bg-red-500/25'
                        }`}
                      >
                        {product.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2.5 rounded-xl text-text-muted hover:text-accent hover:bg-accent/10 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-6xl p-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-accent/10 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Form Fields */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none transition-all"
                      placeholder="Enter product description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Brand</label>
                      <select
                        value={formData.brandId}
                        onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                        required
                      >
                        <option value="">Select Brand</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Price (Rs.)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Discount (Rs.)</label>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Stock</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Age Group</label>
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                      >
                        <option value="All">All Ages</option>
                        <option value="0-2">0-2 Years</option>
                        <option value="3-5">3-5 Years</option>
                        <option value="6-8">6-8 Years</option>
                        <option value="8+">8+ Years</option>
                        <option value="12+">12+ Years</option>
                        <option value="14+">14+ Years</option>
                        <option value="18+">18+ Years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Safety Info</label>
                      <input
                        type="text"
                        value={formData.safetyInfo}
                        onChange={(e) => setFormData({ ...formData, safetyInfo: e.target.value })}
                        className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                        placeholder="Small parts warning..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                        className="w-5 h-5 rounded-lg border-2 border-border bg-bg-input text-green-500 focus:ring-green-500 focus:ring-offset-0"
                      />
                      <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">Active</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-5 h-5 rounded-lg border-2 border-border bg-bg-input text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
                      />
                      <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">Featured</span>
                    </label>
                  </div>
                </div>

                {/* Right Column - Images */}
                <div className="lg:w-[380px] flex-shrink-0">
                  <div className="lg:sticky lg:top-0">
                    <ImageUpload
                      label="Product Images"
                      multiple={true}
                      values={formData.images}
                      value=""
                      onChange={() => {}}
                      onMultipleChange={(urls) => setFormData({ ...formData, images: urls })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-border">
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
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
