/**
 * MaycoleTracker vol XII™ - API Client
 * Mock API service for inventory management
 */

import {
  Product,
  Category,
  Supplier,
  StockMovement,
  PurchaseOrder,
  SalesOrder,
  Customer,
  InventoryMetrics,
  SalesMetrics,
  StockAlert,
  Notification,
  ApiResponse,
  PaginatedResponse,
  ProductFilters,
  DateRangeFilter,
} from '../types/database';
import { AuthService } from './auth';

// ==================== API CLIENT ====================

class ApiClient {
  private baseUrl = '/api'; // In production, this would be your API endpoint

  /**
   * Make authenticated API request
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const session = AuthService.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700));

    // In production, make actual fetch call:
    // const response = await fetch(`${this.baseUrl}${endpoint}`, {
    //   ...options,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${session.token}`,
    //     ...options.headers,
    //   },
    // });
    // return response.json();

    // For demo, return mock data
    return {
      success: true,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>;
  }

  // ==================== PRODUCTS ====================

  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    await this.request('/products', { method: 'GET' });

    let products = this.getMockProducts();

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)
      );
    }

    if (filters?.categoryId) {
      products = products.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters?.status) {
      products = products.filter((p) => p.status === filters.status);
    }

    if (filters?.lowStock) {
      products = products.filter((p) => p.quantity <= p.minStockLevel);
    }

    // Sorting
    if (filters?.sortBy) {
      products.sort((a, b) => {
        const aVal = a[filters.sortBy as keyof Product];
        const bVal = b[filters.sortBy as keyof Product];
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : -order;
      });
    }

    return {
      data: products,
      pagination: {
        page: 1,
        pageSize: 50,
        totalPages: 1,
        totalItems: products.length,
      },
    };
  }

  async getProduct(id: string): Promise<Product> {
    await this.request(`/products/${id}`, { method: 'GET' });
    const products = this.getMockProducts();
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const newProduct: Product = {
      id: this.generateId(),
      sku: data.sku || this.generateSKU(),
      name: data.name || 'New Product',
      description: data.description || '',
      categoryId: data.categoryId || '1',
      supplierId: data.supplierId || '1',
      organizationId: '1',
      quantity: data.quantity || 0,
      minStockLevel: data.minStockLevel || 10,
      maxStockLevel: data.maxStockLevel || 100,
      reorderPoint: data.reorderPoint || 20,
      unitCost: data.unitCost || 0,
      sellingPrice: data.sellingPrice || 0,
      images: data.images || [],
      location: data.location || 'Warehouse A',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRestockedAt: null,
    };

    return newProduct;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const product = await this.getProduct(id);
    return {
      ...product,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // ==================== CATEGORIES ====================

  async getCategories(): Promise<Category[]> {
    await this.request('/categories', { method: 'GET' });
    return this.getMockCategories();
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      id: this.generateId(),
      name: data.name || 'New Category',
      description: data.description || '',
      organizationId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // ==================== SUPPLIERS ====================

  async getSuppliers(): Promise<Supplier[]> {
    await this.request('/suppliers', { method: 'GET' });
    return this.getMockSuppliers();
  }

  async getSupplier(id: string): Promise<Supplier> {
    await this.request(`/suppliers/${id}`, { method: 'GET' });
    const suppliers = this.getMockSuppliers();
    const supplier = suppliers.find((s) => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  }

  async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
    await this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      id: this.generateId(),
      name: data.name || 'New Supplier',
      contactPerson: data.contactPerson || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
      organizationId: '1',
      rating: 5,
      leadTime: 7,
      minimumOrderValue: 0,
      paymentTerms: 'Net 30',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // ==================== STOCK MOVEMENTS ====================

  async getStockMovements(filters?: {
    productId?: string;
    dateRange?: DateRangeFilter;
  }): Promise<StockMovement[]> {
    await this.request('/stock-movements', { method: 'GET' });
    return this.getMockStockMovements();
  }

  async createStockMovement(data: Partial<StockMovement>): Promise<StockMovement> {
    await this.request('/stock-movements', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      id: this.generateId(),
      productId: data.productId || '',
      organizationId: '1',
      type: data.type || 'adjustment',
      quantity: data.quantity || 0,
      reason: data.reason || '',
      performedBy: '1',
      createdAt: new Date().toISOString(),
    };
  }

  // ==================== ORDERS ====================

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    await this.request('/purchase-orders', { method: 'GET' });
    return [];
  }

  async getSalesOrders(): Promise<SalesOrder[]> {
    await this.request('/sales-orders', { method: 'GET' });
    return [];
  }

  // ==================== ANALYTICS ====================

  async getInventoryMetrics(): Promise<InventoryMetrics> {
    await this.request('/analytics/inventory', { method: 'GET' });

    const products = this.getMockProducts();
    const totalValue = products.reduce((sum, p) => sum + p.quantity * p.unitCost, 0);
    const lowStockItems = products.filter((p) => p.quantity <= p.minStockLevel).length;
    const outOfStockItems = products.filter((p) => p.quantity === 0).length;

    return {
      totalProducts: products.length,
      totalValue,
      lowStockItems,
      outOfStockItems,
      averageTurnoverRate: 4.2,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getSalesMetrics(dateRange?: DateRangeFilter): Promise<SalesMetrics> {
    await this.request('/analytics/sales', { method: 'GET' });

    return {
      totalRevenue: 156780.5,
      totalOrders: 342,
      averageOrderValue: 458.42,
      topSellingProducts: [
        {
          productId: '1',
          productName: 'Premium Laptop',
          totalSales: 45,
          totalRevenue: 67500,
          quantity: 45,
        },
        {
          productId: '2',
          productName: 'Wireless Mouse',
          totalSales: 120,
          totalRevenue: 3600,
          quantity: 120,
        },
      ],
      revenueTrend: this.generateRevenueTrend(),
      lastUpdated: new Date().toISOString(),
    };
  }

  async getStockAlerts(): Promise<StockAlert[]> {
    await this.request('/alerts', { method: 'GET' });
    return this.getMockAlerts();
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications(): Promise<Notification[]> {
    await this.request('/notifications', { method: 'GET' });
    return this.getMockNotifications();
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.request(`/notifications/${id}/read`, { method: 'POST' });
  }

  // ==================== MOCK DATA GENERATORS ====================

  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        sku: 'LAP-001',
        name: 'Premium Laptop',
        description: 'High-performance laptop for professionals',
        categoryId: '1',
        supplierId: '1',
        organizationId: '1',
        quantity: 45,
        minStockLevel: 10,
        maxStockLevel: 100,
        reorderPoint: 20,
        unitCost: 1200,
        sellingPrice: 1500,
        images: [],
        location: 'Warehouse A - Shelf 12',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-11-29T14:30:00Z',
        lastRestockedAt: '2024-11-20T08:00:00Z',
      },
      {
        id: '2',
        sku: 'MOU-001',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        categoryId: '2',
        supplierId: '2',
        organizationId: '1',
        quantity: 8,
        minStockLevel: 15,
        maxStockLevel: 200,
        reorderPoint: 30,
        unitCost: 25,
        sellingPrice: 30,
        images: [],
        location: 'Warehouse A - Shelf 5',
        status: 'low-stock',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-11-29T14:30:00Z',
        lastRestockedAt: '2024-10-15T08:00:00Z',
      },
      {
        id: '3',
        sku: 'KEY-001',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard',
        categoryId: '2',
        supplierId: '1',
        organizationId: '1',
        quantity: 0,
        minStockLevel: 10,
        maxStockLevel: 150,
        reorderPoint: 25,
        unitCost: 80,
        sellingPrice: 120,
        images: [],
        location: 'Warehouse B - Shelf 3',
        status: 'out-of-stock',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-11-29T14:30:00Z',
        lastRestockedAt: '2024-09-10T08:00:00Z',
      },
      {
        id: '4',
        sku: 'MON-001',
        name: '4K Monitor',
        description: '27-inch 4K display',
        categoryId: '1',
        supplierId: '3',
        organizationId: '1',
        quantity: 32,
        minStockLevel: 8,
        maxStockLevel: 50,
        reorderPoint: 15,
        unitCost: 350,
        sellingPrice: 450,
        images: [],
        location: 'Warehouse A - Shelf 8',
        status: 'active',
        createdAt: '2024-03-01T10:00:00Z',
        updatedAt: '2024-11-29T14:30:00Z',
        lastRestockedAt: '2024-11-15T08:00:00Z',
      },
    ];
  }

  private getMockCategories(): Category[] {
    return [
      {
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices and components',
        organizationId: '1',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        name: 'Accessories',
        description: 'Computer and electronic accessories',
        organizationId: '1',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '3',
        name: 'Office Supplies',
        description: 'General office supplies',
        organizationId: '1',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ];
  }

  private getMockSuppliers(): Supplier[] {
    return [
      {
        id: '1',
        name: 'TechCorp Supply',
        contactPerson: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1-555-0100',
        address: {
          street: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          zipCode: '94105',
        },
        organizationId: '1',
        rating: 4.5,
        leadTime: 5,
        minimumOrderValue: 1000,
        paymentTerms: 'Net 30',
        isActive: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        name: 'Global Electronics',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@globalelec.com',
        phone: '+1-555-0200',
        address: {
          street: '456 Electronics Ave',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
        },
        organizationId: '1',
        rating: 4.8,
        leadTime: 7,
        minimumOrderValue: 500,
        paymentTerms: 'Net 45',
        isActive: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '3',
        name: 'Premium Displays Inc',
        contactPerson: 'Michael Chen',
        email: 'michael@premiumdisplays.com',
        phone: '+1-555-0300',
        address: {
          street: '789 Display Road',
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          zipCode: '98101',
        },
        organizationId: '1',
        rating: 4.9,
        leadTime: 10,
        minimumOrderValue: 2000,
        paymentTerms: 'Net 60',
        isActive: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
    ];
  }

  private getMockStockMovements(): StockMovement[] {
    return [
      {
        id: '1',
        productId: '1',
        organizationId: '1',
        type: 'purchase',
        quantity: 50,
        toLocation: 'Warehouse A - Shelf 12',
        reason: 'Stock replenishment',
        performedBy: '1',
        referenceNumber: 'PO-2024-001',
        createdAt: '2024-11-20T08:00:00Z',
      },
      {
        id: '2',
        productId: '2',
        organizationId: '1',
        type: 'sale',
        quantity: -7,
        fromLocation: 'Warehouse A - Shelf 5',
        reason: 'Customer order',
        performedBy: '1',
        referenceNumber: 'SO-2024-123',
        createdAt: '2024-11-28T14:30:00Z',
      },
    ];
  }

  private getMockAlerts(): StockAlert[] {
    return [
      {
        id: '1',
        productId: '2',
        type: 'low-stock',
        severity: 'warning',
        message: 'Wireless Mouse stock is running low (8 units)',
        isRead: false,
        isResolved: false,
        createdAt: '2024-11-29T10:00:00Z',
      },
      {
        id: '2',
        productId: '3',
        type: 'out-of-stock',
        severity: 'critical',
        message: 'Mechanical Keyboard is out of stock',
        isRead: false,
        isResolved: false,
        createdAt: '2024-11-29T09:00:00Z',
      },
    ];
  }

  private getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        userId: '1',
        type: 'stock-alert',
        title: 'Low Stock Alert',
        message: 'Wireless Mouse is running low on stock',
        isRead: false,
        priority: 'high',
        createdAt: '2024-11-29T10:00:00Z',
      },
      {
        id: '2',
        userId: '1',
        type: 'order-update',
        title: 'Order Received',
        message: 'Purchase order PO-2024-125 has been received',
        isRead: false,
        priority: 'medium',
        createdAt: '2024-11-29T08:30:00Z',
      },
      {
        id: '3',
        userId: '1',
        type: 'system',
        title: 'System Update',
        message: 'New features are now available',
        isRead: true,
        priority: 'low',
        createdAt: '2024-11-28T15:00:00Z',
        readAt: '2024-11-28T16:00:00Z',
      },
    ];
  }

  private generateRevenueTrend(): Array<{ date: string; value: number }> {
    const trend = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      trend.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(3000 + Math.random() * 5000),
      });
    }

    return trend;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSKU(): string {
    const prefix = 'PRD';
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${prefix}-${random}`;
  }
}

export const api = new ApiClient();
