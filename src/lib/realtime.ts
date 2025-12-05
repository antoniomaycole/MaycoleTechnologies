/**
 * MaycoleTracker vol XII™ - Real-time Updates System
 * Simulated WebSocket behavior for live inventory updates
 */

import { RealtimeEvent, RealtimeEventType } from '../types/database';

// ==================== EVENT HANDLERS ====================

type EventHandler = (event: RealtimeEvent) => void;

interface Subscription {
  id: string;
  channel: string;
  handler: EventHandler;
}

// ==================== REALTIME SERVICE ====================

export class RealtimeService {
  private static instance: RealtimeService;
  private subscriptions: Map<string, Subscription[]> = new Map();
  private simulationInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private eventQueue: RealtimeEvent[] = [];

  private constructor() {
    this.startSimulation();
  }

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  /**
   * Connect to real-time service
   */
  connect(): void {
    if (this.isConnected) {
      console.log('Already connected to real-time service');
      return;
    }

    console.log('Connecting to real-time service...');

    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      console.log('Connected to real-time service');
      this.emit('system', {
        type: 'system',
        message: 'Real-time updates activated',
      });
    }, 500);
  }

  /**
   * Disconnect from real-time service
   */
  disconnect(): void {
    if (!this.isConnected) return;

    console.log('Disconnecting from real-time service...');
    this.isConnected = false;
    this.subscriptions.clear();

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  /**
   * Subscribe to a channel
   */
  subscribe(channel: string, handler: EventHandler): () => void {
    const subscription: Subscription = {
      id: this.generateId(),
      channel,
      handler,
    };

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
    }

    this.subscriptions.get(channel)!.push(subscription);

    console.log(`Subscribed to channel: ${channel}`);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(channel);
      if (subs) {
        const index = subs.findIndex((s) => s.id === subscription.id);
        if (index !== -1) {
          subs.splice(index, 1);
        }
        if (subs.length === 0) {
          this.subscriptions.delete(channel);
        }
      }
      console.log(`Unsubscribed from channel: ${channel}`);
    };
  }

  /**
   * Emit event to channel
   */
  private emit(channel: string, payload: any): void {
    const event: RealtimeEvent = {
      id: this.generateId(),
      type: this.getEventType(channel),
      payload,
      timestamp: new Date().toISOString(),
      organizationId: '1',
    };

    this.eventQueue.push(event);

    const subscriptions = this.subscriptions.get(channel);
    if (subscriptions) {
      subscriptions.forEach((sub) => {
        try {
          sub.handler(event);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }

    // Also emit to 'all' channel
    const allSubscriptions = this.subscriptions.get('all');
    if (allSubscriptions && channel !== 'all') {
      allSubscriptions.forEach((sub) => {
        try {
          sub.handler(event);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  /**
   * Start simulation of real-time events
   */
  private startSimulation(): void {
    // Simulate random inventory events every 5-15 seconds
    this.simulationInterval = setInterval(
      () => {
        if (!this.isConnected) return;

        const eventType = this.getRandomEventType();
        const payload = this.generateEventPayload(eventType);

        this.emit(eventType, payload);
      },
      10000 + Math.random() * 5000
    );
  }

  /**
   * Manually trigger inventory update event
   */
  triggerInventoryUpdate(productId: string, oldQuantity: number, newQuantity: number): void {
    this.emit('inventory-updated', {
      productId,
      oldQuantity,
      newQuantity,
      difference: newQuantity - oldQuantity,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Manually trigger order event
   */
  triggerOrderEvent(orderId: string, type: 'created' | 'updated', status: string): void {
    const channel = type === 'created' ? 'order-created' : 'order-updated';
    this.emit(channel, {
      orderId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Manually trigger stock movement event
   */
  triggerStockMovement(productId: string, type: string, quantity: number): void {
    this.emit('stock-movement', {
      productId,
      type,
      quantity,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Manually trigger alert
   */
  triggerAlert(productId: string, type: string, severity: string, message: string): void {
    this.emit('alert-created', {
      productId,
      type,
      severity,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get connection status
   */
  isConnectionActive(): boolean {
    return this.isConnected;
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 10): RealtimeEvent[] {
    return this.eventQueue.slice(-limit);
  }

  /**
   * Clear event queue
   */
  clearEventQueue(): void {
    this.eventQueue = [];
  }

  // ==================== HELPER METHODS ====================

  private getRandomEventType(): string {
    const types = ['inventory-updated', 'stock-movement', 'alert-created', 'order-updated'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getEventType(channel: string): RealtimeEventType {
    switch (channel) {
      case 'inventory-updated':
        return 'inventory-updated';
      case 'order-created':
        return 'order-created';
      case 'order-updated':
        return 'order-updated';
      case 'stock-movement':
        return 'stock-movement';
      case 'alert-created':
        return 'alert-created';
      default:
        return 'user-activity';
    }
  }

  private generateEventPayload(eventType: string): any {
    switch (eventType) {
      case 'inventory-updated':
        return {
          productId: this.getRandomProductId(),
          oldQuantity: Math.floor(Math.random() * 100),
          newQuantity: Math.floor(Math.random() * 100),
          reason: 'Automatic stock count adjustment',
        };

      case 'stock-movement':
        return {
          productId: this.getRandomProductId(),
          type: this.getRandomMovementType(),
          quantity: Math.floor(Math.random() * 20) + 1,
          location: 'Warehouse A',
        };

      case 'alert-created':
        return {
          productId: this.getRandomProductId(),
          type: 'low-stock',
          severity: 'warning',
          message: 'Stock level below minimum threshold',
        };

      case 'order-updated':
        return {
          orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
          status: this.getRandomOrderStatus(),
          customerName: 'Customer ' + Math.floor(Math.random() * 100),
        };

      default:
        return {};
    }
  }

  private getRandomProductId(): string {
    const ids = ['1', '2', '3', '4'];
    return ids[Math.floor(Math.random() * ids.length)];
  }

  private getRandomMovementType(): string {
    const types = ['sale', 'purchase', 'adjustment', 'transfer'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomOrderStatus(): string {
    const statuses = ['pending', 'approved', 'shipped', 'delivered'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ==================== REACT HOOK ====================

import { useEffect, useState } from 'react';

export function useRealtimeSubscription(channel: string, handler: EventHandler) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const realtime = RealtimeService.getInstance();

    if (!realtime.isConnectionActive()) {
      realtime.connect();
    }

    const unsubscribe = realtime.subscribe(channel, handler);
    setIsSubscribed(true);

    return () => {
      unsubscribe();
      setIsSubscribed(false);
    };
  }, [channel, handler]);

  return isSubscribed;
}

// ==================== REALTIME NOTIFIER ====================

export class RealtimeNotifier {
  private static realtime = RealtimeService.getInstance();

  /**
   * Notify inventory update
   */
  static notifyInventoryUpdate(productId: string, oldQuantity: number, newQuantity: number): void {
    this.realtime.triggerInventoryUpdate(productId, oldQuantity, newQuantity);
  }

  /**
   * Notify order event
   */
  static notifyOrderEvent(orderId: string, type: 'created' | 'updated', status: string): void {
    this.realtime.triggerOrderEvent(orderId, type, status);
  }

  /**
   * Notify stock movement
   */
  static notifyStockMovement(productId: string, type: string, quantity: number): void {
    this.realtime.triggerStockMovement(productId, type, quantity);
  }

  /**
   * Notify alert
   */
  static notifyAlert(productId: string, type: string, severity: string, message: string): void {
    this.realtime.triggerAlert(productId, type, severity, message);
  }
}

// Export singleton instance
export const realtimeService = RealtimeService.getInstance();
