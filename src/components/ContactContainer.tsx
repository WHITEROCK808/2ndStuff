import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, Sparkles, CheckCircle } from "lucide-react";

export default function ContactContainer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("請檢視所有必填欄位。");
      return;
    }
    // Simulate direct secure forwarding
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
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
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5 select-all">tonicbov@gmail.com</p>
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
              </div>

              {/* Response window */}
              <div className="flex space-x-3.5 items-start">
                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <HelpCircle className="h-4.5 w-4.5" />
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
            <div className="flex items-center space-x-2 text-neutral-805 dark:text-neutral-100 font-semibold mb-1">
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
              <h3 className="font-sans text-lg font-bold text-neutral-900 dark:text-white">訊息已成功加密送出</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-405 leading-relaxed max-w-sm mx-auto">
                感謝您連繫 Bob，我們已成功收悉您的洽詢內容。Bob 會在最短時間內閱讀與核對，並寄送回信至您留下的 Email 信箱。
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-blue-600 hover:underline inline-block mt-2"
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="請輸入您的尊稱"
                    className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 mb-1" htmlFor="cnt-topic">
                  洽詢主旨
                </label>
                <select
                  id="cnt-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="請在此處描述您的具體需求與提問..."
                  className="w-full bg-neutral-150/50 dark:bg-neutral-800/40 border dark:border-neutral-700/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl py-3 flex items-center justify-center space-x-2 transition apple-button"
              >
                <Send className="h-3.5 w-3.5" />
                <span>送出加密洽詢信</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
