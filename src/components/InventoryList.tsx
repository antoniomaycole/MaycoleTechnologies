/**
 * MaycoleTracker vol XII™ - Inventory List
 * Real-time product inventory management
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { api } from '../lib/api';
import { useRealtimeSubscription, RealtimeNotifier } from '../lib/realtime';
import { Product, Category } from '../types/database';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export function InventoryList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Subscribe to real-time inventory updates
  useRealtimeSubscription('inventory-updated', (event) => {
    const { productId, newQuantity } = event.payload;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: newQuantity,
              status:
                newQuantity === 0
                  ? 'out-of-stock'
                  : newQuantity <= p.minStockLevel
                    ? 'low-stock'
                    : 'active',
            }
          : p
      )
    );
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(productsData.data);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Simulate stock adjustment
  const adjustStock = async (product: Product, change: number) => {
    const newQuantity = Math.max(0, product.quantity + change);

    try {
      await api.updateProduct(product.id, { quantity: newQuantity });

      // Trigger real-time update
      RealtimeNotifier.notifyInventoryUpdate(product.id, product.quantity, newQuantity);

      toast.success(`Updated ${product.name}`, {
        description: `Stock: ${product.quantity} → ${newQuantity}`,
        icon: <CheckCircle className="w-4 h-4" />,
      });
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500/30 text-green-400 bg-green-500/10';
      case 'low-stock':
        return 'border-orange-500/30 text-orange-400 bg-orange-500/10';
      case 'out-of-stock':
        return 'border-red-500/30 text-red-400 bg-red-500/10';
      case 'discontinued':
        return 'border-gray-500/30 text-gray-400 bg-gray-500/10';
      default:
        return 'border-blue-500/30 text-blue-400 bg-blue-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-1">
            Inventory Management
          </h2>
          <p className="text-gray-400 text-sm">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh */}
            <Button variant="outline" onClick={loadData} className="border-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Product Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-500" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <Badge variant="outline" className={getStatusColor(product.status)}>
                            {product.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>SKU: {product.sku}</span>
                          <span>•</span>
                          <span>Location: {product.location}</span>
                          <span>•</span>
                          <span className="text-gray-300">
                            ${product.unitCost} / ${product.sellingPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="flex items-center gap-6">
                      {/* Quantity */}
                      <div className="text-center">
                        <p className="text-2xl mb-1">{product.quantity}</p>
                        <p className="text-xs text-gray-400">In Stock</p>
                      </div>

                      {/* Min/Max */}
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-1">Min: {product.minStockLevel}</p>
                        <p className="text-sm text-gray-400">Max: {product.maxStockLevel}</p>
                      </div>

                      {/* Stock Adjustment */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustStock(product, 10)}
                          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +10
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustStock(product, -10)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          disabled={product.quantity < 10}
                        >
                          <TrendingDown className="w-3 h-3 mr-1" />
                          -10
                        </Button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Alert Badge */}
                  {product.quantity <= product.minStockLevel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-800"
                    >
                      <div className="flex items-center gap-2 text-orange-400 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          Stock level is below minimum threshold. Reorder point:{' '}
                          {product.reorderPoint}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No products found matching your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
