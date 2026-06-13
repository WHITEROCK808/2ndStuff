import { Category, Product, SystemSettings, Order, Customer } from "../types";

const BASE_URL = "/api";
const READ_TIMEOUT_MS = 12_000;
const WRITE_TIMEOUT_MS = 30_000;

export interface StorageStatus {
  databaseFile: string;
  databaseBytes: number;
  backupCount: number;
  productCount: number;
  orderCount: number;
  customerCount: number;
  persistentVolumePath: string | null;
}

async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  timeoutMs = READ_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Request failed with ${res.status}`);
    return res.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("伺服器回應逾時，請稍後重試。");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function getCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${BASE_URL}/categories`);
}

export async function getProducts(): Promise<Product[]> {
  return fetchJson<Product[]>(`${BASE_URL}/products`);
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  }, WRITE_TIMEOUT_MS);
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  }, WRITE_TIMEOUT_MS);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = await fetchJson<{ success: boolean }>(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  }, WRITE_TIMEOUT_MS);
  return data.success;
}

export async function getSettings(): Promise<SystemSettings> {
  return fetchJson<SystemSettings>(`${BASE_URL}/settings`);
}

export async function updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
  return fetchJson<SystemSettings>(`${BASE_URL}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  }, WRITE_TIMEOUT_MS);
}

export async function getOrders(): Promise<Order[]> {
  return fetchJson<Order[]>(`${BASE_URL}/orders`);
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
  return fetchJson<Order>(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  }, WRITE_TIMEOUT_MS);
}

export async function updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
  return fetchJson<Order>(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  }, WRITE_TIMEOUT_MS);
}

export async function getCustomers(): Promise<Customer[]> {
  return fetchJson<Customer[]>(`${BASE_URL}/customers`);
}

export async function getStorageStatus(): Promise<StorageStatus> {
  return fetchJson<StorageStatus>(`${BASE_URL}/admin/storage`);
}

export async function downloadDatabaseBackup(): Promise<Blob> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), WRITE_TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE_URL}/admin/backup`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);
    return response.blob();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function restoreDatabaseBackup(
  backup: unknown,
): Promise<{ success: boolean; productCount: number; orderCount: number; customerCount: number }> {
  return fetchJson(`${BASE_URL}/admin/restore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backup),
  }, WRITE_TIMEOUT_MS);
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
  return fetchJson(`${BASE_URL}/gemini/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ descriptionInput, imageBase64, mimeType }),
  }, WRITE_TIMEOUT_MS);
}
