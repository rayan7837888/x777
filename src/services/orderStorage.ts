import { CustomerOrder } from '../types';

const STORAGE_KEY = 'dodge_durango_orders_v2';

// No mock orders - only real customer orders submitted by actual users
const INITIAL_ORDERS: CustomerOrder[] = [];

export const getStoredOrders = (): CustomerOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: CustomerOrder[] = JSON.parse(raw);
    // Clean out any legacy mock/sample orders that were pre-seeded previously
    const realOrders = parsed.filter(o => 
      o.id !== 'ord-101' && 
      o.id !== 'ord-102' && 
      o.id !== 'ord-103' &&
      !o.code?.startsWith('DODGE-784912') &&
      !o.code?.startsWith('DODGE-492103') &&
      !o.code?.startsWith('DODGE-318920')
    );
    if (realOrders.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(realOrders));
    }
    return realOrders;
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    return [];
  }
};

export const saveOrder = (orderData: Omit<CustomerOrder, 'id' | 'createdAt' | 'status'>): CustomerOrder => {
  const currentOrders = getStoredOrders();
  const newOrder: CustomerOrder = {
    ...orderData,
    id: 'ord-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const updatedOrders = [newOrder, ...currentOrders];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    // Dispatch custom event for real-time reactivity within the same tab
    window.dispatchEvent(new CustomEvent('dodge_order_created', { detail: newOrder }));
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
  }

  return newOrder;
};

export const updateOrderStatus = (
  orderId: string, 
  status: 'pending' | 'accepted' | 'rejected', 
  details?: { employeeName?: string; rejectionReason?: string; notes?: string }
): CustomerOrder[] => {
  const currentOrders = getStoredOrders();
  const updated = currentOrders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status,
        assignedEmployee: details?.employeeName !== undefined ? details.employeeName : order.assignedEmployee,
        rejectionReason: details?.rejectionReason !== undefined ? details.rejectionReason : order.rejectionReason,
        staffNotes: details?.notes !== undefined ? details.notes : order.staffNotes,
        updatedAt: new Date().toISOString()
      };
    }
    return order;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dodge_orders_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to update orders in localStorage:', err);
  }

  return updated;
};

export const deleteOrder = (orderId: string): CustomerOrder[] => {
  const currentOrders = getStoredOrders();
  const updated = currentOrders.filter(o => o.id !== orderId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dodge_orders_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to delete order:', err);
  }
  return updated;
};

export const clearAllOrders = (): CustomerOrder[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('dodge_orders_updated', { detail: [] }));
  } catch (err) {
    console.error('Failed to clear orders:', err);
  }
  return [];
};
