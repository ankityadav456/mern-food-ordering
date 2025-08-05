import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const OrderSummary = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/user-orders", {
          params: { userId: user?._id },
        });
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  if (loading) return <Loader />;

  // Theme classes
  const bgColor = theme === "dark" ? "bg-[#111]" : "bg-[#FAF9F6]";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const tableBg = theme === "dark" ? "bg-[#1a1a1a]" : "bg-white";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-gray-300";
  const hoverColor = theme === "dark" ? "hover:bg-[#2b2b2b]" : "hover:bg-gray-100";
  const noDataColor = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen ${textColor} p-6 md:p-10`}>
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-[#FFD700]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        My Order History
      </motion.h2>

      {orders.length === 0 ? (
        <div className={`text-center ${noDataColor} text-lg`}>No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <motion.table
            className={`min-w-full ${tableBg} ${borderColor} border rounded-xl overflow-hidden shadow-lg`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <thead className="bg-[#FFD700] text-black">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  className={`${borderColor} border-b ${hoverColor} transition-all duration-300`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-4 px-4 break-all">{order._id}</td>
                  <td className="py-4 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.foodId.name} x {item.quantity} - ₹{item.foodId.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#FFD700]">₹{order.totalAmount}</td>
                  <td className="py-4 px-4">
                    {order.deliveryAddress ? (
                      <div>
                        <p>{order.deliveryAddress.fullName}</p>
                        <p>Mobile: {order.deliveryAddress.mobileNumber}</p>
                        <p>
                          {order.deliveryAddress.roomNumber}, {order.deliveryAddress.street}
                        </p>
                        <p>
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                        </p>
                      </div>
                    ) : (
                      <p className={noDataColor}>No Address Provided</p>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
