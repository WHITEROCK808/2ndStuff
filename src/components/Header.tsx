import { useState, useEffect } from "react";
import { Sun, Moon, Shield, Sparkles, Heart, Menu, X, Landmark, ReceiptText, PhoneCall, HelpCircle } from "lucide-react";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdmin: boolean;
  onLogoutAdmin: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  isAdmin,
  onLogoutAdmin,
  favoritesCount,
  onOpenFavorites,
}: HeaderProps) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (darkMode) {
      root.classList.add("dark");
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navItems = [
    { id: "home", label: "珍藏商店", icon: Landmark },
    { id: "status", label: "訂單追蹤", icon: ReceiptText },
    { id: "contact", label: "聯絡 Bob", icon: PhoneCall },
    { id: "terms", label: "商店政策", icon: HelpCircle },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50 w-full transition-all duration-300">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        
        {/* Brand Logo - pure Apple feel */}
        <div 
          onClick={() => onNavigate("home")} 
          className="flex cursor-pointer items-center group"
          id="nav-logo"
        >
          <div className="flex flex-col -space-y-0.5">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 leading-none">
              Bob's Vault
            </span>
            <span className="font-sans text-base font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Bob 的<span className="text-blue-600 dark:text-blue-400 ml-1 font-extrabold">珍藏庫</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions bar (Theme, Favorites, Admin Portal) */}
        <div className="flex items-center space-x-3.5">
          {/* Favorites Heart */}
          <button
            onClick={onOpenFavorites}
            id="nav-favorites-btn"
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full bg-neutral-150 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 transition"
            title="收藏清單"
          >
            <Heart className={`h-4.5 w-4.5 ${favoritesCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            id="theme-toggler"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 transition"
            title={darkMode ? "切換至淺色模式" : "切換至深色模式"}
          >
            {darkMode ? <Sun className="h-4.5 w-4.5 text-yellow-400" /> : <Moon className="h-4.5 w-4.5 text-neutral-600" />}
          </button>

          {/* Admin link */}
          {isAdmin ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate("admin")}
                id="nav-admin-dashboard"
                className={`flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 hover:opacity-80 transition`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>控制台</span>
              </button>
              <button
                onClick={onLogoutAdmin}
                id="btn-admin-logout"
                className="text-xs text-neutral-400 hover:text-red-500 transition"
              >
                登出
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate("admin")}
              id="nav-admin-login"
              className="flex items-center space-x-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition"
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">管理入口</span>
            </button>
          )}

          {/* Mobile menu controls */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-8.5 w-8.5 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mx-6 my-2 rounded-2xl border p-4 shadow-xl transition-all duration-300 animate-fade-in-up">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 rounded-lg p-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                    isActive 
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-500/10" 
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
