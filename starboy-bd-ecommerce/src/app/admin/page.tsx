"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageCircle,
  BarChart3,
  Users,
  Megaphone,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { products, categories, messages, reviews, announcements } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Product, Category, Announcement } from "@/types";
import Image from "next/image";

const adminTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Layers },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <p className="text-ink-500 mb-4">Please login to access the admin panel.</p>
          <Link href="/auth" className="px-6 py-2.5 bg-ink-950 text-brand-300 text-sm font-semibold rounded-xl">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <p className="text-ink-500 mb-4">Unauthorized. Admin access only.</p>
          <Link href="/" className="px-6 py-2.5 bg-ink-950 text-brand-300 text-sm font-semibold rounded-xl">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-ink-950 text-ink-200 py-6 md:py-10 grain">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-ink-500 mt-1">Manage your store, products, and customers.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-500 bg-ink-900/50 px-3 py-1.5 rounded-lg border border-ink-800">
            <Users className="w-3.5 h-3.5" /> Logged in as <span className="text-brand-400 font-semibold">{user.username}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <nav className="bg-ink-900/50 backdrop-blur rounded-2xl border border-ink-800 overflow-hidden">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                    activeTab === tab.id ? "bg-brand-900/30 text-brand-400 font-semibold" : "text-ink-400 hover:bg-ink-800/50 hover:text-ink-200"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Products", value: products.length, change: "+4 this week", up: true },
                      { label: "Total Orders", value: "1,240", change: "+12%", up: true },
                      { label: "Revenue", value: "৳845K", change: "+8%", up: true },
                      { label: "Customers", value: "15,420", change: "+5%", up: true },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl p-4">
                        <div className="text-xs text-ink-500 mb-1">{stat.label}</div>
                        <div className="text-xl font-display font-bold text-white">{stat.value}</div>
                        <div className={`flex items-center gap-1 text-[11px] mt-1 ${stat.up ? "text-green-400" : "text-red-400"}`}>
                          {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.change}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl p-5">
                      <h3 className="text-sm font-semibold text-white mb-3">Recent Products</h3>
                      <div className="space-y-3">
                        {products.slice(0, 4).map((p) => (
                          <div key={p.id} className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg bg-ink-800 overflow-hidden shrink-0">
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-ink-200 truncate">{p.name}</div>
                              <div className="text-[11px] text-ink-500">{formatPrice(p.originalPrice)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl p-5">
                      <h3 className="text-sm font-semibold text-white mb-3">Recent Messages</h3>
                      <div className="space-y-3">
                        {messages.slice(0, 4).map((m) => (
                          <div key={m.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-900/50 text-brand-300 flex items-center justify-center text-xs font-bold shrink-0">
                              {m.userName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-ink-200 truncate">{m.text}</div>
                              <div className="text-[11px] text-ink-500">{m.userName} • {m.productName}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "products" && (
                <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-white">Products</h2>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Product
                    </button>
                  </div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-ink-900 border border-ink-800 rounded-xl text-sm text-white placeholder:text-ink-500 outline-none focus:border-brand-600"
                    />
                  </div>
                  <div className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-ink-800 text-left text-xs text-ink-500 uppercase tracking-wider">
                            <th className="px-4 py-3 font-medium">Product</th>
                            <th className="px-4 py-3 font-medium">Price</th>
                            <th className="px-4 py-3 font-medium">Stock</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-800/60">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-ink-800/30 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-8 h-8 rounded bg-ink-800 overflow-hidden shrink-0">
                                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                                  </div>
                                  <span className="text-ink-200 font-medium truncate max-w-[120px] md:max-w-xs">{p.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-ink-400">{formatPrice(p.offerPrice ?? p.originalPrice)}</td>
                              <td className="px-4 py-3 text-ink-400 capitalize">{p.availability.replace("_", " ")}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  {p.featured && <span className="text-[10px] bg-brand-900/40 text-brand-300 px-1.5 py-0.5 rounded">Featured</span>}
                                  {p.trending && <span className="text-[10px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded">Trending</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button className="p-1.5 text-ink-400 hover:text-brand-400 hover:bg-brand-900/30 rounded-lg transition-colors">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 text-ink-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "categories" && (
                <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-white">Categories</h2>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl p-4 flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl bg-ink-800 overflow-hidden shrink-0">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-ink-200">{cat.name}</div>
                          <div className="text-[11px] text-ink-500">{cat.description}</div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button className="p-1.5 text-ink-400 hover:text-brand-400 hover:bg-brand-900/30 rounded-lg transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 text-ink-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "messages" && (
                <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="font-display text-xl font-bold text-white mb-4">Customer Messages</h2>
                  <div className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl divide-y divide-ink-800/60">
                    {messages.map((m) => (
                      <div key={m.id} className="p-4 flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-900/50 text-brand-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {m.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-ink-200">{m.userName}</span>
                            <span className="text-[11px] text-ink-500">{new Date(m.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-ink-400">{m.text}</p>
                          {m.productName && (
                            <span className="inline-block mt-1.5 text-[10px] font-semibold text-brand-400 bg-brand-950 px-2 py-0.5 rounded-md border border-brand-900">
                              {m.productName}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "announcements" && (
                <motion.div key="announcements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-white">Announcements</h2>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-colors">
                      <Plus className="w-3.5 h-3.5" /> New Announcement
                    </button>
                  </div>
                  <div className="space-y-3">
                    {announcements.map((a) => (
                      <div key={a.id} className={`bg-ink-900/60 backdrop-blur border rounded-2xl p-4 ${a.active ? "border-brand-800/50" : "border-ink-800"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-semibold text-ink-200">{a.title}</div>
                          <div className="flex gap-2">
                            <button className="p-1.5 text-ink-400 hover:text-brand-400 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 text-ink-400 hover:text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <p className="text-xs text-ink-400 mb-2">{a.content}</p>
                        <div className="flex gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${a.active ? "bg-green-900/30 text-green-400" : "bg-ink-800 text-ink-500"}`}>{a.active ? "Active" : "Inactive"}</span>
                          <span className="text-[10px] bg-ink-800 text-ink-500 px-1.5 py-0.5 rounded capitalize">{a.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Page Views", value: "45.2K", sub: "+2.4%" },
                      { label: "Most Wishlisted", value: "Pink Poplin", sub: "248 saves" },
                      { label: "Cart Adds", value: "1,102", sub: "+18%" },
                      { label: "Conversion", value: "3.2%", sub: "-0.4%" },
                    ].map((s) => (
                      <div key={s.label} className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl p-4">
                        <div className="text-xs text-ink-500 mb-1">{s.label}</div>
                        <div className="text-lg font-display font-bold text-white">{s.value}</div>
                        <div className="text-[11px] text-brand-400 mt-0.5">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-ink-900/60 backdrop-blur border border-ink-800 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Top Performing Products</h3>
                    <div className="space-y-3">
                      {products.slice(0, 5).map((p, i) => (
                        <div key={p.id} className="flex items-center gap-3">
                          <div className="text-xs text-ink-500 w-4">{i + 1}</div>
                          <div className="relative w-8 h-8 rounded bg-ink-800 overflow-hidden shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-ink-200 truncate">{p.name}</div>
                          </div>
                          <div className="text-xs text-ink-500">{Math.floor(Math.random() * 500 + 100)} views</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
