import React, { useState } from 'react';

const PendingOrders = ({ orders, onUpdateStatus, onDeleteOrder, onUpdateOrder }) => {
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleConfirm = (orderId) => {
    if (window.confirm('Are you sure you want to confirm this order?')) {
      onUpdateStatus(orderId, 'Confirmed');
    }
  };

  const handleReject = (orderId) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      onDeleteOrder(orderId);
    }
  };

  const startEditing = (order) => {
    setEditingOrder(order._id);
    setEditFormData({
      client: { ...order.client },
      paymentMethod: order.paymentMethod,
      products: [...order.products.map(p => ({ ...p }))
      ]
    });
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditFormData({});
  };

  const handleClientChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value
      }
    }));
  };

  const handlePaymentMethodChange = (value) => {
    setEditFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  const handleProductChange = (index, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { 
          ...product, 
          [field]: field === 'price' || field === 'quantity' ? Number(value) : value 
        } : product
      )
    }));
  };

  const addProduct = () => {
    setEditFormData(prev => ({
      ...prev,
      products: [...prev.products, { 
        name: '', 
        price: 0, 
        quantity: 1, 
        productId: null // Always send null for new products
      }]
    }));
  };

  const removeProduct = (index) => {
    if (editFormData.products.length > 1) {
      setEditFormData(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return editFormData.products?.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0) || 0;
  };

  const saveChanges = async (orderId) => {
    try {
      // Validate products before saving - only check for name and quantity
      const invalidProducts = editFormData.products.filter(product => 
        !product.name.trim() || product.quantity <= 0
      );

      if (invalidProducts.length > 0) {
        alert('Please fill in all product details with valid values (name required, quantity > 0)');
        return;
      }

      // Clean up products data
      const validatedProducts = editFormData.products.map(product => {
        const cleanProduct = {
          name: product.name.trim(),
          price: Number(product.price) || 0, // Default to 0 if no price entered
          quantity: Number(product.quantity)
        };

        // Only include productId if it's a valid MongoDB ObjectId (24 character hex string)
        if (product.productId && 
            typeof product.productId === 'string' && 
            product.productId.length === 24 && 
            /^[0-9a-fA-F]{24}$/.test(product.productId)) {
          cleanProduct.productId = product.productId;
        }
        // For all other cases (null, invalid strings, etc.), don't include productId
        // Let the backend generate a new one

        return cleanProduct;
      });

      const updateData = {
        client: editFormData.client,
        paymentMethod: editFormData.paymentMethod,
        products: validatedProducts,
        totalPrice: calculateTotal()
      };

      console.log('💾 Saving order data:', updateData);
      await onUpdateOrder(orderId, updateData);
      setEditingOrder(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please check all fields and try again.');
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-gray-400">📋</div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">No pending orders</h3>
        <p className="text-gray-600">All orders have been processed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-6">
            {/* Order Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order._id.slice(-6)}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex space-x-2">
                {editingOrder === order._id ? (
                  <>
                    <button
                      onClick={() => saveChanges(order._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(order)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-yellow-100 rounded-lg hover:bg-yellow-200"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleConfirm(order._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Confirm Order
                    </button>
                    <button
                      onClick={() => handleReject(order._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Reject Order
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-3 font-semibold text-gray-900">Customer Details</h4>
                {editingOrder === order._id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={editFormData.client?.name || ''}
                        onChange={(e) => handleClientChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Contact</label>
                      <input
                        type="text"
                        value={editFormData.client?.contact || ''}
                        onChange={(e) => handleClientChange('contact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        value={editFormData.client?.city || ''}
                        onChange={(e) => handleClientChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        value={editFormData.client?.address || ''}
                        onChange={(e) => handleClientChange('address', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {order.client?.name}</p>
                    <p><span className="font-medium">Contact:</span> {order.client?.contact}</p>
                    <p><span className="font-medium">City:</span> {order.client?.city}</p>
                    <p><span className="font-medium">Address:</span> {order.client?.address}</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-3 font-semibold text-gray-900">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Total Amount:</span> Rs{' '}
                    {editingOrder === order._id ? calculateTotal().toFixed(2) : order.totalPrice}
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span>{' '}
                    {editingOrder === order._id ? (
                      <select
                        value={editFormData.paymentMethod || 'COD'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="px-2 py-1 ml-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="COD">COD</option>
                        <option value="Online">Online</option>
                      </select>
                    ) : (
                      order.paymentMethod
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span className="px-2 py-1 ml-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Ordered Items</h4>
                {editingOrder === order._id && (
                  <button
                    onClick={addProduct}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    Add Product
                  </button>
                )}
              </div>
              
              {editingOrder === order._id ? (
                <div className="space-y-3">
                  {editFormData.products?.map((product, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Product Name *</label>
                          <input
                            type="text"
                            value={product.name || ''}
                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter product name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Price (Rs)</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={product.price || ''}
                            onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Quantity *</label>
                          <input
                            type="number"
                            min="1"
                            value={product.quantity || ''}
                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            placeholder="1"
                            required
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="flex-1">
                            <label className="block mb-1 text-xs font-medium text-gray-700">Subtotal</label>
                            <div className="px-2 py-1 text-sm bg-gray-100 rounded">
                              Rs {((product.price || 0) * (product.quantity || 0)).toFixed(2)}
                            </div>
                          </div>
                          {editFormData.products.length > 1 && (
                            <button
                              onClick={() => removeProduct(index)}
                              className="px-2 py-1 ml-2 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                              type="button"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">
                      Total: Rs {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingOrders;

