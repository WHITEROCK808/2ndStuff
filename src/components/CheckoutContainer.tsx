import React, { useState, useRef } from "react";
import { ArrowLeft, Landmark, UploadCloud, FileText, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { Product, SystemSettings } from "../types";

interface CheckoutContainerProps {
  product: Product;
  paymentType: "Full" | "Deposit";
  settings: SystemSettings;
  onBack: () => void;
  onSubmitOrder: (orderData: {
    productId: string;
    paymentType: "Full" | "Deposit";
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    notes?: string;
    bankTransferReceipt?: string;
  }) => Promise<void>;
}

export default function CheckoutContainer({
  product,
  paymentType,
  settings,
  onBack,
  onSubmitOrder,
}: CheckoutContainerProps) {
  // Recipient details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Payment proof details
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [receiptBase64, setReceiptBase64] = useState<string>("");
  const [receiptFileName, setReceiptFileName] = useState("");
  const [receiptFileType, setReceiptFileType] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pricing calculations
  const discountPercent = settings.discountPercent || 5;
  const payInFullDiscount = Math.round(product.price * (discountPercent / 100));
  const payInFullPrice = product.price - payInFullDiscount;

  const depositPercent = settings.depositPercent || 30;
  const payDepositValue = Math.round(product.price * (depositPercent / 100));
  const remainingPercent = 100 - depositPercent;
  const remainingBalanceValue = product.price - payDepositValue;

  const totalToPayNow = paymentType === "Full" ? payInFullPrice : payDepositValue;

  // File Upload Logic (converts to base64)
  const processReceiptFile = (file: File) => {
    setUploadError("");
    
    // File validation specifications: Max 10MB, Accepted JPG/PNG/PDF
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a JPG, PNG, or PDF file.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError("File exceeds the maximum 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setReceiptBase64(reader.result);
        setReceiptFileName(file.name);
        setReceiptFileType(file.type);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to convert image. Please select another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processReceiptFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processReceiptFile(e.target.files[0]);
    }
  };

  // Submission handler
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check validation attributes
    if (!customerName || !customerPhone || !customerEmail || !shippingAddress) {
      alert("Please complete all required fields.");
      return;
    }

    if (!receiptBase64) {
      alert("Please upload your bank transfer receipt to complete checkout.");
      return;
    }

    if (!isPolicyAccepted) {
      alert("You must agree to Bob's second-hand final sale policy prior to checking out.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        productId: product.id,
        paymentType,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        notes,
        bankTransferReceipt: receiptBase64,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit receipt verification. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in-up">
      {/* Back to detail button */}
      <button
        onClick={onBack}
        id="checkout-back-button"
        className="flex items-center space-x-2 text-sm font-medium text-neutral-500 hover:text-blue-500 transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回商品詳情頁面</span>
      </button>

      <section className="text-center mb-10">
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          安全直接結帳
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-sans text-sm mt-1.5 md:w-3/5 mx-auto leading-relaxed">
          請按照簡單的步驟申購此款精選商品。匯款完成後，請於下方填妥資料並上傳轉帳證明。
        </p>
      </section>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT: Forms (8/12 layout) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Step 1: Contact details */}
          <div className="glass-panel border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">1. 收件資料與聯絡方式</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="input-name">
                  真實姓名 *
                </label>
                <input
                  type="text"
                  id="input-name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="請輸入收件人姓名"
                  className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="input-phone">
                    電話號碼 *
                  </label>
                  <input
                    type="tel"
                    id="input-phone"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="例如: 0912345678"
                    className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="input-email">
                    電子郵件 *
                  </label>
                  <input
                    type="email"
                    id="input-email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john.doe@gmail.com"
                    className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="input-address">
                  收件地址 *
                </label>
                <textarea
                  id="input-address"
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="請輸入完整的寄送路段、巷弄、市區及郵遞區號..."
                  className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="input-notes">
                  給 Bob 的備註事項 (選填)
                </label>
                <textarea
                  id="input-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="例如：大樓管理室代收、樓層、或特定配送時間說明..."
                  className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Bank Coordinates Instructions */}
          <div className="glass-panel border p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">2. 銀行匯款帳號</h3>
            </div>
            
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-1">
              請匯款 <b>NT$ {totalToPayNow.toLocaleString()}</b> 至下方指定帳戶。匯款完成後於下方上傳轉帳證明，Bob 將進行人工對帳確認。
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-900 border rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                <span className="text-neutral-400">收款銀行：</span>
                <span className="font-semibold text-neutral-800 dark:text-white">{settings.bankName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                <span className="text-neutral-400">銀行代碼：</span>
                <span className="font-semibold text-neutral-800 dark:text-white px-2 py-0.5 bg-neutral-200/50 dark:bg-neutral-800 rounded">{settings.bankCode}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                <span className="text-neutral-400">匯款帳號：</span>
                <span className="font-semibold text-neutral-800 dark:text-white tracking-widest">{settings.accountNumber}</span>
              </div>
              <div className="flex justify-between pb-0.5">
                <span className="text-neutral-400">戶名：</span>
                <span className="font-semibold text-neutral-800 dark:text-white uppercase">{settings.accountName}</span>
              </div>
            </div>
          </div>

          {/* Step 3: Receipt upload */}
          <div className="glass-panel border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">3. 上傳轉帳匯款證明</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              請上傳您的 ATM 轉帳憑單、網路網銀轉帳截圖 (JPG, PNG) 或 PDF 證明文件。檔案大小限制 <b>10MB</b>。
            </p>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              id="receipt-dropzone"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />

              {receiptBase64 ? (
                <div className="space-y-2">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{receiptFileName}</p>
                  <p className="text-[10px] text-neutral-400 capitalize font-mono">檔案類型: {receiptFileType}</p>
                  <p onClick={(e) => { e.stopPropagation(); setReceiptBase64(""); }} className="text-[11px] font-semibold text-red-500 hover:underline cursor-pointer">
                    重新更換憑證
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="h-10 w-10 text-neutral-455 mx-auto animate-bounce" />
                  <p className="text-xs font-semibold text-neutral-750 dark:text-neutral-200">
                    拖曳檔案至此處，或點擊瀏覽檔案
                  </p>
                  <p className="text-[10px] text-neutral-400">支援 JPG, PNG, PDF 格式，最高 10MB</p>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 font-medium text-center flex items-center justify-center space-x-1.5 bg-red-500/5 p-2 rounded-lg border border-red-505/10">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: Summary Card (4/12 layout) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Order Summary Specs */}
          <div className="glass-panel border p-5 rounded-2xl space-y-4">
            <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">商品申購清單</h3>

            {/* Micro product card */}
            <div className="flex space-x-3 pb-4 border-b border-neutral-150 dark:border-neutral-805/80">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-12 w-16 object-cover rounded-md border border-neutral-200 dark:border-neutral-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{product.title}</p>
                <p className="text-[10px] font-mono text-neutral-450 uppercase">
                  {product.categorySlug === "electronics" ? "電子科技" :
                   product.categorySlug === "photography" ? "相機攝影" :
                   product.categorySlug === "audio" ? "高級音響" :
                   product.categorySlug === "gaming" ? "電玩娛樂" :
                   product.categorySlug === "home" ? "辦公居家" :
                   product.categorySlug === "books" ? "人文經典" :
                   product.categorySlug === "collectibles" ? "限量收藏" :
                   product.categorySlug === "others" ? "其他私藏" : product.categorySlug} • {product.location === "Taipei" ? "台北市" : product.location === "New Taipei City" ? "新北市" : product.location === "Hsinchu" ? "新竹市" : product.location === "Taichung" ? "台中市" : product.location}
                </p>
              </div>
            </div>

            {/* Calculations items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>割愛定價：</span>
                <span className="font-mono text-neutral-850 dark:text-neutral-100">NT$ {product.price.toLocaleString()}</span>
              </div>

              {paymentType === "Full" ? (
                <>
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>全額直購優惠 ({discountPercent}%):</span>
                    <span>- NT$ {payInFullDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-150 dark:border-neutral-805/80 pt-2 text-sm font-bold">
                    <span>最終匯款實應付：</span>
                    <span className="font-mono">NT$ {payInFullPrice.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-neutral-400">
                    <span>支付訂金比例 ({depositPercent}%):</span>
                    <span className="font-mono text-neutral-850 dark:text-neutral-100">NT$ {payDepositValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>尾款應付比例 ({remainingPercent}%):</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400">NT$ {remainingBalanceValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-150 dark:border-neutral-805/80 pt-2 text-sm font-bold">
                    <span>商品直購總額：</span>
                    <span className="font-mono text-neutral-900 dark:text-white">NT$ {product.price.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Dynamic Apple-Wallet payment pill */}
            <div className="bg-neutral-100/60 dark:bg-neutral-800/40 rounded-xl p-3.5 border text-center font-sans">
              <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">今日應付實匯金額</p>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">NT$ {totalToPayNow.toLocaleString()}</p>
              <p className="text-[10px] text-neutral-450 mt-1">限定使用 ATM / 網銀銀行直接轉帳</p>
            </div>
          </div>

          {/* Refund Policy Checklist - MANDATORY FOR SITE WORKFLOW */}
          <div className="glass-panel border p-5 rounded-2xl bg-amber-500/5 border-amber-500/10 space-y-3.5">
            <div className="flex items-center space-x-2.5 text-amber-600">
              <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0" />
              <h4 className="font-sans text-xs font-bold uppercase tracking-wide">售出概不退換條款同意書</h4>
            </div>
            
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              本站所有物品皆為擁有者 100% 真實誠信披露其細節與新舊程度之個人一手或二手私藏品。請閱讀並核勾接受以下條款：
            </p>

            <label className="flex items-start space-x-3 cursor-pointer select-none border-t border-amber-500/10 pt-3">
              <input
                type="checkbox"
                required
                id="policy-accept-checkbox"
                checked={isPolicyAccepted}
                onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                className="mt-0.5 h-4.5 w-4.5 accent-amber-500 rounded cursor-pointer"
              />
              <span className="text-[11px] text-neutral-600 dark:text-neutral-350 leading-relaxed font-semibold">
                本人確認申購項目為二手割愛商品。特此同意且遵守「售出概不接受退貨、換貨、退款」條款，出貨時會自行查收物流單號以供追蹤。
              </span>
            </label>
          </div>

          {/* Final Purchase Action */}
          <button
            type="submit"
            disabled={isSubmitting || !isPolicyAccepted || !receiptBase64}
            id="btn-checkout-submit"
            className={`w-full text-center text-sm font-semibold rounded-2xl py-3.5 transition flex items-center justify-center space-x-2 shadow-lg ${
              isPolicyAccepted && receiptBase64 && !isSubmitting
                ? "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700 cursor-pointer"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border border-neutral-300 dark:border-neutral-700 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span>正在提交核款證明申請中...</span>
            ) : (
              <span>送出訂單並提交核款證明</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
