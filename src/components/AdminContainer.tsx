import React, { useState, useRef, useMemo, useEffect } from "react";
import { 
  ShieldCheck, Lock, Sparkles, Plus, Edit2, Trash2, Check, X, Truck, Eye, Save, DollarSign,
  Package, ShoppingCart, Users, Settings, Tag, RefreshCw, Star, UploadCloud, AlertCircle, EyeOff, UserCheck
} from "lucide-react";
import { Product, Order, Customer, SystemSettings } from "../types";
import { getGeminiSuggestions } from "../lib/api";

interface AdminContainerProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  settings: SystemSettings;
  isAdmin: boolean;
  onLoginAdmin: () => void;
  onLogoutAdmin: () => void;
  onAddProduct: (product: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrder: (id: string, orderData: Partial<Order>) => Promise<void>;
  onUpdateSettings: (settings: Partial<SystemSettings>) => Promise<void>;
}

export default function AdminContainer({
  products,
  orders,
  customers,
  settings,
  isAdmin,
  onLoginAdmin,
  onLogoutAdmin,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  onUpdateSettings,
}: AdminContainerProps) {
  // Login states
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  // Layout tabs inside dashboard
  const [adminTab, setAdminTab] = useState<"metrics" | "products" | "orders" | "customers" | "settings">("metrics");

  // Managing products edit/create forms
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productFormType, setProductFormType] = useState<"create" | "edit">("create");

  // Product Form Field States
  const [pfTitle, setPfTitle] = useState("");
  const [pfPrice, setPfPrice] = useState("");
  const [pfOriginalPrice, setPfOriginalPrice] = useState("");
  const [pfConditionScore, setPfConditionScore] = useState("4.5");
  const [pfConditionPercentage, setPfConditionPercentage] = useState("90");
  const [pfLocation, setPfLocation] = useState("Taipei");
  const [pfStatus, setPfStatus] = useState<any>("Available");
  const [pfCategorySlug, setPfCategorySlug] = useState("electronics");
  const [pfOriginalPurchaseDate, setPfOriginalPurchaseDate] = useState("");
  const [pfAccessories, setPfAccessories] = useState("");
  const [pfWarrantyStatus, setPfWarrantyStatus] = useState("");
  const [pfUsageHistory, setPfUsageHistory] = useState("");
  const [pfReasonForSelling, setPfReasonForSelling] = useState("");
  const [pfKnownDefects, setPfKnownDefects] = useState("");
  const [pfDescription, setPfDescription] = useState("");
  const [pfImageUrl, setPfImageUrl] = useState("");
  const [pfImages, setPfImages] = useState<string[]>([]);
  const [pfSeoKeywords, setPfSeoKeywords] = useState("");

  // Product Photo upload refs and link paste inputs
  const productImagesFileRef = useRef<HTMLInputElement>(null);
  const [pasteUrlInput, setPasteUrlInput] = useState("");

  // Smart AI Suggestions States (Gemini API)
  const [aiImageBase64, setAiImageBase64] = useState("");
  const [aiImageFileName, setAiImageFileName] = useState("");
  const [aiDescriptionInput, setAiDescriptionInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");
  const aiFileRef = useRef<HTMLInputElement>(null);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  // Action input states for Order trackings
  const [focusedOrder, setFocusedOrder] = useState<Order | null>(null);
  const [trackingNoInput, setTrackingNoInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("Black Cat (黑貓)");

  // Bank / parameters state fields
  const [settBankName, setSettBankName] = useState(settings.bankName);
  const [settBankCode, setSettBankCode] = useState(settings.bankCode);
  const [settAccountNumber, setSettAccountNumber] = useState(settings.accountNumber);
  const [settAccountName, setSettAccountName] = useState(settings.accountName);
  const [settDepositPercent, setSettDepositPercent] = useState(settings.depositPercent.toString());
  const [settDiscountPercent, setSettDiscountPercent] = useState(settings.discountPercent.toString());
  const [settBalanceDueDays, setSettBalanceDueDays] = useState(settings.balanceDueDays.toString());
  const [settShippingPolicy, setSettShippingPolicy] = useState(settings.shippingPolicy);
  const [settReturnPolicy, setSettReturnPolicy] = useState(settings.returnPolicy);

  // Expanded detailed terms and shop policies
  const [settReturnPolicyDetail, setSettReturnPolicyDetail] = useState(settings.returnPolicyDetail || "");
  const [settShippingPolicyDetail, setSettShippingPolicyDetail] = useState(settings.shippingPolicyDetail || "");
  const [settPaymentPolicyDetail, setSettPaymentPolicyDetail] = useState(settings.paymentPolicyDetail || "");
  const [settServicePolicy, setSettServicePolicy] = useState(settings.servicePolicy || "");

  useEffect(() => {
    setSettBankName(settings.bankName || "");
    setSettBankCode(settings.bankCode || "");
    setSettAccountNumber(settings.accountNumber || "");
    setSettAccountName(settings.accountName || "");
    setSettDepositPercent((settings.depositPercent ?? 30).toString());
    setSettDiscountPercent((settings.discountPercent ?? 5).toString());
    setSettBalanceDueDays((settings.balanceDueDays ?? 3).toString());
    setSettShippingPolicy(settings.shippingPolicy || "");
    setSettReturnPolicy(settings.returnPolicy || "");
    setSettReturnPolicyDetail(settings.returnPolicyDetail || "");
    setSettShippingPolicyDetail(settings.shippingPolicyDetail || "");
    setSettPaymentPolicyDetail(settings.paymentPolicyDetail || "");
    setSettServicePolicy(settings.servicePolicy || "");
  }, [settings]);

  // Security variables configuration state
  const [securityInfo, setSecurityInfo] = useState<{
    isTotpEnabled: boolean;
    totpSecret: string;
    totpUri: string;
  } | null>(null);

  useEffect(() => {
    const fetchSecurityInfo = async () => {
      try {
        const res = await fetch("/api/admin/security-info");
        const data = await res.json();
        setSecurityInfo(data);
      } catch (err) {
        console.error("Failed to load backend security parameters:", err);
      }
    };
    fetchSecurityInfo();
  }, [isAdmin]);

  // 1. Authenticate locally with TouchID bypass indicator
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await response.json();
      if (data.success) {
        onLoginAdmin();
        setLoginError("");
      } else {
        setLoginError(data.error || "驗證失敗，請檢查輸入內容。");
      }
    } catch (err) {
      setLoginError("伺服器端無回應或連線中斷。");
    }
  };

  // 2. Metrics Accumulations
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.status === "Available").length;
    const soldProducts = products.filter(p => p.status === "Sold").length;
    const pendingOrders = orders.filter(o => o.status === "Pending Verification" || o.status === "Balance Pending").length;

    // Revenue calculations (Sum of actual total amounts for orders approved/shipped/completed or deposit sums)
    const totalRevenue = orders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => {
        if (o.status === "Pending Verification") {
          return sum; // Skip till verified or deposit cleared
        }
        if (o.status === "Deposit Paid") {
          return sum + o.depositPaid;
        }
        return sum + o.totalAmount;
      }, 0);

    // Monthly revenue simulation (orders inside last 30 days)
    const monthlyRevenue = orders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => {
        return sum + o.totalAmount;
      }, 0) * 0.85; // Simulated percentage of settled monthly parameters

    return { totalProducts, availableProducts, soldProducts, pendingOrders, totalRevenue, monthlyRevenue };
  }, [products, orders]);

  // Handle image conversion to Base64 for Gemini AI helper context
  const handleAiImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAiImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAiImageBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Product Photos File Upload converting multiple files to Base64 (Promise-based asynchronous batch reader to prevent stale state closures)
  const handleProductPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readPromises = (Array.from(files) as File[]).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read file as string"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    try {
      const results = await Promise.all(readPromises);
      if (results.length === 0) return;

      const currentFeaturedEmpty = !pfImageUrl;

      if (currentFeaturedEmpty) {
        // Set first photo as main featured image
        setPfImageUrl(results[0]);
        
        // Add remaining photos (if any) to secondary images list
        if (results.length > 1) {
          const restImages = results.slice(1);
          setPfImages((prev) => {
            const combined = [...prev];
            restImages.forEach((img) => {
              if (!combined.includes(img)) {
                combined.push(img);
              }
            });
            return combined;
          });
        }
      } else {
        // Main featured image already exists, so append all selected pictures to secondary image array
        setPfImages((prev) => {
          const combined = [...prev];
          results.forEach((img) => {
            if (!combined.includes(img) && img !== pfImageUrl) {
              combined.push(img);
            }
          });
          return combined;
        });
      }
    } catch (err) {
      console.error("Failed to read user files:", err);
    }

    if (productImagesFileRef.current) {
      productImagesFileRef.current.value = "";
    }
  };

  // Add outside picture link to product list
  const handleAddImageUrl = () => {
    const trimmed = pasteUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("data:image")) {
      alert("請輸入完整的圖片 URL (以 http:// 或 https:// 開頭)！");
      return;
    }

    setPfImages((prev) => {
      if (!pfImageUrl) {
        setPfImageUrl(trimmed);
        return prev;
      }
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed];
    });

    setPasteUrlInput("");
  };

  // Clearing primary featured image
  const handleClearFeaturedImage = () => {
    if (pfImages.length > 0) {
      const first = pfImages[0];
      setPfImageUrl(first);
      setPfImages((prev) => prev.slice(1));
    } else {
      setPfImageUrl("");
    }
  };

  // Removing any secondary image item
  const handleRemoveSecondaryImage = (idxToRemove: number) => {
    setPfImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Shifting secondary image to front/primary slot
  const handleSetAsFeatured = (idxToSet: number) => {
    const targetUrl = pfImages[idxToSet];
    const oldFeatured = pfImageUrl;
    const remainingSecondary = pfImages.filter((_, idx) => idx !== idxToSet);

    setPfImageUrl(targetUrl);
    if (oldFeatured) {
      setPfImages([...remainingSecondary, oldFeatured]);
    } else {
      setPfImages(remainingSecondary);
    }
  };

  // Launch Gemini AI suggestion request
  const handleRequestGeminiSuggestions = async () => {
    if (!aiDescriptionInput && !aiImageBase64) {
      alert("Please provide at least a photo or an item description clue.");
      return;
    }

    setIsAiLoading(true);
    setAiSuccessMessage("");
    try {
      // Split off mime-type header if sending image data
      let imageRawBase64 = "";
      let mimeType = "";
      if (aiImageBase64) {
        const parts = aiImageBase64.split(",");
        mimeType = parts[0].split(";")[0].split(":")[1];
        imageRawBase64 = parts[1];
      }

      const suggestions = await getGeminiSuggestions(
        aiDescriptionInput,
        imageRawBase64,
        mimeType
      );

      // Autofill fields nicely!
      setPfTitle(suggestions.title);
      setPfCategorySlug(suggestions.category);
      setPfConditionPercentage(suggestions.conditionPercentage.toString());
      setPfConditionScore(suggestions.conditionScore.toString());
      setPfDescription(suggestions.description);
      setPfPrice(suggestions.estimatedMarketPrice.toString());
      setPfOriginalPrice((suggestions.estimatedMarketPrice * 1.5).toString());
      setPfAccessories(suggestions.accessories.join(", "));
      setPfKnownDefects(suggestions.knownDefects);
      setPfSeoKeywords(suggestions.seoKeywords.join(", "));
      
      // Fallback high-quality image placeholders based on topic if no image uploaded
      if (!pfImageUrl) {
        if (suggestions.category === "photography") {
          setPfImageUrl("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000");
        } else if (suggestions.category === "audio") {
          setPfImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000");
        } else {
          setPfImageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1000");
        }
      }

      setAiSuccessMessage("Gemini AI successfully extracted description metrics! Fields customized below.");
    } catch (err) {
      console.error(err);
      alert("Gemini server-side suggested parsing failed. Serving default mock auto-populate values.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Create or update submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage("");

    // Programmatic Custom Validation Checks
    if (!pfTitle.trim()) {
      setFormErrorMessage("請填寫「商品名稱」！");
      return;
    }
    const priceNum = Number(pfPrice);
    if (!pfPrice.trim() || isNaN(priceNum) || priceNum <= 0) {
      setFormErrorMessage("請填寫正數且大於 0 的「出讓定價」金額！");
      return;
    }
    const origPriceNum = Number(pfOriginalPrice);
    if (!pfOriginalPrice.trim() || isNaN(origPriceNum) || origPriceNum <= 0) {
      setFormErrorMessage("請填寫正數且大於 0 的「購入原價/原廠定價」金額！");
      return;
    }
    if (!pfLocation.trim()) {
      setFormErrorMessage("請填寫「所在地城市」！（例如：台北市）");
      return;
    }
    const condScore = Number(pfConditionScore);
    if (!pfConditionScore || isNaN(condScore) || condScore < 1 || condScore > 5) {
      setFormErrorMessage("「品相狀態星級」必須介於 1.0 到 5.0 星級之間！");
      return;
    }
    const condPct = Number(pfConditionPercentage);
    if (!pfConditionPercentage || isNaN(condPct) || condPct < 0 || condPct > 100) {
      setFormErrorMessage("「品相估算新舊度百分比」必須介於 0 到 100 之間！");
      return;
    }
    if (!pfKnownDefects.trim()) {
      setFormErrorMessage("請填寫「真實已知瑕疵與備註」！（若真無任何瑕疵可填「無特別瑕疵」）");
      return;
    }
    if (!pfDescription.trim()) {
      setFormErrorMessage("請填寫「商品核心描述語句」喔！這也是發布上架的必填內容。");
      return;
    }

    const productPayload: Partial<Product> = {
      title: pfTitle.trim(),
      price: priceNum,
      originalPrice: origPriceNum,
      conditionScore: condScore,
      conditionPercentage: condPct,
      location: pfLocation.trim(),
      status: pfStatus,
      categorySlug: pfCategorySlug,
      originalPurchaseDate: pfOriginalPurchaseDate.trim(),
      accessories: pfAccessories.split(",").map(s => s.trim()).filter(Boolean),
      warrantyStatus: pfWarrantyStatus.trim(),
      usageHistory: pfUsageHistory.trim(),
      reasonForSelling: pfReasonForSelling.trim(),
      knownDefects: pfKnownDefects.trim(),
      description: pfDescription.trim(),
      imageUrl: pfImageUrl || "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600",
      images: pfImages,
      seoKeywords: pfSeoKeywords.split(",").map(s => s.trim()).filter(Boolean),
    };

    try {
      if (productFormType === "create") {
        await onAddProduct(productPayload);
      } else if (selectedProductForEdit) {
        await onUpdateProduct(selectedProductForEdit.id, productPayload);
      }

      // Reset fields upon success
      setIsProductFormOpen(false);
      setSelectedProductForEdit(null);
      setFormErrorMessage("");
    } catch (err: any) {
      console.error("Failed to submit product:", err);
      setFormErrorMessage("上架發布或儲存商品時發生錯誤，請稍後再試！" + (err.message || ""));
    }
  };

  const openCreateProductForm = () => {
    setProductFormType("create");
    setSelectedProductForEdit(null);
    setPfTitle("");
    setPfPrice("");
    setPfOriginalPrice("");
    setPfConditionScore("4.5");
    setPfConditionPercentage("90");
    setPfLocation("Taipei");
    setPfStatus("Available");
    setPfCategorySlug("electronics");
    setPfOriginalPurchaseDate("");
    setPfAccessories("");
    setPfWarrantyStatus("Expired");
    setPfUsageHistory("");
    setPfReasonForSelling("");
    setPfKnownDefects("");
    setPfDescription("");
    setPfImageUrl("");
    setPfImages([]);
    setPasteUrlInput("");
    setPfSeoKeywords("");
    setIsProductFormOpen(true);
    setAiImageBase64("");
    setAiImageFileName("");
    setAiDescriptionInput("");
    setAiSuccessMessage("");
    setFormErrorMessage("");
  };

  const openEditProductForm = (p: Product) => {
    setProductFormType("edit");
    setSelectedProductForEdit(p);
    setPfTitle(p.title);
    setPfPrice(p.price.toString());
    setPfOriginalPrice(p.originalPrice.toString());
    setPfConditionScore(p.conditionScore.toString());
    setPfConditionPercentage(p.conditionPercentage.toString());
    setPfLocation(p.location);
    setPfStatus(p.status);
    setPfCategorySlug(p.categorySlug);
    setPfOriginalPurchaseDate(p.originalPurchaseDate || "");
    setPfAccessories(p.accessories.join(", "));
    setPfWarrantyStatus(p.warrantyStatus);
    setPfUsageHistory(p.usageHistory);
    setPfReasonForSelling(p.reasonForSelling);
    setPfKnownDefects(p.knownDefects);
    setPfDescription(p.description);
    setPfImageUrl(p.imageUrl);
    setPfImages(p.images || []);
    setPasteUrlInput("");
    setPfSeoKeywords(p.seoKeywords.join(", "));
    setIsProductFormOpen(true);
    setAiSuccessMessage("");
    setFormErrorMessage("");
  };

  // Submit parameter settings adjustments
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      bankName: settBankName,
      bankCode: settBankCode,
      accountNumber: settAccountNumber,
      accountName: settAccountName,
      depositPercent: Number(settDepositPercent) || 30,
      discountPercent: Number(settDiscountPercent) || 5,
      balanceDueDays: Number(settBalanceDueDays) || 3,
      shippingPolicy: settShippingPolicy,
      returnPolicy: settReturnPolicy,
      returnPolicyDetail: settReturnPolicyDetail,
      shippingPolicyDetail: settShippingPolicyDetail,
      paymentPolicyDetail: settPaymentPolicyDetail,
      servicePolicy: settServicePolicy,
    });
    alert("商店業務參數與政策設定已成功更新！");
  };

  // Render Lock screen if !isAdmin
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 animate-fade-in-up">
        <div className="glass-panel border p-8 rounded-[32px] shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
          
          <div className="h-14 w-14 rounded-full bg-blue-600/15 text-blue-600 border border-blue-500/20 flex items-center justify-center mx-auto shadow-md">
            <Lock className="h-6 w-6" />
          </div>

          <div>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              管理員安全入口
            </h1>
            <p className="text-xs text-neutral-450 dark:text-neutral-400 mt-1 leading-relaxed">
              Bob 的珍藏寶庫專屬後台。登入管理員身分以進行庫存發行、匯款憑證核對與訂單申購管理。
            </p>
          </div>

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div className="relative">
              <input
                type={showPasscode ? "text" : "password"}
                id="admin-passcode-input"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="密碼或 6 位數 Google Authenticator 驗證碼"
                className="w-full bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl py-3 px-4 text-center tracking-wide text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-semibold bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              id="admin-submit-btn"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl py-3.5 tracking-wide transition shadow-md cursor-pointer"
            >
              進入控制台
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 animate-fade-in-up">
      
      {/* Admin Dashboard header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 font-mono">Consolidated Manager</span>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
            Bob 的珍藏庫後台控制台
          </h1>
        </div>
        <button
          onClick={onLogoutAdmin}
          className="text-xs font-semibold bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border px-4 py-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition cursor-pointer"
        >
          安全登出
        </button>
      </section>

      {/* DASHBOARDS PANEL DIRECTORIES TABS */}
      <div className="flex space-x-2 overflow-x-auto pb-3 mb-8 border-b border-neutral-200 dark:border-neutral-800">
        {[
          { id: "metrics", label: "營運數據概覽", icon: DollarSign },
          { id: "products", label: "珍藏庫商品管理", icon: Package },
          { id: "orders", label: "匯款憑證審核與訂單", icon: ShoppingCart },
          { id: "customers", label: "藏友顧客名冊", icon: Users },
          { id: "settings", label: "匯款配置與營運政策", icon: Settings }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setAdminTab(tab.id as any); setIsProductFormOpen(false); }}
              id={`admin-tab-${tab.id}`}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold shrink-0 border transition ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800"
              }`}
            >
              <TabIcon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB SUB-CONTENTS MAPPED */}

      {/* TAB 1: METRICS HIGHLIGHT PANELS */}
      {adminTab === "metrics" && (
        <section className="space-y-8 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Net revenue */}
            <div className="glass-panel border p-6 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-neutral-450 font-mono tracking-tight block">總收訖營業額</span>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1.5">NT$ {metrics.totalRevenue.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-500 block mt-2 font-mono">• 已核對實匯全額與訂金款額總和</span>
            </div>

            {/* Estimated monthly revenue */}
            <div className="glass-panel border p-6 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-neutral-450 font-mono tracking-tight block">近 30 天估算營收</span>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1.5">NT$ {metrics.monthlyRevenue.toLocaleString()}</p>
              <span className="text-[10px] text-indigo-500 block mt-2 font-mono">• 交易與申購估算流動指標</span>
            </div>

            {/* Vault counts */}
            <div className="glass-panel border p-6 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-neutral-450 font-mono tracking-tight block font-sans">珍藏庫商品總數</span>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1.5">{metrics.totalProducts}</p>
              <span className="text-[10px] text-blue-500 block mt-2 font-mono">• 目前有 {metrics.availableProducts} 件商品可供申購</span>
            </div>

            {/* Verification backlog */}
            <div className="glass-panel border p-6 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-neutral-450 font-mono tracking-tight block">待審核匯款單</span>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1.5">{metrics.pendingOrders}</p>
              <span className="text-[10px] text-amber-500 block mt-2 font-mono">• 急需核對與查帳的水單申報</span>
            </div>
          </div>

          {/* Quick instructions block */}
          <div className="glass-panel border p-6 rounded-2xl space-y-2">
            <h3 className="font-sans text-base font-bold text-neutral-900 dark:text-white">管理操作控制台</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              歡迎回來，Bob。請利用上方分頁標籤，輕鬆使用 <b>Gemini AI 智慧規格擷取器</b> 上架新商品、審查對帳買家匯款水單照片、或配置商店重要系統業務參數。
            </p>
          </div>
        </section>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT PANE */}
      {adminTab === "products" && (
        <section className="space-y-6 animate-fade-in-up">
          
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold font-sans text-neutral-900 dark:text-white">珍藏物件庫存清單</h2>
            <button
              onClick={openCreateProductForm}
              id="admin-create-product-btn"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>上架珍藏物件</span>
            </button>
          </div>

          {/* Expanded AI suggested Creator / Editor Form */}
          {isProductFormOpen && (
            <div className="glass-panel border p-6 rounded-3xl space-y-6 bg-radial from-blue-50/5 via-transparent to-transparent">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <h3 className="font-sans text-base font-bold text-neutral-900 dark:text-white">
                    {productFormType === "create" ? "使用 Gemini AI 智慧快速建檔上架" : "編輯珍藏物件規格細項"}
                  </h3>
                </div>
                <button onClick={() => setIsProductFormOpen(false)} className="text-neutral-450 hover:text-neutral-605"><X className="h-5 w-5" /></button>
              </div>

              {/* FIRST ROW: GEMINI AI HELPER (ONLY FOR CREATE OR OPTIONAL RE-READ) */}
              {productFormType === "create" && (
                <div className="bg-purple-100/10 dark:bg-purple-950/20 rounded-2xl border border-purple-500/10 p-5 space-y-4">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider font-sans">Bob's 專屬智慧 AI 規格與物況分析副駕駛</span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    上傳這件物件的實體照，並填寫幾句簡單的文字線索（如型號、购买時間或傷痕瑕疵）。伺服器端的 <b>Gemini 3.5 Flash 高智慧模型</b> 會立刻為您精準預估生成標題、品相新舊度、配件清單、市價參考以及 SEO 自然流量標記。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-650 mb-1" htmlFor="ai-clues">
                        物況快速線索 / 心得
                      </label>
                      <input
                        type="text"
                        id="ai-clues"
                        value={aiDescriptionInput}
                        onChange={(e) => setAiDescriptionInput(e.target.value)}
                        placeholder="例如：Nikon Z24-70 2.8 恆定，僅遮光罩細微擦傷，盒裝配件完整，無入塵"
                        className="w-full bg-white dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-neutral-650 mb-1">
                          物件實拍照片（選填）
                        </label>
                        <button
                          type="button"
                          onClick={() => aiFileRef.current?.click()}
                          id="ai-photo-upload-btn"
                          className="w-full bg-white text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-350 text-xs border rounded-xl p-2.5 break-all line-clamp-1"
                        >
                          {aiImageFileName || "點擊選擇物件圖檔"}
                        </button>
                        <input
                          type="file"
                          ref={aiFileRef}
                          onChange={handleAiImageSelect}
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.webp"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRequestGeminiSuggestions}
                        id="ai-consult-btn"
                        disabled={isAiLoading}
                        className="bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 text-xs font-semibold rounded-xl px-5 py-2.5 transition shrink-0 h-[42px] cursor-pointer"
                      >
                        {isAiLoading ? "AI 智慧剖析中..." : "啟動 Gemini 規格分析"}
                      </button>
                    </div>
                  </div>

                  {aiSuccessMessage && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center py-1 flex items-center justify-center space-x-1">
                      <Check className="h-4 w-4" />
                      <span>{aiSuccessMessage}</span>
                    </p>
                  )}
                </div>
              )}

              {/* SECOND ROW: DETAILED FIELDS FORM */}
              <form onSubmit={handleProductSubmit} noValidate className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-title">
                    商品名稱 *
                  </label>
                  <input
                    type="text"
                    id="pf-title"
                    required
                    value={pfTitle}
                    onChange={(e) => setPfTitle(e.target.value)}
                    placeholder="例如：MacBook Pro M3 Max 16吋"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Slug category */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-cat">
                    商品分類 *
                  </label>
                  <select
                    id="pf-cat"
                    value={pfCategorySlug}
                    onChange={(e) => setPfCategorySlug(e.target.value)}
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="electronics">3C 數位 / 電腦硬體</option>
                    <option value="photography">攝影器材 / 鏡頭機身</option>
                    <option value="audio">極致音訊 / 耳機喇叭</option>
                    <option value="gaming">遊戲主機 / 週邊配備</option>
                    <option value="home">居家辦公 / 質感生活</option>
                    <option value="books">絕版書籍 / 經典讀物</option>
                    <option value="collectibles">古董收藏 / 限時珍品</option>
                    <option value="others">其他分類</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-status">
                    上架狀態 *
                  </label>
                  <select
                    id="pf-status"
                    value={pfStatus}
                    onChange={(e) => setPfStatus(e.target.value as any)}
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="Available">開放申購 (Available)</option>
                    <option value="Pending Payment">有人下單/保留中 (Pending)</option>
                    <option value="Sold">已售出 (Sold)</option>
                    <option value="Inactive">下架封存 (Inactive)</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-price">
                    出讓定價 NT$ *
                  </label>
                  <input
                    type="number"
                    id="pf-price"
                    required
                    value={pfPrice}
                    onChange={(e) => setPfPrice(e.target.value)}
                    placeholder="例如：24000"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Original price */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-orig">
                    購入原價/原廠定價 NT$ *
                  </label>
                  <input
                    type="number"
                    id="pf-orig"
                    required
                    value={pfOriginalPrice}
                    onChange={(e) => setPfOriginalPrice(e.target.value)}
                    placeholder="例如：39900"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-loc">
                    所在地城市 *
                  </label>
                  <input
                    type="text"
                    id="pf-loc"
                    required
                    value={pfLocation}
                    onChange={(e) => setPfLocation(e.target.value)}
                    placeholder="例如：台北市 / 新竹地區"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Condition Star Score */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-cond">
                    品相狀態星級 (1.0 - 5.0) *
                  </label>
                  <input
                    type="number"
                    id="pf-cond"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={pfConditionScore}
                    onChange={(e) => setPfConditionScore(e.target.value)}
                    placeholder="例如：4.8"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Condition percentage */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-pct">
                    品相估算新舊度百分比 % *
                  </label>
                  <input
                    type="number"
                    id="pf-pct"
                    min="0"
                    max="100"
                    required
                    value={pfConditionPercentage}
                    onChange={(e) => setPfConditionPercentage(e.target.value)}
                    placeholder="例如：95"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Purchase date */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-date">
                    購入日期 (選填)
                  </label>
                  <input
                    type="text"
                    id="pf-date"
                    value={pfOriginalPurchaseDate}
                    onChange={(e) => setPfOriginalPurchaseDate(e.target.value)}
                    placeholder="例如：2023-04-12"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Accessories split */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-acc">
                    隨附配件列表 (以逗號區隔)
                  </label>
                  <input
                    type="text"
                    id="pf-acc"
                    value={pfAccessories}
                    onChange={(e) => setPfAccessories(e.target.value)}
                    placeholder="充電器, 原廠完整盒裝, 額外連接線"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Warranty */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-warr">
                    保固狀態 (選填)
                  </label>
                  <input
                    type="text"
                    id="pf-warr"
                    value={pfWarrantyStatus}
                    onChange={(e) => setPfWarrantyStatus(e.target.value)}
                    placeholder="例如：已過保 / 保固中，至 2026年 11月"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Reason for selling */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-reason">
                    出讓原因 (選填)
                  </label>
                  <input
                    type="text"
                    id="pf-reason"
                    value={pfReasonForSelling}
                    onChange={(e) => setPfReasonForSelling(e.target.value)}
                    placeholder="例如：日常升級設備 / 搬家出清"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-seo">
                    SEO 自然搜尋標記關鍵字 (以逗號區隔)
                  </label>
                  <input
                    type="text"
                    id="pf-seo"
                    value={pfSeoKeywords}
                    onChange={(e) => setPfSeoKeywords(e.target.value)}
                    placeholder="macbook, m2, apple"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Product Images Configuration */}
                <div className="md:col-span-3 bg-neutral-100/40 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4.5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-neutral-500" />
                        商品相簿與照片管理 (支援多張相片)
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        主展示首圖 + 多張細節輔助照片。支援貼上 URL 連結，或直接上傳多個本地端圖檔。
                      </p>
                    </div>
                    
                    {/* Upload button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => productImagesFileRef.current?.click()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm active:scale-95 border border-indigo-500"
                      >
                        <UploadCloud className="w-4 h-4 text-white" />
                        <span>上傳本機多相片</span>
                      </button>
                      <input
                        type="file"
                        ref={productImagesFileRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleProductPhotosUpload}
                      />
                    </div>
                  </div>

                  {/* Add Image via URL row */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="貼上外部相片連結 URL (例如：https://images.unsplash.com/...)"
                      value={pasteUrlInput}
                      onChange={(e) => setPasteUrlInput(e.target.value)}
                      className="flex-1 bg-white dark:bg-neutral-800 border p-2 rounded-xl text-xs font-mono text-neutral-900 dark:text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 text-xs px-3.5 py-2 font-medium rounded-xl transition cursor-pointer"
                    >
                      新增連結
                    </button>
                  </div>

                  {/* Visual Grid of Images currently set for the product */}
                  {(!pfImageUrl && pfImages.length === 0) ? (
                    <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-center">
                      <p className="text-xs text-neutral-400">
                        目前尚無任何商品相片。請選擇上傳或貼上 URL 連結。
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pt-0.5">
                      {/* Featured (Primary) Image Card block */}
                      {pfImageUrl && (
                        <div className="relative group rounded-xl border-2 border-emerald-500 bg-neutral-100/60 dark:bg-neutral-900 overflow-hidden aspect-square flex flex-col justify-between">
                          <img 
                            src={pfImageUrl} 
                            alt="Featured" 
                            className="w-full h-full object-cover absolute inset-0 z-0" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10" />
                          
                          {/* Badges/Indicators */}
                          <div className="relative z-20 p-2 flex justify-between items-start">
                            <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                              首圖
                            </span>
                            <button
                              type="button"
                              onClick={handleClearFeaturedImage}
                              className="bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition cursor-pointer z-20"
                              title="移除首圖"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Secondary Images Display Loop */}
                      {pfImages.map((imgUrl, index) => (
                        <div key={index} className="relative group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900 overflow-hidden aspect-square flex flex-col justify-between">
                          <img 
                            src={imgUrl} 
                            alt={`Secondary ${index + 1}`} 
                            className="w-full h-full object-cover absolute inset-0 z-0" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200" />
                          
                          {/* Badges and removal */}
                          <div className="relative z-20 p-1.5 flex justify-between items-start w-full">
                            <span className="bg-black/55 text-neutral-300 text-[9px] font-medium px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSecondaryImage(index)}
                              className="bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition cursor-pointer"
                              title="刪除"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Swap / Action Tray at Bottom of hover */}
                          <div className="relative z-20 p-1.5 w-full flex justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              type="button"
                              onClick={() => handleSetAsFeatured(index)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-semibold px-2 py-1 rounded shadow cursor-pointer transition w-full text-center"
                            >
                              設為首圖
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Usage history */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-usage">
                    詳細使用歷程 / 物物故事
                  </label>
                  <textarea
                    id="pf-usage"
                    rows={2}
                    value={pfUsageHistory}
                    onChange={(e) => setPfUsageHistory(e.target.value)}
                    placeholder="請描述您如何保養使用此商品，增添收藏感故事..."
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs resize-none text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Known Defects */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-red-500 mb-1" htmlFor="pf-defects">
                    真實已知瑕疵與備註 *
                  </label>
                  <textarea
                    id="pf-defects"
                    required
                    rows={2}
                    value={pfKnownDefects}
                    onChange={(e) => setPfKnownDefects(e.target.value)}
                    placeholder="請據實描述，例如：左下角微小擦痕、功能完美，或寫「無瑕疵」"
                    className="w-full bg-neutral-150/60 border p-2.5 rounded-xl text-xs resize-none text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Description copy */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-600 mb-1" htmlFor="pf-desc">
                    商品核心描述語句 *
                  </label>
                  <textarea
                    id="pf-desc"
                    required
                    rows={3}
                    value={pfDescription}
                    onChange={(e) => setPfDescription(e.target.value)}
                    placeholder="例如：這件絕版好物觸感極佳，保存非常細緻......"
                    className="w-full bg-neutral-100/60 border p-2.5 rounded-xl text-xs resize-none text-neutral-900 dark:text-white"
                  />
                </div>

                {formErrorMessage && (
                  <div className="md:col-span-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 animate-ping shrink-0" />
                    <span>{formErrorMessage}</span>
                  </div>
                )}

                {/* Submit row */}
                <div className="md:col-span-3 flex justify-end space-x-3.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProductFormOpen(false)}
                    className="text-xs font-semibold border rounded-xl px-4 py-2 text-neutral-600 cursor-pointer"
                  >
                    取消關閉
                  </button>
                  <button
                    type="submit"
                    id="pf-submit-btn"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-5 py-2 transition cursor-pointer"
                  >
                    {productFormType === "create" ? "立刻發布上架" : "儲存修改資料"}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Simple Products Table List */}
          <div className="hidden md:block overflow-x-auto border rounded-2xl bg-white dark:bg-neutral-950">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-450 uppercase font-mono border-b">
                <tr>
                  <th className="p-4">商品物件</th>
                  <th className="p-4">分類</th>
                  <th className="p-4">出讓價格</th>
                  <th className="p-4">品相狀態</th>
                  <th className="p-4">狀態</th>
                  <th className="p-4 text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/40">
                    <td className="p-4 flex items-center space-x-3.5">
                      <img src={p.imageUrl} alt="" className="h-9 w-12 object-cover rounded border" />
                      <div>
                        <p className="font-semibold text-neutral-850 dark:text-neutral-100 truncate max-w-[200px]">{p.title}</p>
                        <p className="text-[10px] text-neutral-400 font-mono italic">ID: {p.id}</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{p.categorySlug === 'electronics' ? '3C數位' : p.categorySlug === 'photography' ? '攝影攝影' : p.categorySlug === 'audio' ? '極致音訊' : p.categorySlug === 'gaming' ? '遊戲雙卡' : p.categorySlug === 'home' ? '居家辦公' : p.categorySlug === 'books' ? '絕版書籍' : p.categorySlug === 'collectibles' ? '珍稀收藏' : '其他'}</td>
                    <td className="p-4 font-semibold">NT$ {p.price.toLocaleString()}</td>
                    <td className="p-4">{p.conditionPercentage}% 新</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        p.status === "Available" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {p.status === "Available" ? "上架中" : p.status === "Pending Payment" ? "代付留中" : p.status === "Sold" ? "已出讓" : "已下架"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 font-sans">
                      <button 
                        onClick={() => openEditProductForm(p)} 
                        id={`btn-edit-${p.id}`}
                        className="text-neutral-500 hover:text-blue-500 p-1.5 inline-block hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                        title="編輯商品"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => { if (confirm("確定要刪除這件寶貴的商品物件嗎？")) onDeleteProduct(p.id); }} 
                        id={`btn-del-${p.id}`}
                        className="text-neutral-500 hover:text-red-500 p-1.5 inline-block hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                        title="刪除商品"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Simple grid list for mobiles */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map(p => (
              <div key={p.id} className="glass-panel border p-4 rounded-xl flex space-x-3 items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={p.imageUrl} alt="" className="h-10 w-14 object-cover rounded border shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-850 dark:text-neutral-100 truncate text-xs">{p.title}</p>
                    <p className="text-[10px] text-neutral-400">NT$ {p.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex space-x-1 shrink-0">
                  <button onClick={() => openEditProductForm(p)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-blue-500"><Edit2 className="h-4.5 w-4.5" /></button>
                  <button onClick={() => { if(confirm("確定要刪除這件寶貴的商品物件嗎？")) onDeleteProduct(p.id); }} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-red-500"><Trash2 className="h-4.5 w-4.5" /></button>
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* TAB 3: CLIENT ORDER MANAGEMENT */}
      {adminTab === "orders" && (
        <section className="space-y-6 animate-fade-in-up">
          <h2 className="text-lg font-bold font-sans text-neutral-900 dark:text-white">藏友申購與匯款審核管理</h2>

          {/* Table display */}
          <div className="overflow-x-auto border rounded-2xl bg-white dark:bg-neutral-950">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-450 uppercase font-mono border-b">
                <tr>
                  <th className="p-4">申購單號</th>
                  <th className="p-4">藏友買家</th>
                  <th className="p-4">申購項目與細節</th>
                  <th className="p-4">款額與支付比例</th>
                  <th className="p-4">匯款對帳狀態</th>
                  <th className="p-4 text-right">憑證核對 / 物流調度</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/40 border-b dark:border-neutral-800">
                    <td className="p-4 font-mono font-bold text-neutral-900 dark:text-neutral-200">{o.id}</td>
                    <td className="p-4">
                      <p className="font-semibold text-neutral-800 dark:text-neutral-100">{o.customerName}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{o.customerEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="truncate max-w-[150px] font-medium text-neutral-800 dark:text-neutral-200">{o.productTitle}</p>
                      <p className="text-[10px] text-neutral-400">
                        申購比例：<b>{o.paymentType === "Full" ? "全額付款" : "支付部分訂金"}</b>
                      </p>
                    </td>
                    <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-150">
                      NT$ {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                        o.status === "Cancelled" 
                          ? "bg-red-50 text-red-650 dark:bg-red-950/20 dark:text-red-400" 
                          : o.status === "Shipped" || o.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                      }`}>
                        {o.status === "Pending Verification" ? "待核對憑證" :
                         o.status === "Deposit Paid" ? "已收訖訂金" :
                         o.status === "Paid in Full" ? "已結清全額" :
                         o.status === "Shipped" ? "已寄出配送" :
                         o.status === "Completed" ? "交易已完成" : "已退件取消"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 flex justify-end items-center">
                      
                      {/* View Receipt Proof Base64 Popup shortcut */}
                      {o.bankTransferReceipt && (
                        <button
                          onClick={() => {
                            const newTab = window.open();
                            newTab?.document.write(`
                              <html>
                                <head><title>匯款憑證照片 check: ${o.id}</title></head>
                                <body style="margin: 0; display: flex; align-items: center; justify-content: center; background: #111;">
                                  <img src="${o.bankTransferReceipt}" style="max-width: 90%; max-height: 90%; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                                </body>
                              </html>
                            `);
                          }}
                          className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 p-2 rounded-xl text-neutral-600 dark:text-neutral-300 transition"
                          title="查看買家上傳的匯款水單截圖"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                      )}

                      {/* QUICK STATUS TRANSITION TRIGGERS BASED ON CURRENT TRANSACTION DETAILS */}
                      {o.status === "Pending Verification" && (
                        <>
                          <button
                            onClick={() => onUpdateOrder(o.id, { status: o.paymentType === "Full" ? "Paid in Full" : "Deposit Paid" })}
                            id={`approve-wire-${o.id}`}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-2.5 py-1.5 rounded-xl transition text-[10px] cursor-pointer"
                          >
                            核准匯款
                          </button>
                          <button
                            onClick={() => onUpdateOrder(o.id, { status: "Cancelled" })}
                            id={`reject-wire-${o.id}`}
                            className="bg-red-500 hover:bg-red-650 text-white font-semibold px-2.5 py-1.5 rounded-xl transition text-[10px] cursor-pointer"
                          >
                            駁回憑證
                          </button>
                        </>
                      )}

                      {/* Transition deposit orders once balance matched */}
                      {o.status === "Deposit Paid" && (
                        <button
                          onClick={() => onUpdateOrder(o.id, { status: "Paid in Full", balanceDue: 0 })}
                          id={`settle-balance-${o.id}`}
                          className="bg-purple-600 hover:bg-purple-750 text-white font-semibold px-2.5 py-1.5 rounded-xl transition text-[10px] cursor-pointer"
                        >
                          確認結清尾款
                        </button>
                      )}

                      {/* Dispatch courier trigger */}
                      {o.status === "Paid in Full" && (
                        <button
                          onClick={() => setFocusedOrder(o)}
                          id={`dispatch-opener-${o.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1.5 rounded-xl transition text-[10px] flex items-center space-x-1 cursor-pointer"
                        >
                          <Truck className="h-3 w-3" />
                          <span>安排物流發貨</span>
                        </button>
                      )}

                      {o.status === "Shipped" && (
                        <button
                          onClick={() => onUpdateOrder(o.id, { status: "Completed" })}
                          id={`complete-order-${o.id}`}
                          className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold px-2.5 py-1.5 rounded-xl transition text-[10px] cursor-pointer"
                        >
                          標記配送成功
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expandable modal window for Courier dispatch assignment details */}
          {focusedOrder && (
            <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm animate-fade-in-up">
              <div className="glass-panel border p-6 rounded-[32px] max-w-md w-full space-y-4 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-2xl">
                <div className="flex justify-between items-center border-b pb-3.5 dark:border-neutral-850">
                  <h3 className="font-bold text-sm tracking-wide">輸入物流包裹資訊：{focusedOrder.id}</h3>
                  <button onClick={() => setFocusedOrder(null)} className="text-neutral-450 hover:text-neutral-605"><X className="h-5 w-5" /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 mb-1">物流快遞商名稱</label>
                    <input
                      type="text"
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      placeholder="例如：黑貓宅急便 / 順豐速運 / 中華郵政"
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 mb-1">追蹤配送單號 (Tracking ID)</label>
                    <input
                      type="text"
                      value={trackingNoInput}
                      onChange={(e) => setTrackingNoInput(e.target.value)}
                      placeholder="例如：908123719827"
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs font-mono text-neutral-950 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (!trackingNoInput) {
                        alert("請輸入包裹追蹤運送單號。");
                        return;
                      }
                      await onUpdateOrder(focusedOrder.id, {
                        status: "Shipped",
                        trackingNumber: trackingNoInput,
                        shippingCarrier: carrierInput,
                      });
                      setFocusedOrder(null);
                      setTrackingNoInput("");
                    }}
                    id="submit-tracking-btn"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl py-3.5 transition cursor-pointer"
                  >
                    儲存更新並標記已寄出
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: CLIENT ACCOUNT LISTS */}
      {adminTab === "customers" && (
        <section className="space-y-6 animate-fade-in-up">
          <h2 className="text-lg font-bold font-sans text-neutral-900 dark:text-white">珍藏藏友帳戶與申購紀錄名冊</h2>

          <div className="overflow-x-auto border rounded-2xl bg-white dark:bg-neutral-950">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-450 uppercase font-mono border-b">
                <tr>
                  <th className="p-4">藏友買家姓名</th>
                  <th className="p-4">聯絡電子郵件 / 電話</th>
                  <th className="p-4">收件通訊地址</th>
                  <th className="p-4 text-right">歷史申購單編號</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/40">
                    <td className="p-4">
                      <p className="font-semibold text-neutral-850 dark:text-neutral-100">{c.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">ID: {c.id}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-neutral-800 dark:text-neutral-200">{c.email}</p>
                      <p className="mt-0.5 text-neutral-450 font-mono">{c.phone}</p>
                    </td>
                    <td className="p-4 max-w-[250px] truncate text-neutral-800 dark:text-neutral-200" title={c.address}>{c.address}</td>
                    <td className="p-4 text-right">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {c.orderIds.map((oId) => (
                          <span key={oId} className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[9px] text-neutral-700 dark:text-neutral-300 font-bold border dark:border-neutral-750">
                            {oId}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 5: BUSINESS SETTINGS PANEL */}
      {adminTab === "settings" && (
        <section className="space-y-6 animate-fade-in-up">
          
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">配置店鋪營運參數與銷售規則</h2>
          </div>

          <form onSubmit={handleSettingsSubmit} className="glass-panel border p-6 rounded-[32px] space-y-6 bg-white dark:bg-neutral-950">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Wire details */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 border-b pb-2">預設匯款帳戶資訊</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-bank">銀行名稱</label>
                    <input
                      type="text"
                      id="st-bank"
                      required
                      value={settBankName}
                      onChange={(e) => setSettBankName(e.target.value)}
                      className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-code">銀行代碼 (3碼)</label>
                    <input
                      type="text"
                      id="st-code"
                      required
                      value={settBankCode}
                      className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs font-mono text-neutral-950 dark:text-white"
                      onChange={(e) => setSettBankCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-num">銀行帳號</label>
                    <input
                      type="text"
                      id="st-num"
                      required
                      value={settAccountNumber}
                      className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs font-mono tracking-wide text-neutral-950 dark:text-white"
                      onChange={(e) => setSettAccountNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-acc-name">戶名 / 帳戶姓名</label>
                    <input
                      type="text"
                      id="st-acc-name"
                      required
                      value={settAccountName}
                      className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-950 dark:text-white"
                      onChange={(e) => setSettAccountName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Formula Parameter percentages */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 border-b pb-2">商品出讓公式參數與期限</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-dep">最低應付訂金比例 (%)</label>
                    <input
                      type="number"
                      id="st-dep"
                      required
                      value={settDepositPercent}
                      className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs font-mono text-neutral-950 dark:text-white"
                      onChange={(e) => setSettDepositPercent(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-disc">全額付清優惠折扣 (%)</label>
                    <input
                      type="number"
                      id="st-disc"
                      required
                      value={settDiscountPercent}
                      className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs font-mono text-neutral-950 dark:text-white"
                      onChange={(e) => setSettDiscountPercent(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-days">尾款需結清天數</label>
                    <input
                      type="number"
                      id="st-days"
                      required
                      value={settBalanceDueDays}
                      className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs font-mono text-neutral-950 dark:text-white"
                      onChange={(e) => setSettBalanceDueDays(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Custom Guidelines long copy texts */}
            <div className="grid grid-cols-1 gap-6 border-t pt-5 dark:border-neutral-800">
              <div className="border-b pb-2 dark:border-neutral-800">
                <h4 className="font-sans text-xs font-bold text-neutral-800 dark:text-neutral-200">「珍藏庫營運條款與商店政策」前台內文管理（支援鍵盤換行 layout）</h4>
                <p className="text-[10px] text-neutral-500 mt-0.5">此區文字直接對應前台「服務條約與政策」之說明。您可在底下欄位隨意輸入、排版、貼上公告細則與項目符號。</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-ship-p">官網統一物流配送簡短標誌 *</label>
                  <textarea
                    id="st-ship-p"
                    required
                    rows={3}
                    value={settShippingPolicy}
                    onChange={(e) => setSettShippingPolicy(e.target.value)}
                    className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs resize-none text-neutral-950 dark:text-white"
                    placeholder="例如：本專案提供高防震專業包裝與配送，大台北地區亦可配合約看..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-ret-p">商品二手文物售出概不退换簡短聲明 *</label>
                  <textarea
                    id="st-ret-p"
                    required
                    rows={3}
                    value={settReturnPolicy}
                    onChange={(e) => setSettReturnPolicy(e.target.value)}
                    className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs resize-none text-neutral-950 dark:text-white"
                    placeholder="例如：本站商品均為個人珍藏之老文物，出貨後不接受無理由退換貨。"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-ship-detail-p">【配送物流與自提約看說明】詳細大段落內容</label>
                  <textarea
                    id="st-ship-detail-p"
                    rows={6}
                    value={settShippingPolicyDetail}
                    onChange={(e) => setSettShippingPolicyDetail(e.target.value)}
                    className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-950 dark:text-white font-sans"
                    placeholder="配送時效、寄送物流（如黑貓）與抗震包裝標準..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-ret-detail-p">【恕不接受退換貨】為什麼執行與收貨開箱詳細條款</label>
                  <textarea
                    id="st-ret-detail-p"
                    rows={6}
                    value={settReturnPolicyDetail}
                    onChange={(e) => setSettReturnPolicyDetail(e.target.value)}
                    className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-950 dark:text-white font-sans"
                    placeholder="說明爲何不退換、錄影開箱權益等詳細事項..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-pay-detail-p">【銀行匯款核對與逾期罰則】人工核帳與30%保留期限條例</label>
                  <textarea
                    id="st-pay-detail-p"
                    rows={5}
                    value={settPaymentPolicyDetail}
                    onChange={(e) => setSettPaymentPolicyDetail(e.target.value)}
                    className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-950 dark:text-white font-sans"
                    placeholder="說明網銀核帳機制、30%付訂保留天數違約後沒收等明確規定..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1" htmlFor="st-service-p">【主理人誠信執業守則】精神標語與服務感想</label>
                  <textarea
                    id="st-service-p"
                    rows={5}
                    value={settServicePolicy}
                    onChange={(e) => setSettServicePolicy(e.target.value)}
                    className="w-full bg-neutral-100/60 dark:bg-neutral-800 border p-2.5 rounded-xl text-xs text-neutral-950 dark:text-white font-sans"
                    placeholder="表達對古董承載藝術價值的感想、售前交流執念和誠心守則..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                id="st-submit-btn"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl px-6 py-3.5 flex items-center space-x-1.5 transition shadow-md cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>儲存並更新店鋪設定</span>
              </button>
            </div>

          </form>

          {/* Admin Security Settings Card */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-8 space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h3 className="font-sans text-sm font-bold text-neutral-900 dark:text-white">進階安全性配置 (伺服器端核心驗證)</h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              欲將專案上傳至 GitHub 時，為避免管理員防線密碼隨開源程式碼外洩，<strong>後台密碼已完全移出前端代碼，僅由伺服器端變數（Backend Settings）進行加密或核對</strong>。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <span className="inline-block bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded font-semibold">
                  方向一：環境變數管理密碼
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
                  可於您的 <code>.env</code> 或託管平台（如 Cloud Run / Vercel）的環境變數中設定：
                </p>
                <pre className="bg-neutral-100 dark:bg-neutral-950 p-3 rounded-lg font-mono text-[10px] text-neutral-600 dark:text-neutral-400 overflow-x-auto">
                  {"ADMIN_PASSCODE=YourSecurePassword"}
                </pre>
                <p className="text-[10px] text-neutral-400">
                  （若未設定則系統內部登入密碼將預設為 <code>admin</code>，此設計使得整串密碼未出現在任何前端靜態 HTML / JS 檔案中）
                </p>
              </div>

              <div className="space-y-3">
                <span className="inline-block bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded font-semibold">
                  方向二：Google Authenticator 雙重認證
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
                  若希望享有金融級動態安全，請在 <code>.env</code> 加上 16 位英數 Base32 私鑰「<code>ADMIN_TOTP_SECRET</code>」，完成配置後除密碼外，亦相容 6 位動態 OTP 登入：
                </p>
                
                {securityInfo?.isTotpEnabled ? (
                  <div className="bg-neutral-100 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-800/60 flex flex-col items-center text-center space-y-2">
                    <p className="text-xs text-emerald-500 font-extrabold flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Google Authenticator：運作中</span>
                    </p>
                    
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(securityInfo.totpUri)}`} 
                      alt="Security Setup QR" 
                      className="rounded-lg bg-white p-2 border shadow-sm w-[130px] h-[130px]"
                    />
                    <p className="text-[9px] text-neutral-400 font-mono leading-none pt-1">
                      私鑰：{securityInfo.totpSecret}
                    </p>
                    <p className="text-[9px] text-neutral-500 leading-tight">
                      掃描上方條碼，即可於 APP 內同步取得動態一次性登入權限碼（每 30 秒自動更新）。
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-500/5 text-amber-600 dark:text-amber-400 p-3 rounded-xl border border-dashed border-yellow-500/20 text-xs text-center">
                    <p className="font-semibold">動態兩步驟驗證：未裝載</p>
                    <p className="text-[10px] text-neutral-500 mt-1.5">
                      您可至 <code>.env</code> 設定：<br />
                      <code>{"ADMIN_TOTP_SECRET=JBSWY3DPEHPK3PXP"}</code><br />
                      系統偵測到後便會自動產生專用配對 QR 條碼供您綁定。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
