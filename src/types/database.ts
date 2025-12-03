/**
 * MaycoleTracker vol XII™ - Database Schema
 * Complete TypeScript interfaces for inventory management system
 */

// ==================== USER MANAGEMENT ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  avatar?: string;
  phone?: string;
  isActive: boolean;
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  subscriptionTier: 'free' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  subscriptionExpiresAt: string;
  createdAt: string;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  lowStockThreshold: number;
  enableNotifications: boolean;
  enableVoiceControl: boolean;
  enableBarcodeScanning: boolean;
}

// ==================== INVENTORY MANAGEMENT ====================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  supplierId: string;
  organizationId: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  unitCost: number;
  sellingPrice: number;
  barcode?: string;
  images: string[];
  location: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  lastRestockedAt: string | null;
}

export type ProductStatus = 'active' | 'discontinued' | 'out-of-stock' | 'low-stock';

export interface Category {
  id: string;
  name: string;
  description: string;
  parentCategoryId?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: SupplierAddress;
  organizationId: string;
  rating: number;
  leadTime: number; // in days
  minimumOrderValue: number;
  paymentTerms: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// ==================== STOCK MOVEMENTS ====================

export interface StockMovement {
  id: string;
  productId: string;
  organizationId: string;
  type: MovementType;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason: string;
  performedBy: string; // userId
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export type MovementType = 
  | 'purchase' 
  | 'sale' 
  | 'adjustment' 
  | 'transfer' 
  | 'return' 
  | 'damaged' 
  | 'expired';

export interface StockAdjustment {
  id: string;
  productId: string;
  organizationId: string;
  oldQuantity: number;
  newQuantity: number;
  difference: number;
  reason: AdjustmentReason;
  performedBy: string;
  notes?: string;
  approvedBy?: string;
  createdAt: string;
}

export type AdjustmentReason = 
  | 'count-correction' 
  | 'damaged' 
  | 'expired' 
  | 'lost' 
  | 'found' 
  | 'other';

// ==================== ORDERS & PURCHASES ====================

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  organizationId: string;
  status: OrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  taxAmount: number;
  shippingCost: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'draft' 
  | 'pending' 
  | 'approved' 
  | 'ordered' 
  | 'shipped' 
  | 'received' 
  | 'cancelled';

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  notes?: string;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  organizationId: string;
  status: OrderStatus;
  orderDate: string;
  shipmentDate?: string;
  items: SalesOrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'cancelled';

export interface SalesOrderItem {
  id: string;
  salesOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: SupplierAddress;
  organizationId: string;
  totalPurchases: number;
  lastPurchaseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== ANALYTICS & REPORTING ====================

export interface InventoryMetrics {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  averageTurnoverRate: number;
  lastUpdated: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: TopProduct[];
  revenueTrend: TrendData[];
  lastUpdated: string;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSales: number;
  totalRevenue: number;
  quantity: number;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface StockAlert {
  id: string;
  productId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export type AlertType = 
  | 'low-stock' 
  | 'out-of-stock' 
  | 'expired' 
  | 'expiring-soon' 
  | 'reorder-point' 
  | 'overstocked';

export type AlertSeverity = 'info' | 'warning' | 'critical';

// ==================== AUDIT & COMPLIANCE ====================

export interface AuditLog {
  id: string;
  userId: string;
  organizationId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'export' 
  | 'login' 
  | 'logout';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  organizationId: string;
  createdBy: string;
  parameters: Record<string, any>;
  generatedAt: string;
  fileUrl?: string;
  format: ReportFormat;
}

export type ReportType = 
  | 'inventory-valuation' 
  | 'stock-movement' 
  | 'sales-summary' 
  | 'purchase-summary' 
  | 'supplier-performance' 
  | 'low-stock-report' 
  | 'expired-items' 
  | 'audit-trail';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json';

// ==================== NOTIFICATIONS ====================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  readAt?: string;
}

export type NotificationType = 
  | 'stock-alert' 
  | 'order-update' 
  | 'system' 
  | 'approval-required' 
  | 'threshold-reached';

// ==================== REAL-TIME EVENTS ====================

export interface RealtimeEvent {
  id: string;
  type: RealtimeEventType;
  payload: any;
  timestamp: string;
  userId?: string;
  organizationId: string;
}

export type RealtimeEventType = 
  | 'inventory-updated' 
  | 'order-created' 
  | 'order-updated' 
  | 'stock-movement' 
  | 'alert-created' 
  | 'user-activity';

// ==================== API RESPONSES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

// ==================== FILTERS & QUERIES ====================

export interface ProductFilters {
  categoryId?: string;
  supplierId?: string;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
  sortBy?: 'name' | 'price' | 'quantity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}
