import React, { useState, useMemo } from "react";
import { Search, MapPin, Calendar, CreditCard, ClipboardCheck, ArrowRight, Truck, PackageCheck, ReceiptText, ShieldAlert } from "lucide-react";
import { Order, SystemSettings } from "../types";

interface OrderStatusContainerProps {
  orders: Order[];
  settings: SystemSettings;
  incomingSearchId?: string; // If redirected from checking out
}

export default function OrderStatusContainer({
  orders,
  settings,
  incomingSearchId = "",
}: OrderStatusContainerProps) {
  const [searchId, setSearchId] = useState(incomingSearchId);
  const [searched, setSearched] = useState(incomingSearchId !== "");

  // Search local orders array for matched ID
  const matchedOrder = useMemo(() => {
    if (!searchId) return null;
    return orders.find(
      (o) => o.id.toLowerCase().trim() === searchId.toLowerCase().trim()
    ) || null;
  }, [orders, searchId]);

  // Order status progression bars array
  const stepsList = [
    "Pending Verification",
    "Deposit Paid",
    "Balance Pending",
    "Paid in Full",
    "Ready To Ship",
    "Shipped",
    "Completed",
  ];

  const currentStepIndex = matchedOrder 
    ? stepsList.indexOf(matchedOrder.status) 
    : -1;

  const mapStatusToChinese = (status: string) => {
    switch (status) {
      case "Pending Verification": return "待核對款項";
      case "Deposit Paid": return "已付訂金保留";
      case "Balance Pending": return "等待支付尾款";
      case "Paid in Full": return "已付清全額";
      case "Ready To Ship": return "已防撞包裝/待出貨";
      case "Shipped": return "已出貨寄送中";
      case "Completed": return "交易完成";
      default: return status;
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 animate-fade-in-up">
      <section className="text-center mb-10">
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          追蹤您的申購訂單
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-sans text-sm mt-1.5 leading-relaxed">
          請輸入您的 <b>ORD-XXXXXX</b> 申購單號，以追蹤人工對帳、預控保留、尾款付清及物流出貨進度。
        </p>
      </section>

      {/* 1. Tracking Lookup Form */}
      <form onSubmit={handleLookup} className="glass-panel border p-5 rounded-2xl shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              id="order-lookup-input"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setSearched(false);
              }}
              placeholder="請輸入訂單編號 (例如：ORD-928172)"
              className="w-full bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl py-3 pl-11 pr-4 text-sm font-mono tracking-widest text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-blue-500 transition uppercase"
            />
          </div>
          <button
            type="submit"
            id="order-lookup-search-btn"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl py-3.5 px-6 shrink-0 transition cursor-pointer"
          >
            查詢申購進度
          </button>
        </div>
      </form>

      {/* 2. Lookup Results Display */}
      {searched && (
        <div className="animate-fade-in-up">
          {matchedOrder ? (
            <div className="space-y-8">
              
              {/* PRIMARY HIGHLIGHT CARD */}
              <div className="glass-panel border rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* Header metrics */}
                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-neutral-150 dark:border-neutral-805/80 pb-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-500 font-mono tracking-wider">
                      安全對帳交易單
                    </span>
                    <h2 className="text-xl font-mono font-bold text-neutral-900 dark:text-white mt-1">
                      {matchedOrder.id}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      申購成立時間：{new Date(matchedOrder.createdAt).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-neutral-450 dark:text-neutral-500 block font-mono">
                      當前交易狀態
                    </span>
                    <span className="inline-block rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3.5 py-1 text-xs font-semibold mt-1">
                      {mapStatusToChinese(matchedOrder.status)}
                    </span>
                  </div>
                </div>

                {/* VISUAL PIPELINE PROGRESS TIMELINE */}
                <div className="py-4">
                  <div className="flex justify-between items-center relative">
                    {/* Background track */}
                    <div className="absolute left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-800 -z-10 rounded-full"></div>
                    
                    {/* Active highlighted track */}
                    {currentStepIndex !== -1 && (
                      <div 
                        className="absolute left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 -z-10 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStepIndex / (stepsList.length - 1)) * 100}%` }}
                      ></div>
                    )}

                    {/* Progress checkpoints (icon nodes) */}
                    {[
                      { icon: ReceiptText, label: "提交憑證" },
                      { icon: CreditCard, label: "已核准" },
                      { icon: Truck, label: "發貨配送" },
                      { icon: PackageCheck, label: "簽收完成" }
                    ].map((step, idx) => {
                      // Map check index thresholds
                      const associatedStatusIndex = [0, 1, 5, 6][idx];
                      const isDone = currentStepIndex >= associatedStatusIndex;
                      const StepIcon = step.icon;

                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition duration-300 ${
                            isDone 
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                              : "bg-white border-neutral-300 text-neutral-455 dark:bg-neutral-900 dark:border-neutral-700"
                          }`}>
                            <StepIcon className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 mt-2 font-sans text-center max-w-[70px]">
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RECEIPT / LEDGER SPECS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-neutral-150 dark:border-neutral-805/80 py-5">
                  <div className="space-y-3 text-xs">
                    <p className="font-semibold text-neutral-800 dark:text-neutral-250 font-sans">收件人聯絡與寄送資料</p>
                    <p className="text-neutral-500 leading-relaxed">
                      <b>收件姓名：</b> {matchedOrder.customerName}<br />
                      <b>電話號碼：</b> {matchedOrder.customerPhone}<br />
                      <b>寄送地址：</b> {matchedOrder.shippingAddress}
                    </p>
                    {matchedOrder.notes && (
                      <p className="text-neutral-450 bg-neutral-100/40 p-2.5 rounded-lg border text-[11px] leading-relaxed italic">
                        " {matchedOrder.notes} "
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="font-semibold text-neutral-805 dark:text-neutral-250 font-sans">交易款項與帳目明細</p>
                    <div className="space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">商品定價：</span>
                        <span>NT$ {matchedOrder.productPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">支付方案：</span>
                        <span>{matchedOrder.paymentType === "Full" ? "全額直購" : "付訂保留模式"}</span>
                      </div>
                      
                      {matchedOrder.paymentType === "Full" ? (
                        <div className="flex justify-between text-emerald-500">
                          <span>全額直購立減優惠：</span>
                          <span>- NT$ {matchedOrder.discountApplied.toLocaleString()}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between text-neutral-400">
                            <span>已付 30% 訂金：</span>
                            <span className="text-emerald-500">NT$ {matchedOrder.depositPaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>應付 70% 尾款：</span>
                            <span className="text-purple-600 font-semibold">NT$ {matchedOrder.balanceDue.toLocaleString()}</span>
                          </div>
                          {matchedOrder.dueDate && (
                            <div className="flex justify-between text-[10px] text-amber-500 border-t border-neutral-100 border-dashed pt-1">
                              <span>尾款付清截止日：</span>
                              <span>{new Date(matchedOrder.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-800 pt-2 font-bold text-sm text-neutral-900 dark:text-white">
                        <span>實收匯款金額：</span>
                        <span>NT$ {matchedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRACKING DISPATCH LEDGER */}
                <div className="bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
                  <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-300">
                    <Truck className="h-5 w-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="font-sans font-semibold">物流與寄送明細</p>
                      <p className="text-[11px] text-neutral-450 mt-0.5">
                        {matchedOrder.shippingCarrier 
                          ? `快遞公司: ${matchedOrder.shippingCarrier}` 
                          : "物件正在進行防撞氣泡紙裝箱中"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-neutral-400 block sm:text-right">物流追蹤單號</p>
                    <p className="font-bold text-neutral-800 dark:text-white mt-0.5 leading-none sm:text-right">
                      {matchedOrder.trackingNumber || "請等待 Bob 出貨後同步載入"}
                    </p>
                  </div>
                </div>

              </div>
              
              {/* FINAL BANK CLEARANCE FOOTNOTE */}
              <div className="glass-panel border p-5 rounded-2xl bg-amber-500/5 border-amber-500/10 flex space-x-3 text-xs leading-relaxed">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-white">還在等待尾款審核確認嗎？</p>
                  <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                    如果您是採用「付訂保留模式」，請務必記得在截止日前將尾款金額 <b>NT$ {matchedOrder.balanceDue.toLocaleString()}</b> 直接轉帳至系统公告的帳號。匯款完成後，請至【聯繫我們】提供您的單號與後五碼，Bob 將在對帳後即刻安排出貨。
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 bg-neutral-100 dark:bg-neutral-900/40 rounded-[24px] border border-dashed border-neutral-300 dark:border-neutral-800 animate-fade-in-up">
              <p className="text-neutral-500 dark:text-neutral-400 font-light mb-2">無法找到對應的訂購憑證或申購資料。</p>
              <p className="text-xs text-neutral-400">請仔細核對您輸入的 <b>ORD-XXXXXX</b> 訂單編號是否正確，然後再試一次。</p>
            </div>
          )}
        </div>
      )}

      {/* QUICK INSTRUCTIONS FOOTER */}
      <div className="mt-12 text-center text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
        <p>
          如果在扣帳確認、物流分配或尾款付清流程中需要快速處理，歡迎隨時透過【聯繫我們】向 Bob 反映。
        </p>
      </div>

    </div>
  );
}
