    // src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders/user/${userId}`);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gold text-xl">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gold mb-6">My Orders</h2>

      <div className="bg-black rounded-2xl shadow-lg p-6">
        <p className="text-white mb-4">
          Total Orders Placed:{" "}
          <span className="text-gold font-semibold">{orders.length}</span>
        </p>

        {orders.length === 0 ? (
          <p className="text-gray-400">You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-deepRed p-4 rounded-xl shadow-md text-white"
              >
                <p>
                  <span className="text-gold font-semibold">Order ID:</span> {order._id}
                </p>
                <p>
                  <span className="text-gold font-semibold">Total:</span> ₹{order.total}
                </p>
                <p>
                  <span className="text-gold font-semibold">Status:</span> {order.status}
                </p>
                <p>
                  <span className="text-gold font-semibold">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
