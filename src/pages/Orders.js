import React, { useState, useEffect } from 'react';
import API from '../api';
import PendingOrders from '../components/PendingOrders';
import ConfirmedOrders from '../components/ConfirmedOrders';
import CompletedOrders from '../components/CompletedOrders';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState({
    pending: [],
    confirmed: [],
    completed: []
  });
  const [loading, setLoading] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching orders...');
      
      const [pendingRes, confirmedRes] = await Promise.all([
        API.get('/admin/orders/pending'),
        API.get('/admin/orders/confirmed')
      ]);

      console.log('✅ Pending response:', pendingRes.data);
      console.log('✅ Confirmed response:', confirmedRes.data);

      const pendingOrders = pendingRes.data.data || [];
      const confirmedOrders = confirmedRes.data.data || [];

      // Separate confirmed into in-progress & completed
      const completedOrders = confirmedOrders.filter(order => order.status === 'Delivered');
      const inProgressOrders = confirmedOrders.filter(order => order.status !== 'Delivered');

      setOrders({
        pending: pendingOrders,
        confirmed: inProgressOrders,
        completed: completedOrders
      });

      console.log('📊 Orders set:', {
        pending: pendingOrders.length,
        confirmed: inProgressOrders.length,
        completed: completedOrders.length
      });

    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
    }
  };

  const updateOrder = async (orderId, orderData) => {
    try {
      await API.put(`/admin/orders/${orderId}`, orderData);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error.response?.data || error.message);
      throw error;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await API.delete(`/admin/orders/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error.response?.data || error.message);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: orders.pending.length },
    { id: 'confirmed', label: 'In Progress', count: orders.confirmed.length },
    { id: 'completed', label: 'Completed', count: orders.completed.length }
  ];

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Order Management</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <>
          {activeTab === 'pending' && (
            <PendingOrders 
              orders={orders.pending} 
              onUpdateStatus={updateOrderStatus}
              onUpdateOrder={updateOrder}
              onDeleteOrder={deleteOrder}
            />
          )}
          {activeTab === 'confirmed' && (
            <ConfirmedOrders 
              orders={orders.confirmed} 
              onUpdateStatus={updateOrderStatus}
            />
          )}
          {activeTab === 'completed' && (
            <CompletedOrders 
              orders={orders.completed} 
              onDeleteOrder={deleteOrder}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
