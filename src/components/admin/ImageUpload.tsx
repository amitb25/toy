'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  aspectRatio?: 'square' | 'banner' | 'auto'
  multiple?: boolean
  onMultipleChange?: (urls: string[]) => void
  values?: string[]
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  aspectRatio = 'auto',
  multiple = false,
  onMultipleChange,
  values = []
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (multiple) {
      await uploadMultipleFiles(Array.from(files))
    } else {
      await uploadFile(files[0])
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await res.json()
      onChange(data.url)
      toast.success('Image uploaded!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const uploadMultipleFiles = async (files: File[]) => {
    setUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) {
          throw new Error('Upload failed')
        }

        const data = await res.json()
        return data.url
      })

      const urls = await Promise.all(uploadPromises)
      if (onMultipleChange) {
        onMultipleChange([...values, ...urls])
      }
      toast.success(`${urls.length} image(s) uploaded!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) {
      toast.error('Please drop image files only')
      return
    }

    if (multiple) {
      await uploadMultipleFiles(files)
    } else {
      await uploadFile(files[0])
    }
  }

  const removeImage = (index?: number) => {
    if (multiple && onMultipleChange && typeof index === 'number') {
      const newValues = values.filter((_, i) => i !== index)
      onMultipleChange(newValues)
    } else {
      onChange('')
    }
  }

  const aspectClass = {
    square: 'aspect-square',
    banner: 'aspect-[21/9]',
    auto: 'min-h-[120px]'
  }

  // Multiple images view
  if (multiple) {
    return (
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</label>

        {/* Image Grid */}
        {values.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {values.map((url, index) => (
              <div key={index} className="relative aspect-square bg-bg-input rounded-xl overflow-hidden border border-border group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-accent animate-spin" />
              <p className="text-sm text-text-muted">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-text-muted" />
              <p className="text-sm text-text-secondary">Drop images here or click to upload</p>
              <p className="text-xs text-text-muted">PNG, JPG, WebP up to 5MB</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Single image view
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</label>

      {value ? (
        <div className={`relative bg-bg-input rounded-xl overflow-hidden border border-border ${aspectClass[aspectRatio]}`}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/20 rounded-xl text-white hover:bg-accent transition-colors"
            >
              <Upload size={18} />
            </button>
            <button
              type="button"
              onClick={() => removeImage()}
              className="p-3 bg-white/20 rounded-xl text-white hover:bg-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${aspectClass[aspectRatio]} flex items-center justify-center ${
            dragOver ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-accent animate-spin" />
              <p className="text-sm text-text-muted">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <ImageIcon size={28} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-secondary">Drop image here or click to upload</p>
                <p className="text-xs text-text-muted mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
