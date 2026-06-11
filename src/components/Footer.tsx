import { HelpCircle, ShieldAlert, Landmark, Sparkles } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-100 py-12 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400 transition-colors">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Disclaimers & Curatorial Trust Notes */}
        <div className="mb-8 grid grid-cols-1 gap-6 border-b border-neutral-200 pb-8 dark:border-neutral-800 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex space-x-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">售出概不退換政策</p>
              <p className="leading-relaxed">Bob 珍藏庫中收錄的所有商品皆為二手珍藏。每件商品皆經過精心挑選、功能測試與真實記錄。由於所有上架資訊皆維持絕對透明，所有商品售出後概不接受退換。</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Landmark className="h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">限定銀行轉帳驗證</p>
              <p className="leading-relaxed">為了保障交易安全、避免平台手續費抽成，並將回饋最大化，我們僅接受銀行轉帳付款。訂單將在轉帳收據人工審核驗證通過後安排出貨。</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Sparkles className="h-5 w-5 shrink-0 text-purple-500" />
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">個人私有收藏閣</p>
              <p className="leading-relaxed">Bob 的珍藏庫是一處獨特的個人展示空間。由收藏家為收藏家打造，所有品項在上架前均由擁有者親自完成嚴格的鑑定與清理。</p>
            </div>
          </div>
        </div>

        {/* Directory links */}
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Bob 的珍藏寶庫</span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span>創立於 2026 年</span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button onClick={() => onNavigate("home")} className="hover:text-blue-500 transition">瀏覽珍藏庫</button>
            <button onClick={() => onNavigate("status")} className="hover:text-blue-500 transition">訂單進度查詢</button>
            <button onClick={() => onNavigate("contact")} className="hover:text-blue-500 transition">聯絡 Bob</button>
            <button onClick={() => onNavigate("terms")} className="hover:text-blue-500 transition">退換貨與配送政策</button>
          </div>
        </div>

        {/* Copyright notice - Apple style */}
        <div className="flex flex-col md:flex-row justify-between gap-4 border-t border-neutral-200 md:pt-6 pt-4 dark:border-neutral-800">
          <p>© {currentYear} Bob 的珍藏寶庫。秉持頂級極簡設計標準精雕細琢。</p>
          <div className="flex space-x-4">
            <span className="text-neutral-400">台灣 (R.O.C)</span>
            <span>•</span>
            <span className="text-neutral-400">全程安全直配</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
