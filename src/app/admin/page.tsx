"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SiteSettings {
  [key: string]: string;
}

interface Photo {
  id: number;
  slot: number;
  url: string;
  alt: string;
}

interface ConnectionRequest {
  id: number;
  name: string;
  email: string;
  message: string;
  linkedin: string;
  twitter: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const [settings, setSettings] = useState<SiteSettings>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, photosRes, connectionsRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/photos"),
        fetch("/api/connections"),
      ]);
      
      const settingsData = await settingsRes.json();
      const photosData = await photosRes.json();
      const connectionsData = await connectionsRes.json();
      
      setSettings(settingsData.settings || {});
      setPhotos(photosData.photos || []);
      setConnections(connectionsData || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings");
      }
    } catch {
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (slot: number, file: File) => {
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot", slot.toString());

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) =>
          prev.map((p) => (p.slot === slot ? { ...p, url: data.url } : p))
        );
        setMessage("Photo uploaded successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to upload photo");
      }
    } catch {
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (slot: number) => {
    setSaving(true);
    
    try {
      const res = await fetch(`/api/admin/photos?slot=${slot}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) => (p.slot === slot ? { ...p, url: "" } : p))
        );
        setMessage("Photo deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#ff3d00]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="bg-[#141414] border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-[#2a2a2a] rounded-lg hover:border-[#ff3d00] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav className="flex gap-4 mb-8 border-b border-[#2a2a2a] pb-4">
          {["settings", "photos", "connections"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-[#ff3d00] text-white"
                  : "text-[#a0a0a0] hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "connections" && connections.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[#ff3d00] rounded-full text-xs">
                  {connections.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.includes("Failed") || message.includes("error")
              ? "bg-red-500/10 border border-red-500/50 text-red-400"
              : "bg-green-500/10 border border-green-500/50 text-green-400"
          }`}>
            {message}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            <section className="card">
              <h2 className="text-xl font-bold mb-6">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={settings.hero_subtitle || ""}
                    onChange={(e) => handleSettingChange("hero_subtitle", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Headline</label>
                  <textarea
                    value={settings.hero_headline || ""}
                    onChange={(e) => handleSettingChange("hero_headline", e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Intro Text</label>
                  <textarea
                    value={settings.hero_intro || ""}
                    onChange={(e) => handleSettingChange("hero_intro", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold mb-6">About Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Title</label>
                  <input
                    type="text"
                    value={settings.about_title || ""}
                    onChange={(e) => handleSettingChange("about_title", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold mb-6">Journey Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Title</label>
                  <input
                    type="text"
                    value={settings.journey_title || ""}
                    onChange={(e) => handleSettingChange("journey_title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Subtitle</label>
                  <textarea
                    value={settings.journey_subtitle || ""}
                    onChange={(e) => handleSettingChange("journey_subtitle", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold mb-6">Projects Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Title</label>
                  <input
                    type="text"
                    value={settings.projects_title || ""}
                    onChange={(e) => handleSettingChange("projects_title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Subtitle</label>
                  <textarea
                    value={settings.projects_subtitle || ""}
                    onChange={(e) => handleSettingChange("projects_subtitle", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold mb-6">Blog Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Title</label>
                  <input
                    type="text"
                    value={settings.blog_title || ""}
                    onChange={(e) => handleSettingChange("blog_title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Subtitle</label>
                  <textarea
                    value={settings.blog_subtitle || ""}
                    onChange={(e) => handleSettingChange("blog_subtitle", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold mb-6">Contact Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Title</label>
                  <input
                    type="text"
                    value={settings.contact_title || ""}
                    onChange={(e) => handleSettingChange("contact_title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Subtitle</label>
                  <textarea
                    value={settings.contact_subtitle || ""}
                    onChange={(e) => handleSettingChange("contact_subtitle", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold mb-6">CTA Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Title</label>
                  <input
                    type="text"
                    value={settings.cta_title || ""}
                    onChange={(e) => handleSettingChange("cta_title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Subtitle</label>
                  <textarea
                    value={settings.cta_subtitle || ""}
                    onChange={(e) => handleSettingChange("cta_subtitle", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="text-xl font-bold mb-6">Social Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => handleSettingChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.phone || ""}
                    onChange={(e) => handleSettingChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={settings.twitter || ""}
                    onChange={(e) => handleSettingChange("twitter", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">Discord URL</label>
                  <input
                    type="url"
                    value={settings.discord || ""}
                    onChange={(e) => handleSettingChange("discord", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.linkedin || ""}
                    onChange={(e) => handleSettingChange("linkedin", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0a0] mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={settings.github || ""}
                    onChange={(e) => handleSettingChange("github", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Saving..." : "Save All Settings"}
            </button>
          </div>
        )}

        {activeTab === "photos" && (
          <div className="space-y-8">
            <section className="card">
              <h2 className="text-xl font-bold mb-6">Manage Photos (Max 3)</h2>
              <p className="text-[#a0a0a0] mb-6">
                Upload up to 3 photos to display on your website. These can be used for the hero section, about section, or other areas.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((slot) => {
                  const photo = photos.find((p) => p.slot === slot);
                  return (
                    <div key={slot} className="border border-[#2a2a2a] rounded-lg p-4">
                      <h3 className="font-medium mb-4">Photo {slot}</h3>
                      
                      {photo?.url ? (
                        <div className="space-y-4">
                          <div className="relative w-full h-40 rounded-lg overflow-hidden">
                            <Image
                              src={photo.url}
                              alt={`Photo ${slot}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            onClick={() => handleDeletePhoto(slot)}
                            disabled={saving}
                            className="w-full px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <label className="block">
                          <span className="sr-only">Upload photo {slot}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(slot, file);
                            }}
                            disabled={saving}
                            className="block w-full text-sm text-[#a0a0a0]
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-lg file:border-0
                              file:text-sm file:font-medium
                              file:bg-[#ff3d00] file:text-white
                              hover:file:bg-[#ff6d3d]
                            "
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === "connections" && (
          <div className="space-y-8">
            <section className="card">
              <h2 className="text-xl font-bold mb-6">Connection Requests</h2>
              <p className="text-[#a0a0a0] mb-6">
                People who want to connect with you through the contact form.
              </p>
              
              {connections.length === 0 ? (
                <p className="text-[#666]">No connection requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {connections.map((conn) => (
                    <div key={conn.id} className="border border-[#2a2a2a] rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{conn.name}</h3>
                          <a href={`mailto:${conn.email}`} className="text-[#ff3d00] hover:underline">
                            {conn.email}
                          </a>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          conn.status === "pending" 
                            ? "bg-yellow-500/20 text-yellow-400"
                            : conn.status === "contacted"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {conn.status}
                        </span>
                      </div>
                      
                      {conn.message && (
                        <p className="text-[#a0a0a0] mb-4">{conn.message}</p>
                      )}
                      
                      <div className="flex gap-4 text-sm text-[#666] mb-4">
                        {conn.linkedin && (
                          <a href={conn.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff3d00]">
                            LinkedIn
                          </a>
                        )}
                        {conn.twitter && (
                          <a href={`https://twitter.com/${conn.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff3d00]">
                            Twitter
                          </a>
                        )}
                      </div>
                      
                      <div className="text-xs text-[#666]">
                        {new Date(conn.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
