import { ShieldAlert, RefreshCw, Truck, Banknote, Sparkles } from "lucide-react";
import { SystemSettings } from "../types";

interface TermsContainerProps {
  settings: SystemSettings;
}

export default function TermsContainer({ settings }: TermsContainerProps) {
  // 1. Dynamic return policy fallback
  const defaultReturnDetail = `• 為什麼嚴格執行不退貨： Bob's Treasure Vault 是主理人 Bob 獨家微型收藏品轉讓站，每一件刊登品均為極其珍貴的私人藏品（包含限量的精密相機、高階發燒音響）。我們已為每項物件建立詳盡的多點檢測評分、真實缺損清單並提供原產序號。物件細節已極盡可能做到完全透明公開。
• 收貨與開箱權益保護： 經本站安全寄送（如黑貓宅急便或保價特急件）完成後，即正式移交物件保管人。建議您在收到物件包裹開箱時，進行全程不間斷「錄影開箱」，以維護您對運輸物流理賠之權益。`;

  // 2. Dynamic shipping policy fallback
  const defaultShippingDetail = `防撞出貨時效：匯款確認後 24 小時內最速安排
特約寄送方式：黑貓宅急便（超大件使用快遞保價特急車）
緩衝抗震級別：防靜電防潮自封包裝、雙層防撞海綿、五層厚紙箱`;

  // 3. Dynamic payment policy fallback
  const defaultPaymentDetail = `• 網銀匯款人工核帳： 當您上傳您的轉帳單據截圖後，Bob 會即刻排隊進入網銀日誌中核對。您的申購單狀態將於帳目款項落帳（國泰世華銀行戶）的當日，從「待核對」變更為「已付訂保留」或「已付清全額」。
• 付訂保留款逾期罰則： 若您申購時選用「付訂保留模式」（30% 訂金方案），此訂金將在 ${settings.balanceDueDays} 天內生效，本站將在此期間鎖定庫存、拒絕其他購買請求。若您未能在這 ${settings.balanceDueDays} 天內進一步付清剩餘 70% 尾款，系統將自動取消該筆交易，且已收取的 30% 訂金將做為排他性佔位補償恕不予退還。`;

  // 4. Dynamic service policy fallback
  const defaultServiceDetail = `再次感謝您光臨 Bob 的珍藏庫，我們看待古董與精良器材的流轉如同藝術品般赤誠。誠實透明的物況陳述、無懈可擊的物流防護及最貼心的售前交流，是我們始終不變的執念。`;

  const returnDetail = settings.returnPolicyDetail || defaultReturnDetail;
  const shippingDetail = settings.shippingPolicyDetail || defaultShippingDetail;
  const paymentDetail = settings.paymentPolicyDetail || defaultPaymentDetail;
  const serviceDetail = settings.servicePolicy || defaultServiceDetail;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 animate-fade-in-up">
      
      <section className="text-center mb-12">
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          珍藏庫營運條款與商店政策
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-sans text-sm mt-1.5 leading-relaxed">
          透明、誠實、安全的收藏交流指南。在申購支付前請務必詳閱。
        </p>
      </section>

      <div className="space-y-8">
        
        {/* 1. ABSOLUTE FINAL SALE DISCLOSURE (NO RETURNS POLICY) */}
        <div className="glass-panel border p-6 rounded-3xl bg-amber-500/5 border-amber-500/10 space-y-4">
          <div className="flex items-center space-x-3 text-amber-600">
            <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0" />
            <h2 className="font-sans text-lg font-bold">特約割愛品・恕不接受退換貨條約</h2>
          </div>

          <p className="text-xs text-neutral-650 dark:text-neutral-300 leading-relaxed font-sans font-semibold">
            " {settings.returnPolicy} "
          </p>

          <div className="border-t border-amber-500/15 pt-4 text-xs text-neutral-500 dark:text-neutral-400 space-y-2 leading-relaxed whitespace-pre-line font-sans">
            {returnDetail}
          </div>
        </div>

        {/* 2. SHIPPING & DISPATCH OPERATIONS */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 text-blue-500">
            <Truck className="h-6 w-6 text-blue-500 shrink-0" />
            <h2 className="font-sans text-lg font-bold">配送物流與自提約看安排</h2>
          </div>

          <p className="text-xs text-neutral-650 dark:text-neutral-300 leading-relaxed">
            {settings.shippingPolicy}
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-xl border text-xs font-mono whitespace-pre-line leading-relaxed text-neutral-600 dark:text-neutral-400">
            {shippingDetail}
          </div>
        </div>

        {/* 3. WIRE MATCHING PROCEDURES */}
        <div className="glass-panel border p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 text-emerald-500">
            <Banknote className="h-6 w-6 text-emerald-500 shrink-0" />
            <h2 className="font-sans text-lg font-bold">銀行匯款核對與保留款項規則</h2>
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-3 leading-relaxed whitespace-pre-line font-sans">
            {paymentDetail}
          </div>
        </div>

        {/* 4. PRESERVATION STANDARD */}
        <div className="glass-panel border p-6 rounded-3xl bg-neutral-100/30 dark:bg-neutral-900/10 space-y-2">
          <div className="flex items-center space-x-2.5 text-neutral-805 dark:text-neutral-100 mb-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-sans text-base font-bold">主理人誠信執業守則</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line font-sans">
            {serviceDetail}
          </p>
        </div>

      </div>
    </div>
  );
}
