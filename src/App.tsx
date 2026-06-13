import { useState, useEffect } from "react";
import { X, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeContainer from "./components/HomeContainer";
import ProductDetailContainer from "./components/ProductDetailContainer";
import CheckoutContainer from "./components/CheckoutContainer";
import OrderStatusContainer from "./components/OrderStatusContainer";
import AdminContainer from "./components/AdminContainer";
import ContactContainer from "./components/ContactContainer";
import TermsContainer from "./components/TermsContainer";
import { Product, Category, SystemSettings, Order, Customer } from "./types";
import { 
  getProducts, getCategories, getOrders, getCustomers, getSettings,
  createProduct, updateProduct, deleteProduct, updateOrder, updateSettings, createOrder
} from "./lib/api";

const DEFAULT_FALLBACK_SETTINGS: SystemSettings = {
  bankName: "Cathay United Bank (國泰世華銀行)",
  bankCode: "013",
  accountNumber: "6995-1200-8847-1112",
  accountName: "LU CHEN-PO (BOB)",
  depositPercent: 30,
  discountPercent: 5,
  balanceDueDays: 3,
  shippingPolicy: "本專案提供高防震專業包裝與配送，大台北地區亦可配合約看...",
  returnPolicy: "本站商品均為個人珍藏之老文物，出貨後不接受無理由退換貨。",
  returnPolicyDetail: "",
  shippingPolicyDetail: "",
  paymentPolicyDetail: "",
  servicePolicy: ""
};

export default function App() {
  // Navigation Routing States
  const [currentView, setCurrentView] = useState<string>("home"); // home, detail, checkout, status, contact, terms, admin
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [checkoutPaymentType, setCheckoutPaymentType] = useState<"Full" | "Deposit">("Full");
  const [incomingSearchOrderId, setIncomingSearchOrderId] = useState<string>("");

  // Live Database Collection States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Client Favorites Watch List (localStorage, no login required)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("fav_vault_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isFavDrawerOpen, setIsFavDrawerOpen] = useState(false);

  // Admin access is backed by a signed, HttpOnly server session cookie.
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Pull only the data needed for the public storefront.
  const syncPublicData = async () => {
    try {
      const [prodData, catData, orderData, settData] = await Promise.all([
        getProducts().catch((e) => { console.error("Error fetching products:", e); return []; }),
        getCategories().catch((e) => { console.error("Error fetching categories:", e); return []; }),
        getOrders().catch((e) => { console.error("Error fetching orders:", e); return []; }),
        getSettings().catch((e) => { console.error("Error fetching settings:", e); return null; }),
      ]);
      setProducts(prodData || []);
      setCategories(catData || []);
      setOrders(orderData || []);
      setSettings(settData || DEFAULT_FALLBACK_SETTINGS);
    } catch (error) {
      console.error("Database connection syncing failed:", error);
      setSettings(DEFAULT_FALLBACK_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  const syncAdminData = async () => {
    const [orderData, customerData] = await Promise.all([
      getOrders().catch((e) => { console.error("Error fetching admin orders:", e); return []; }),
      getCustomers().catch((e) => { console.error("Error fetching customers:", e); return []; }),
    ]);
    setOrders(orderData || []);
    setCustomers(customerData || []);
  };

  useEffect(() => {
    syncPublicData();
  }, []);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        const authenticated = data.authenticated === true;
        setIsAdminAuthenticated(authenticated);
        if (authenticated) {
          sessionStorage.setItem("admin_vault_auth", "true");
          void syncAdminData();
        } else {
          sessionStorage.removeItem("admin_vault_auth");
        }
      })
      .catch(() => {
        setIsAdminAuthenticated(false);
        sessionStorage.removeItem("admin_vault_auth");
      });
  }, []);

  // Sync favorites back to local storage
  useEffect(() => {
    localStorage.setItem("fav_vault_items", JSON.stringify(favorites));
  }, [favorites]);

  // Navigate utility helpers
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    handleNavigate("detail");
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleInitiateCheckout = (productId: string, paymentType: "Full" | "Deposit") => {
    setSelectedProductId(productId);
    setCheckoutPaymentType(paymentType);
    handleNavigate("checkout");
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem("admin_vault_auth", "true");
    void syncAdminData();
  };

  const handleAdminLogout = () => {
    void fetch("/api/admin/logout", { method: "POST" });
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("admin_vault_auth");
    handleNavigate("home");
  };

  // Create Product Handler
  const handleAddProduct = async (pPayload: Partial<Product>) => {
    try {
      const createdProduct = await createProduct(pPayload);
      setProducts((current) => [...current, createdProduct]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Update Product Handler
  const handleUpdateProduct = async (id: string, pPayload: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct(id, pPayload);
      setProducts((current) =>
        current.map((product) => (product.id === id ? updatedProduct : product)),
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Update Order Status Handler
  const handleUpdateOrder = async (id: string, oPayload: Partial<Order>) => {
    try {
      await updateOrder(id, oPayload);
      await syncAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Update System Settings Coordinator
  const handleUpdateSettings = async (sPayload: Partial<SystemSettings>) => {
    try {
      const updated = await updateSettings(sPayload);
      setSettings(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Customer places order -> Creates order on Express -> Redirects to Order Status page of active tracking
  const handlePlaceOrderSubmit = async (orderData: {
    productId: string;
    paymentType: "Full" | "Deposit";
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    notes?: string;
    bankTransferReceipt?: string;
  }) => {
    try {
      const newOrderCreated = await createOrder(orderData);
      setIncomingSearchOrderId(newOrderCreated.id);
      setOrders((current) => [newOrderCreated, ...current]);
      handleNavigate("status");
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please inspect your bank details or contact Bob.");
    }
  };

  // Resolved reference models
  const activeProduct = selectedProductId 
    ? products.find((p) => p.id === selectedProductId) || null 
    : null;

  // Render Loading spinner
  if (isLoading || !settings) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] text-neutral-900 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600"></div>
        <p className="mt-4 text-xs font-mono tracking-widest uppercase text-neutral-450">Connecting Bob's Vault core...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
      
      {/* GLOBAL NAVBAR HEADER */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdmin={isAdminAuthenticated}
        onLogoutAdmin={handleAdminLogout}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavDrawerOpen(true)}
      />

      {/* CORE ROUTING VIEWS CHASSIS */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME CATALOGUE SIGHT */}
        {currentView === "home" && (
          <HomeContainer
            products={products}
            categories={categories}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* VIEW 2: PRODUCT DESCRIPTION DETAIL SIGHT */}
        {currentView === "detail" && activeProduct && (
          <ProductDetailContainer
            product={activeProduct}
            settings={settings}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => handleNavigate("home")}
            onInitiateCheckout={handleInitiateCheckout}
          />
        )}

        {/* VIEW 3: CHECKOUT SIGHT */}
        {currentView === "checkout" && activeProduct && (
          <CheckoutContainer
            product={activeProduct}
            paymentType={checkoutPaymentType}
            settings={settings}
            onBack={() => handleNavigate("detail")}
            onSubmitOrder={handlePlaceOrderSubmit}
          />
        )}

        {/* VIEW 4: TRACK ORDER SIGHT */}
        {currentView === "status" && (
          <OrderStatusContainer
            orders={orders}
            settings={settings}
            incomingSearchId={incomingSearchOrderId}
          />
        )}

        {/* VIEW 5: CONTACT SIGHT */}
        {currentView === "contact" && (
          <ContactContainer />
        )}

        {/* VIEW 6: TERMS & POLICIES SIGHT */}
        {currentView === "terms" && (
          <TermsContainer settings={settings} />
        )}

        {/* VIEW 7: ADMINISTRATOR CONTROL PANE */}
        {currentView === "admin" && (
          <AdminContainer
            products={products}
            orders={orders}
            customers={customers}
            settings={settings}
            isAdmin={isAdminAuthenticated}
            onLoginAdmin={handleAdminLogin}
            onLogoutAdmin={handleAdminLogout}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrder={handleUpdateOrder}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

      </main>

      {/* GLOBAL DISCLAIMERS FOOTER */}
      <Footer onNavigate={handleNavigate} />

      {/* SLIDE-OUT FAVORITES watch panel drawer */}
      {isFavDrawerOpen && (
        <div className="fixed inset-0 z-55 flex justify-end bg-black/45 backdrop-blur-xs animate-fade-in-up">
          {/* Backdrop trigger */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsFavDrawerOpen(false)}></div>
          
          <div className="h-full w-full max-w-sm bg-white dark:bg-neutral-900 shadow-2xl p-6 flex flex-col justify-between border-l dark:border-neutral-800">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200">
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  <h3 className="font-bold font-sans text-sm tracking-wide">My Saved Treasures</h3>
                </div>
                <button onClick={() => setIsFavDrawerOpen(false)} className="text-neutral-450 hover:text-neutral-605"><X className="h-5 w-5" /></button>
              </div>

              {/* Favorites list display */}
              <div className="space-y-4 overflow-y-auto max-h-[70vh] safari-scroller">
                {favorites.length === 0 ? (
                  <div className="text-center py-12 text-xs text-neutral-450">
                    <p>Your saved vault wishlist is empty.</p>
                    <p className="mt-1">Tap hearts on cards to bookmark favorites.</p>
                  </div>
                ) : (
                  favorites.map((favId) => {
                    const matchedP = products.find((p) => p.id === favId);
                    if (!matchedP) return null;
                    return (
                      <div 
                        key={favId} 
                        onClick={() => { handleSelectProduct(favId); setIsFavDrawerOpen(false); }}
                        className="flex space-x-3 p-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl cursor-pointer transition border border-neutral-100 dark:border-neutral-750"
                      >
                        <img src={matchedP.imageUrl} alt="" className="h-10 w-14 object-cover rounded border" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{matchedP.title}</p>
                          <p className="text-[10px] text-neutral-450 mt-0.5">NT$ {matchedP.price.toLocaleString()} • {matchedP.location}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Close buttons */}
            <button
              onClick={() => setIsFavDrawerOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl py-3 transition shadow-md"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
