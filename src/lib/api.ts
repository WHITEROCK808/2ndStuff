import { Category, Product, SystemSettings, Order, Customer } from "../types";

const BASE_URL = "/api";

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  const result = await res.json();
  return { ...product, id: result.id } as Product;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return { ...product, id } as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  const data = await res.json();
  return data.success;
}

export async function getSettings(): Promise<SystemSettings> {
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(orderData: {
  productId: string;
  paymentType: "Full" | "Deposit";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  notes?: string;
  bankTransferReceipt?: string;
}): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to submit order");
  return res.json();
}

export async function updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${BASE_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function getGeminiSuggestions(
  descriptionInput: string,
  imageBase64?: string,
  mimeType?: string
): Promise<{
  title: string;
  category: string;
  conditionPercentage: number;
  conditionScore: number;
  description: string;
  estimatedMarketPrice: number;
  seoKeywords: string[];
  accessories: string[];
  knownDefects: string;
}> {
  const res = await fetch(`${BASE_URL}/gemini/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ descriptionInput, imageBase64, mimeType }),
  });
  if (!res.ok) throw new Error("Failed to retrieve Gemini smart suggestions");
  return res.json();
}
