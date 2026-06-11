export type ProductCondition = number; // e.g. 95 representing 95% New

export type ProductStatus = 'Available' | 'Pending Payment' | 'Sold' | 'Inactive';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  price: number; // Current Price
  originalPrice: number; // Original Price for trust building
  conditionScore: number; // e.g., 4.8
  conditionPercentage: number; // e.g., 95 (% New)
  location: string;
  status: ProductStatus;
  categorySlug: string;
  originalPurchaseDate?: string;
  accessories: string[];
  warrantyStatus: string;
  usageHistory: string;
  reasonForSelling: string;
  knownDefects: string;
  description: string;
  imageUrl: string; // Featured image
  images: string[]; // Secondary images
  seoKeywords: string[];
}

export type OrderStatus =
  | 'Pending Verification'
  | 'Deposit Paid'
  | 'Balance Pending'
  | 'Paid in Full'
  | 'Ready To Ship'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export type PaymentType = 'Full' | 'Deposit';

export interface Order {
  id: string; // ORD-XXXXXX
  productId: string;
  productTitle: string;
  productPrice: number;
  paymentType: PaymentType;
  discountApplied: number; // Discount amount
  totalAmount: number; // Final calculated amount (discounted if paid in full)
  depositPaid: number;
  balanceDue: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  notes?: string;
  bankTransferReceipt?: string; // Base64 or receipt image URL
  createdAt: string;
  dueDate?: string; // Within 3 days if Deposit
  trackingNumber?: string;
  shippingCarrier?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  orderIds: string[];
}

export interface SystemSettings {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  depositPercent: number; // Defaults to 30%
  discountPercent: number; // Defaults to 5%
  balanceDueDays: number; // Defaults to 3 days
  shippingPolicy: string;
  returnPolicy: string;
  returnPolicyDetail?: string; // Optional detailed return/refund policy description
  shippingPolicyDetail?: string; // Optional shipping timeline/packaging details
  paymentPolicyDetail?: string; // Optional wire transfer/reservation detail
  servicePolicy?: string; // Optional brand service creed/motto
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}
