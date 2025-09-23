import React, { useState } from 'react';

const CompletedOrders = ({ orders, onDeleteOrder }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDeleteOrder = (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete Order #${orderNumber}? This action cannot be undone.`)) {
      onDeleteOrder(orderId);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-gray-400">✅</div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">No completed orders</h3>
        <p className="text-gray-600">Delivered orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Completed Orders</h3>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                {/* Main Order Row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.client?.name}</div>
                    <div className="text-sm text-gray-500">{order.client?.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.products.length} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    Rs {order.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      ✓ Delivered
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        title="View Details"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                          />
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                          />
                        </svg>
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id, order._id.slice(-6))}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        title="Delete Order"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details Row */}
                {expandedOrder === order._id && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                      <div className="space-y-6">
                        {/* Customer Details */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="p-4 bg-white rounded-lg">
                            <h4 className="mb-3 font-semibold text-gray-900">Customer Details</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Name:</span> {order.client?.name}</p>
                              <p><span className="font-medium">Contact:</span> {order.client?.contact}</p>
                              <p><span className="font-medium">City:</span> {order.client?.city}</p>
                              <p><span className="font-medium">Address:</span> {order.client?.address}</p>
                            </div>
                          </div>

                          <div className="p-4 bg-white rounded-lg">
                            <h4 className="mb-3 font-semibold text-gray-900">Order Summary</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Total Amount:</span> Rs {order.totalPrice}</p>
                              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                              <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                              <p><span className="font-medium">Delivery Time:</span> {new Date(order.createdAt).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Products Table */}
                        <div className="p-4 bg-white rounded-lg">
                          <h4 className="mb-3 font-semibold text-gray-900">Delivered Items</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.products.map((product, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">Rs {product.price}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{product.quantity}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      Rs {(product.price * product.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Order Journey */}
                        <div className="p-4 bg-white rounded-lg">
                          <h4 className="mb-3 font-semibold text-gray-900">Order Journey</h4>
                          <div className="flex items-center space-x-2 overflow-x-auto">
                            {['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((status, index) => (
                              <div key={status} className="flex items-center flex-shrink-0">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-green-500 text-white">
                                  ✓
                                </div>
                                <span className="ml-2 text-xs text-gray-600 whitespace-nowrap">{status}</span>
                                {index < 4 && (
                                  <div className="w-8 h-0.5 mx-2 bg-green-500"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => handleDeleteOrder(order._id, order._id.slice(-6))}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700"
                          >
                            Delete Order
                          </button>
                          <button
                            onClick={() => setExpandedOrder(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Close Details
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Total: {orders.length} completed orders
          </span>
          <span className="text-sm font-medium text-gray-900">
            Total Revenue: Rs {orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompletedOrders;
