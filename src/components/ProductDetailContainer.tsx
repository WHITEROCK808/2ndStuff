import { useState } from "react";
import { ArrowLeft, Star, ShieldCheck, MapPin, Calendar, Compass, Paperclip, AlertCircle, Heart, Wallet, ReceiptText } from "lucide-react";
import { Product, SystemSettings } from "../types";

interface ProductDetailContainerProps {
  product: Product;
  settings: SystemSettings;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onInitiateCheckout: (productId: string, paymentType: "Full" | "Deposit") => void;
}

export default function ProductDetailContainer({
  product,
  settings,
  favorites,
  onToggleFavorite,
  onBack,
  onInitiateCheckout,
}: ProductDetailContainerProps) {
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const isFav = favorites.includes(product.id);

  // Gallery compilation (main featured image + secondary images array)
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);

  // Option 1 Calculations: Pay in Full Discount
  const discountPercent = settings.discountPercent || 5;
  const payInFullDiscount = Math.round(product.price * (discountPercent / 100));
  const payInFullPrice = product.price - payInFullDiscount;

  // Option 2 Calculations: Pay Deposit
  const depositPercent = settings.depositPercent || 30;
  const payDepositValue = Math.round(product.price * (depositPercent / 100));
  const remainingBalanceValue = product.price - payDepositValue;
  const balanceDueDays = settings.balanceDueDays || 3;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={onBack}
        id="detail-back-button"
        className="flex items-center space-x-2 text-sm font-medium text-neutral-500 hover:text-blue-500 transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回珍藏商店</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Gallery Grid - 7/12 layout */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Main Large Visual Stage */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
            <img
              referrerPolicy="no-referrer"
              src={activeImage || "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600"}
              alt={product.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
            {/* Location Tag */}
            <span className="absolute bottom-4 left-4 inline-flex items-center space-x-1.5 rounded-full bg-black/60 dark:bg-black/75 backdrop-blur-md text-white px-3.5 py-1.5 text-xs font-mono">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              <span>{product.location === "Taipei" ? "台北市" : product.location === "New Taipei City" ? "新北市" : product.location === "Hsinchu" ? "新竹市" : product.location === "Taichung" ? "台中市" : product.location}，台灣</span>
            </span>
          </div>

          {/* Thumbnails array */}
          {allImages.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 h-16 w-24 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === img 
                      ? "border-blue-600 dark:border-blue-500 scale-102" 
                      : "border-neutral-200 dark:border-neutral-800 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Buying Desk - 5/12 layout */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 font-mono uppercase">
                {product.categorySlug === "electronics" ? "電子科技" :
                 product.categorySlug === "photography" ? "相機攝影" :
                 product.categorySlug === "audio" ? "高級音響" :
                 product.categorySlug === "gaming" ? "電玩娛樂" :
                 product.categorySlug === "home" ? "辦公居家" :
                 product.categorySlug === "books" ? "人文經典" :
                 product.categorySlug === "collectibles" ? "限量收藏" :
                 product.categorySlug === "others" ? "其他私藏" : product.categorySlug}
              </span>
              <button
                onClick={() => onToggleFavorite(product.id)}
                className="flex items-center space-x-1 text-xs text-neutral-500 hover:text-red-500 transition"
              >
                <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isFav ? "已加入收藏" : "加入收藏"}</span>
              </button>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1.5">
              {product.title}
            </h1>

            {/* Condition Score & Verified Indicator */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4.5 w-4.5 ${
                      i < Math.floor(product.conditionScore) 
                        ? "fill-current" 
                        : "text-neutral-300 dark:text-neutral-700"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 pl-0.5">
                {product.conditionScore} / 5
              </span>
              <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-mono font-medium">
                品相極佳 • {product.conditionPercentage}% 新
              </span>
            </div>
          </div>

          {/* Pricing Stage - Trust comparison */}
          <div className="bg-neutral-100/50 dark:bg-neutral-900/35 border rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase font-mono tracking-tight">官方/購入原價</p>
              <p className="text-sm font-mono text-neutral-500 dark:text-neutral-405 line-through">NT$ {product.originalPrice.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase font-mono tracking-tight">珍藏庫割愛價</p>
              <p className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">NT$ {product.price.toLocaleString()}</p>
            </div>
          </div>

          {/* Buying Actions - No add-to-cart, direct options resembling Apple Wallet cards */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 font-sans">直購付款方案</h3>

            {/* STATUS ALERT IF PRODUCT NOT AVAILABLE */}
            {product.status !== "Available" && (
              <div className="flex items-center space-x-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 p-4 font-sans text-xs">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>此珍藏品的狀態目前為 <b>{product.status === "Pending Payment" ? "待確認付款" : "已售出"}</b>，已鎖定結帳購買。</span>
              </div>
            )}

            {/* Option 1: Pay in Full (5% discount) */}
            <div className={`relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent border-blue-500/20 shadow-sm transition-all duration-300 ${product.status !== "Available" ? "opacity-60 pointer-events-none" : "hover:border-blue-500 hover:shadow-md"}`}>
              <div className="absolute top-0 right-0 rounded-bl-xl bg-blue-600 text-white px-3.5 py-1 text-[10px] font-bold uppercase font-mono">
                立省 {discountPercent}%
              </div>
              <div className="flex items-start space-x-3">
                <Wallet className="h-5 w-5 text-blue-600 mt-1 dark:text-blue-400" />
                <div className="flex-1">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">全額匯款直購 (最划算)</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">即時完成款項交易。享有專屬優先最速出貨，氣泡紙加固箱裝送達。</p>
                  
                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-lg font-extrabold text-neutral-900 dark:text-white">NT$ {payInFullPrice.toLocaleString()}</span>
                    <span className="text-xs text-neutral-400 line-through">NT$ {product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                disabled={product.status !== "Available"}
                onClick={() => onInitiateCheckout(product.id, "Full")}
                id="btn-buy-full"
                className="w-full mt-4 bg-blue-600 text-white text-xs font-semibold rounded-xl py-3 shadow-md shadow-blue-600/15 hover:bg-blue-700 transition apple-button"
              >
                全額匯款直購 (享 {discountPercent}% 優惠)
              </button>
            </div>

            {/* Option 2: Pay 30% Deposit */}
            <div className={`relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 shadow-sm transition-all duration-300 ${product.status !== "Available" ? "opacity-60 pointer-events-none" : "hover:border-purple-500 hover:shadow-md"}`}>
              <div className="absolute top-0 right-0 rounded-bl-xl bg-purple-500 text-white px-3.5 py-1 text-[10px] font-bold uppercase font-mono">
                預控保留
              </div>
              <div className="flex items-start space-x-3">
                <ReceiptText className="h-5 w-5 text-purple-600 mt-1 dark:text-purple-400" />
                <div className="flex-1">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">支付 {depositPercent}% 訂金保留</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">立即锁定商品不被他人搶購，餘額於 {balanceDueDays} 日內匯清即可。</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                    <div>
                      <p className="text-neutral-400 shrink-0">即刻付訂金額：</p>
                      <p className="font-bold text-neutral-900 dark:text-white mt-0.5">NT$ {payDepositValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 shrink-0">{balanceDueDays} 日內尾款：</p>
                      <p className="font-bold text-neutral-900 dark:text-white mt-0.5">NT$ {remainingBalanceValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                disabled={product.status !== "Available"}
                onClick={() => onInitiateCheckout(product.id, "Deposit")}
                id="btn-buy-deposit"
                className="w-full mt-4 bg-purple-600 text-white text-xs font-semibold rounded-xl py-3 shadow-md shadow-purple-600/15 hover:bg-purple-700 transition apple-button"
              >
                支付 {depositPercent}% 訂金保留商品
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* LOWER SECTION: Technical Logs / Disclosures */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-neutral-200 dark:border-neutral-800 pt-12">
        <div className="space-y-6">
          <h2 className="font-sans text-xl font-bold text-neutral-900 dark:text-neutral-50">珍藏履歷與原廠規格</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-3.5">
              <Calendar className="h-4.5 w-4.5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">原始購入日期</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">{product.originalPurchaseDate || "未指定 / 由智慧提取"}</p>
              </div>
            </div>

            <div className="flex space-x-3.5">
              <Paperclip className="h-4.5 w-4.5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">隨附完整原廠配件</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {product.accessories && product.accessories.length > 0 ? (
                    product.accessories.map((acc, key) => (
                      <span key={key} className="text-[10px] font-sans font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-neutral-600 dark:text-neutral-350 border border-neutral-200/50 dark:border-neutral-700">
                        {acc}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500">無隨附配件</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3.5">
              <Compass className="h-4.5 w-4.5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">保固狀態說明</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">{product.warrantyStatus}</p>
              </div>
            </div>

            <div className="flex space-x-3.5">
              <ShieldCheck className="h-4.5 w-4.5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">物件使用經歷與保養</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">{product.usageHistory}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel border p-6 rounded-2xl space-y-6">
          <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="font-sans text-base font-bold">誠信瑕疵揭露 & 真實估價</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">出讓原因（愛物割愛）</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{product.reasonForSelling}</p>
            </div>

            <div className="border-t border-neutral-250 dark:border-neutral-850 pt-4">
              <p className="text-xs font-semibold text-red-500 dark:text-red-400">誠實已知瑕疵記錄</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-350 mt-1 leading-relaxed bg-red-500/5 p-2 rounded-lg border border-red-500/10 font-mono">
                {product.knownDefects || "完全無傷。近乎封存的完美品相。"}
              </p>
            </div>

            <div className="border-t border-neutral-250 dark:border-neutral-850 pt-4">
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">收藏家核心詳述</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
