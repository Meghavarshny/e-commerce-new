import useOrders from "../hooks/useOrders";
import Loader from "../components/Loader";
import { useState } from "react";

export default function OrdersPage() {
  const { orders, loading, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Group orders by status
  const groupedOrders = orders?.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = [];
    }
    acc[order.status].push(order);
    return acc;
  }, {});

  const formatOrderDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total amount for an order
  const calculateTotal = (order) => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your recent orders</p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <a 
              href="/products" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Order Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{orders?.length || 0}</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {orders?.filter(order => order.status === 'Delivered').length || 0}
                </div>
                <div className="text-gray-600">Delivered</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {orders?.filter(order => order.status === 'Processing' || order.status === 'Shipped').length || 0}
                </div>
                <div className="text-gray-600">In Progress</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  ₹ {orders?.reduce((sum, order) => sum + calculateTotal(order), 0).toFixed(2) || 0}
                </div>
                <div className="text-gray-600">Total Spent</div>
              </div>
            </div>

            {/* Order Groups by Status */}
            {Object.entries(groupedOrders || {}).map(([status, orderList]) => (
              <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800 capitalize">
                    {status} Orders
                    <span className="ml-2 text-sm font-normal text-gray-600">({orderList.length})</span>
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {orderList.map(order => (
                    <div key={order._id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="text-lg font-semibold text-gray-900">#{order._id.slice(-8)}</div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Date:</span> {formatOrderDate(order.createdAt)}
                            </div>
                            <div>
                              <span className="font-medium">Items:</span> {order.items.length}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> ₹ {calculateTotal(order).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>
                      </div>
                      
                      {selectedOrder === order._id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <img 
                                    src={item.product.image || "https://placeholder.co/60x60"} 
                                    alt={item.product.name} 
                                    className="w-12 h-12 object-cover rounded mr-4"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-800">{item.product.name || 'Product Name'}</div>
                                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                                  </div>
                                </div>
                                <div className="font-semibold">₹ {(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-4">Shipping Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-600">Full Name</div>
                                <div className="font-medium">{order.shippingInfo?.name || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Email</div>
                                <div className="font-medium">{order.shippingInfo?.email || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Address</div>
                                <div className="font-medium">{order.shippingInfo?.address || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">City & Postal Code</div>
                                <div className="font-medium">{order.shippingInfo?.city || 'N/A'}, {order.shippingInfo?.postalCode || 'N/A'}</div>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <h3 className="font-semibold text-gray-800 mb-4">Payment Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-600">Method</div>
                                  <div className="font-medium capitalize">{order.paymentInfo?.method || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Status</div>
                                  <div className="font-medium">{order.paymentInfo?.status || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}