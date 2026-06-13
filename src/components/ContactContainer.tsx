import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, Sparkles, CheckCircle, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react";

export default function ContactContainer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [testMailUrl, setTestMailUrl] = useState("");
  const [isTestMail, setIsTestMail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("請確實填寫所有必填欄位！");
      return;
    }

    setSendError("");
    setTestMailUrl("");
    setIsTestMail(false);
    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "伺服器在派發電子郵件時傳回錯誤。");
      }

      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        if (data.isTestAccount && data.testUrl) {
          setTestMailUrl(data.testUrl);
          setIsTestMail(true);
        }
        // Reset fields
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.warning || "發件失敗，請稍後重試。");
      }
    } catch (err: any) {
      console.error("Failed to dispatcher email:", err);
      setSendError(err.message || "無法連線至郵件發送服務，請確認伺服器連線狀態。");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in-up">
      
      <section className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 font-mono">主理人專屬信箱</span>
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-1.5">
          聯繫收藏家 Bob
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-sans text-sm mt-1.5 md:w-3/5 mx-auto leading-relaxed">
          對珍藏物件品相、配飾細節有任何疑問？或者極高單價器材需要相約在大台北捷運站面鑑與演示？請送出訊息至我們的加密對帳轉交信箱。
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* LEFT COMPONENT: Direct contact coordinate logs (5/12 layout) */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-panel border p-5 rounded-2xl space-y-5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">聯絡途徑</h3>
            
            <div className="space-y-4">
              {/* Mail */}
              <div className="flex space-x-3.5 items-start">
                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">直聯電子郵件</p>
                  <a 
                    href="mailto:tonicbov@gmail.com" 
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-350 font-mono mt-0.5 select-all hover:underline transition inline-flex items-center gap-1"
                    title="點擊直接發信聯絡 Bob"
                  >
                    tonicbov@gmail.com
                    <span className="text-[9px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-sans px-1.5 py-0.5 rounded-md ml-1 font-normal animate-pulse">
                      點擊直聯
                    </span>
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex space-x-3.5 items-start">
                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-650 dark:text-red-400">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">珍藏庫營運點</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    台灣台北市 大安區 / 信義區 
                  </p>
                </div>
                      <div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">預計回覆時效</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    2 - 3 小時內 (週一至週日 09:00 - 22:00 台北時間)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection meet terms */}
          <div className="glass-panel border p-5 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/60 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-2">
            <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-100 font-semibold mb-1">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>大台北地區面鑑約看說明</span>
            </div>
            <p>
              針對部分極高單價的收藏物件展示（例如價值超過 NT$ 50,000 元的 Leica 徠卡相機、Hi-End 高級精密音響），我們歡迎大台北地區藏友預約鑑賞。請透過表單聯繫預約在信義安和、大安捷運站或台北101周邊特約場地進行面鑑品評。
            </p>
          </div>
        </div>

        {/* RIGHT COMPONENT: Elegant input form (7/12 layout) */}
        <div className="md:col-span-7">
          {submitted ? (
            <div className="glass-panel border p-10 rounded-3xl text-center space-y-4 shadow-sm animate-fade-in-up">
              <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-lg font-bold text-neutral-900 dark:text-white">訊息已成功寄送出！</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-405 leading-relaxed max-w-sm mx-auto">
                我們已成功收悉您的洽詢內容。自動寄件伺服器已將您的詳細諮詢意向成功轉發至 Bob 的電子信箱（tonicbov@gmail.com）。Bob 將透過電郵為您親自解答。
              </p>

              {isTestMail && testMailUrl && (
                <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl text-left text-xs text-amber-850 dark:text-amber-300 space-y-2 mt-4">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>測試伺服器發信通知 (Ethereal Debug Mode)</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-amber-700/90 dark:text-amber-400/90">
                    目前系統未偵測到您的自訂 Gmail SMTP 安全設定，我們已自動為您啟用了沙盒測試，將電郵安全地派送出去了。您可以點選下方連結即時線上查看這封真實郵件的高畫質排版！
                  </p>
                  <a 
                    href={testMailUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 text-blue-650 dark:text-blue-400 hover:underline font-semibold mt-1"
                  >
                    <span>線上即時檢視真實測試信件</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <button
                onClick={() => {
                  setSubmitted(false);
                  setTestMailUrl("");
                  setIsTestMail(false);
                }}
                className="text-xs font-semibold text-blue-650 hover:underline inline-block mt-4"
              >
                傳送另一條洽詢訊息
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel border p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">私藏意向洽詢表單</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="cnt-name">
                    您的尊稱 *
                  </label>
                  <input
                    type="text"
                    id="cnt-name"
                    required
                    disabled={isSending}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="請輸入您的尊稱"
                    className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-55"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="cnt-email">
                    您的電子信箱 *
                  </label>
                  <input
                    type="email"
                    id="cnt-email"
                    required
                    disabled={isSending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-55"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="cnt-topic">
                  洽詢主旨
                </label>
                <select
                  id="cnt-topic"
                  disabled={isSending}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-55"
                >
                  <option value="general">一般珍藏諮詢</option>
                  <option value="product_question">特定物況細節詢問 / 圖檔索取</option>
                  <option value="meetup">特別約看 / 台北面鑑預約</option>
                  <option value="payment_help">銀行轉帳流程輔助說明</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="cnt-message">
                  洽詢留言內容 *
                </label>
                <textarea
                  id="cnt-message"
                  required
                  disabled={isSending}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="請在此處描述您的具體需求與提問..."
                  className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-55"
                />
              </div>

              {sendError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              <button
                type="submit"
                id="contact-submit-btn"
                disabled={isSending}
                className={`w-full text-white font-semibold text-xs rounded-xl py-3 flex items-center justify-center space-x-2 transition ${
                  isSending 
                    ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed opacity-75 animate-pulse" 
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>加密傳送發信中，請稍候...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>送出加密洽詢信</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
