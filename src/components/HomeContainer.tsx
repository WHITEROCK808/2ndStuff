import { useState, useMemo } from "react";
import { Search, MapPin, Sparkles, Star, Heart, ArrowRight, CornerRightUp, SlidersHorizontal, Sliders } from "lucide-react";
import { Product, Category } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HomeContainerProps {
  products: Product[];
  categories: Category[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

export default function HomeContainer({
  products,
  categories,
  favorites,
  onToggleFavorite,
  onSelectProduct,
}: HomeContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minCondition, setMinCondition] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on search inputs matching Name, Description, Category, Condition, Price Range
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query checks Title, Description, categorySlug and keywords
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categorySlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.seoKeywords &&
          product.seoKeywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      // 2. Category Filter
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;

      // 3. Condition Filter (Percentage New, e.g. 90-100)
      const matchesCondition = product.conditionPercentage >= minCondition;

      // 4. Price range Filter
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, minCondition, maxPrice]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 relative">

      {/* Dynamic Animated Atmospheric Vibe Background */}
      <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none -z-10 bg-gradient-to-b from-blue-50/20 via-amber-50/10 to-transparent dark:from-neutral-950 dark:via-blue-950/5 dark:to-transparent">
        {/* Soft floating cyan orb */}
        <div className="absolute -top-32 left-[5%] w-96 h-96 rounded-full bg-blue-300/40 dark:bg-blue-600/15 blur-[120px] animate-float-aura-1" />
        
        {/* Soft floating rose/purple orb */}
        <div className="absolute top-10 right-[10%] w-96 h-96 rounded-full bg-pink-200/35 dark:bg-purple-600/12 blur-[130px] animate-float-aura-2" />
        
        {/* Soft floating warm gold center orb */}
        <div className="absolute top-64 left-[30%] w-80 h-80 rounded-full bg-amber-200/30 dark:bg-amber-500/10 blur-[110px] animate-float-aura-3" />
      </div>
      
      {/* 1. Hero Section - Inspired by Apple Vision Pro webpage with advanced light flow */}
      <section className="text-center relative py-16 md:py-24 rounded-[32px] overflow-hidden mb-12 bg-white/40 dark:bg-neutral-900/40 border border-white/50 dark:border-white/5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-blue-500/5 hover:border-white/70 dark:hover:border-white/10 group">
        
        {/* Underlay Ambient Light Flow with moving color gradients */}
        <div className="absolute inset-0 ambient-light-flow opacity-70 dark:opacity-40 select-none pointer-events-none" />
        
        {/* Crisp Laser Sheen Glass Flare that sweeps gracefully across the card */}
        <div className="laser-sheen" />
        
        {/* Spotlight dynamic hover enhancement overlay */}
        <div className="absolute inset-0 bg-radial from-blue-500/5 via-transparent to-transparent opacity-80 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-2 rounded-full bg-blue-500/10 dark:bg-blue-400/10 px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-500" />
            <span className="tracking-wide">嚴選個人私藏閣</span>
          </motion.div>
 
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 leading-[1.15]"
          >
            Bob 的珍藏寶庫
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-xl text-neutral-500 dark:text-neutral-400 font-sans text-base sm:text-lg font-light leading-relaxed mb-4"
          >
            精選自我的個人珍藏與職業生涯中的高品質物件。
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4, duration: 1.0 }}
            className="text-xs text-neutral-400 dark:text-neutral-500 font-mono tracking-wider"
          >
            專屬單一賣家。免除繁瑣手續，提供銀行轉帳直接購買流程。
          </motion.p>
        </div>
      </section>

      {/* 2. Advanced Search & Control Bar */}
      <div className="glass-panel border p-5 rounded-[24px] shadow-sm mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main search box */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              id="product-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋商品名稱、描述、分類或關鍵字..."
              className="w-full bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl py-3 pl-11 pr-4 text-sm font-light text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              id="toggle-filters-btn"
              className={`flex items-center space-x-2 border rounded-xl px-4 py-3 text-sm font-medium transition ${
                showFilters 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : "bg-white text-neutral-700 hover:bg-neutral-55 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-700"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>篩選條件</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Box */}
        {showFilters && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-100 dark:border-neutral-800 pt-5 animate-fade-in-up">
            {/* Max Price Range Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">最高預算</span>
                <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400">NT$ {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="150000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                <span>NT$3,000</span>
                <span>NT$150,000</span>
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">新舊程度要求</span>
                <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400">{minCondition}% 以上新</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minCondition}
                onChange={(e) => setMinCondition(Number(e.target.value))}
                className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                <span>不限狀況</span>
                <span>全新極品 (100% 新)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Horizontal Category Scroller */}
      <div className="mb-10 w-full overflow-hidden relative z-10">
        <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-none safari-scroller justify-start md:justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedCategory("all")}
            id="cat-pill-all"
            className={`relative shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-tight transition-colors duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "text-white dark:text-black font-semibold"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 dark:text-neutral-350"
            }`}
          >
            {selectedCategory === "all" && (
              <motion.span
                layoutId="activeCategoryBg"
                className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">全部珍藏品</span>
          </motion.button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            // Translate default category names to Chinese
            const translatedCatName = 
              cat.slug === "electronics" ? "電子科技" :
              cat.slug === "photography" ? "相機攝影" :
              cat.slug === "audio" ? "高級音響" :
              cat.slug === "gaming" ? "電玩娛樂" :
              cat.slug === "home" ? "辦公居家" :
              cat.slug === "books" ? "人文經典" :
              cat.slug === "collectibles" ? "限量收藏" :
              cat.slug === "others" ? "其他私藏" : cat.name;

            return (
              <motion.button
                key={cat.id}
                id={`cat-pill-${cat.slug}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`relative shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-tight transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? "text-white dark:text-black font-semibold"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 dark:text-neutral-350"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{translatedCatName}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 4. Product Gallery Feed Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-100 dark:bg-neutral-900/40 rounded-[24px] border border-dashed border-neutral-300 dark:border-neutral-800">
          <p className="text-neutral-500 dark:text-neutral-400 font-light mb-2">沒有符合您篩選條件的精選商品。</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setMinCondition(0); setMaxPrice(150000); }} 
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            重設篩選條件
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => {
              const isFav = favorites.includes(p.id);
              const translatedCategoryName = 
                p.categorySlug === "electronics" ? "電子科技" :
                p.categorySlug === "photography" ? "相機攝影" :
                p.categorySlug === "audio" ? "高級音響" :
                p.categorySlug === "gaming" ? "電玩娛樂" :
                p.categorySlug === "home" ? "辦公居家" :
                p.categorySlug === "books" ? "人文經典" :
                p.categorySlug === "collectibles" ? "限量收藏" :
                p.categorySlug === "others" ? "其他私藏" : p.categorySlug;

              const translatedStatus = 
                p.status === "Available" ? "現貨在庫" :
                p.status === "Pending Payment" ? "待確認付款" :
                p.status === "Sold" ? "已售出" : p.status;

              const translatedLocation = 
                p.location === "Taipei" ? "台北市" :
                p.location === "New Taipei City" ? "新北市" :
                p.location === "Hsinchu" ? "新竹市" :
                p.location === "Taichung" ? "台中市" : p.location;

              return (
                <motion.div
                  key={p.id}
                  id={`product-card-${p.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: 15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.015,
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
                    borderColor: "rgba(59, 130, 246, 0.3)"
                  }}
                  className="group relative flex flex-col rounded-[24px] bg-white border border-neutral-200/60 dark:bg-neutral-950 dark:border-neutral-800/50 overflow-hidden shadow-sm transition-all duration-300 cursor-pointer"
                  onClick={() => onSelectProduct(p.id)}
                >
                  {/* Product Image Stage */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                    <img
                      referrerPolicy="no-referrer"
                      src={p.imageUrl || "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600"}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-550"
                      loading="lazy"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex space-x-1.5">
                      <span 
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide shadow-sm uppercase ${
                          p.status === "Available"
                            ? "bg-emerald-500 text-white"
                            : p.status === "Pending Payment"
                            ? "bg-amber-500 text-white"
                            : "bg-neutral-600 text-white"
                        }`}
                      >
                        {translatedStatus}
                      </span>
                      <span className="rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 px-3 py-1 text-[11px] font-mono">
                        {translatedLocation}
                      </span>
                    </div>

                    {/* Favorite Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(p.id);
                      }}
                      id={`fav-btn-${p.id}`}
                      className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-neutral-600 hover:text-red-500 shadow-sm transition"
                    >
                      <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-red-500 text-red-500" : "text-neutral-700 dark:text-neutral-400"}`} />
                    </button>
                  </div>

                  {/* Card description details */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold font-mono text-neutral-400 dark:text-neutral-500">
                        {translatedCategoryName}
                      </span>
                      <h3 className="font-sans text-lg font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 leading-snug mt-1 transition">
                        {p.title}
                      </h3>

                      {/* Condition Rating Indicators */}
                      <div className="flex items-center space-x-1 mt-2.5">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < Math.floor(p.conditionScore) 
                                  ? "fill-current" 
                                  : "text-neutral-350 dark:text-neutral-700"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-450 leading-none pl-1">
                          {p.conditionScore} / 5
                        </span>
                        <span className="text-neutral-300 dark:text-neutral-800 text-[10px]">•</span>
                        <span className="text-xs font-mono tracking-tighter bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                          {p.conditionPercentage}% 極新
                        </span>
                      </div>

                      <p className="text-xs text-neutral-500 dark:text-neutral-440 mt-3.5 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* Price and Action button */}
                    <div className="flex items-center justify-between mt-6 border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
                      <div>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-mono tracking-tight line-through leading-none">
                          原價 NT$ {p.originalPrice.toLocaleString()}
                        </p>
                        <p className="text-lg font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-0.5 leading-none">
                          NT$ {p.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                        <span>查看商品詳情</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
}
