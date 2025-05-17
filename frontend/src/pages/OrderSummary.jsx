import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";

const OrderSummary = () => {
    const { user } = useAuth();
    const { orderId } = useParams(); // Get order ID from URL
    const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axiosInstance.get("/orders/user-orders", {
                    params: { userId: user?._id },
                });
                setOrder(data.orders);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching order", error);
            }
        };

        if (user?._id) {
            fetchOrder();
          }
    }, [user]);

    if (!order) return <div>{loading && <Loader />}</div>;

    return (
        <div className="min-h-screen bg-[#111] p-10">
             {/* {loading && <Loader />} */}
            <h2 className="text-2xl font-bold mb-4 text-[#D4AF37]">Order Summary</h2>

            <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Order #{order[0]._id}</h3>
                <p className="text-lg text-gray-400 mb-2">Placed on: {new Date(order[0].createdAt).toLocaleDateString()}</p>

                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Items</h4>
                    <ul className="space-y-2">
                        {order[0].items.map((item, idx) => (
                            <li key={idx} className="text-gray-300">
                                {item.foodId.name} x {item.quantity} - ₹{item.foodId.price * item.quantity}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-4">
                    <p className="text-lg font-semibold">Total: ₹{order[0].totalAmount}</p>
                </div>

                <div className="mb-4">
                    <p className="text-gray-400">Delivery Address: {order.deliveryAddress}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
