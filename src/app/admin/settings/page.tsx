'use client'

import { Save, Globe, Bell, Shield, CreditCard, Image as ImageIcon, Check } from 'lucide-react'
import { useState } from 'react'

export default function SettingsAdmin() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', icon: Globe, label: 'General Info' },
    { id: 'banners', icon: ImageIcon, label: 'Homepage Banners' },
    { id: 'payment', icon: CreditCard, label: 'Payment Gateway' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Update your store configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-[#e23636] text-white'
                  : 'bg-[#151515] text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="hidden sm:inline lg:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#151515] border border-white/5 rounded-xl p-4 md:p-8">
            <h3 className="font-black text-white uppercase tracking-tight border-b border-white/5 pb-4 mb-6">
              General Store Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Store Name</label>
                <input
                  type="text"
                  defaultValue="Avengers HQ"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white focus:border-[#e23636] focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@avengershq.com"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white focus:border-[#e23636] focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+91 1800-AVENGERS"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white focus:border-[#e23636] focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Shipping Charges (₹)</label>
                <input
                  type="number"
                  defaultValue="99"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white focus:border-[#e23636] focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  defaultValue="1999"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white focus:border-[#e23636] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-white/5">
              <button className="flex items-center justify-center gap-2 bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-lg font-bold text-gray-400 hover:border-white/30 hover:text-white transition-all">
                Cancel
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#e23636] px-6 py-3 rounded-lg font-bold text-white hover:bg-white hover:text-[#e23636] transition-all">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-4 md:p-6">
            <h3 className="font-bold text-white mb-4">Quick Settings</h3>
            <div className="space-y-3">
              {[
                { label: 'Enable Order Notifications', enabled: true },
                { label: 'Enable Stock Alerts', enabled: true },
                { label: 'Enable Customer Reviews', enabled: false },
                { label: 'Maintenance Mode', enabled: false },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">{setting.label}</span>
                  <button className={`w-12 h-6 rounded-full relative transition-colors ${setting.enabled ? 'bg-[#e23636]' : 'bg-gray-700'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${setting.enabled ? 'right-1' : 'left-1'}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
