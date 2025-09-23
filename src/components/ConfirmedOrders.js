import React from 'react';

const ConfirmedOrders = ({ orders, onUpdateStatus }) => {
  const statusOptions = [
    'Confirmed',
    'Packed', 
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Packed': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-orange-100 text-orange-800',
      'Out for Delivery': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Are you sure you want to change status to "${newStatus}"?`)) {
      onUpdateStatus(orderId, newStatus);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders in progress</h3>
        <p className="text-gray-600">Confirmed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-6">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order._id.slice(-6)}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-3 font-semibold text-gray-900">Customer Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {order.client?.name}</p>
                  <p><span className="font-medium">Contact:</span> {order.client?.contact}</p>
                  <p><span className="font-medium">City:</span> {order.client?.city}</p>
                  <p><span className="font-medium">Address:</span> {order.client?.address}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-3 font-semibold text-gray-900">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Total Amount:</span> Rs {order.totalPrice}</p>
                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                  <p><span className="font-medium">Current Status:</span>
                    <span className={`px-2 py-1 ml-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Products Details */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">Ordered Items</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.products.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">Rs {product.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{product.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          Rs {(product.price * product.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Progress Indicator */}
            <div className="mt-6">
              <h4 className="mb-3 font-semibold text-gray-900">Order Progress</h4>
              <div className="flex items-center space-x-2">
                {statusOptions.map((status, index) => {
                  const isActive = statusOptions.indexOf(order.status) >= index;
                  const isCurrent = order.status === status;
                  return (
                    <div key={status} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCurrent 
                          ? 'bg-blue-600 text-white' 
                          : isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isActive && !isCurrent ? '✓' : index + 1}
                      </div>
                      <span className={`ml-2 text-xs ${isCurrent ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                        {status}
                      </span>
                      {index < statusOptions.length - 1 && (
                        <div className={`w-8 h-0.5 mx-2 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConfirmedOrders;
