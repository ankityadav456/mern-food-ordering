import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Loader from "../components/Loader"; // 👈 Your global loader

const Cart = () => {
  const {
    cartItems,
    fetchCartItems,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // 👈 For actions like remove/clear

  useEffect(() => {
    const loadCart = async () => {
      await fetchCartItems();
      setLoading(false);
    };
    loadCart();
  }, []);

  const totalPrice = (cartItems || []).reduce(
    (acc, item) => acc + item.foodId.price * item.quantity,
    0
  );

  const handleRemove = async (id) => {
    const confirm = window.confirm("Are you sure you want to remove this item?");
    if (!confirm) return;

    try {
      setActionLoading(true);
      await removeFromCart(id);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    setActionLoading(true);
    await updateItemQuantity(id, quantity);
    setActionLoading(false);
  };

  const handleClearCart = async () => {
    const confirm = window.confirm("Are you sure you want to clear the cart?");
    if (!confirm) return;

    try {
      setActionLoading(true);
      await clearCart();
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0d0d0d]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 pt-8 pb-10 px-8 mx-auto">
      <h2 className="text-3xl font-bold mb-6 border-b border-[#D4AF37] pb-2">
        Your Cart 🛒
      </h2>

      {(!cartItems || cartItems.length === 0) ? (
        <div className="text-center py-20">
          <p className="text-xl mb-4 text-[#D4AF37]">Your cart is empty!</p>
          <Link
            to="/menu"
            className="px-5 py-2 bg-[#B22222] text-white rounded-full hover:bg-[#D4AF37] hover:text-black transition"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.foodId._id}
              className="flex flex-col sm:flex-row justify-between items-center border border-[#2A2A2A] bg-[#1A1A1A] rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.foodId.image}
                  alt={item.foodId.name}
                  className="h-20 w-20 object-cover rounded-lg border border-[#D4AF37]"
                />
                <div>
                  <h3 className="text-lg font-semibold text-[#D4AF37]">{item.foodId.name}</h3>
                  <p className="text-sm text-gray-400">₹{item.foodId.price.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <button
                  onClick={() => handleQuantityChange(item.foodId._id, item.quantity - 1)}
                  className="p-2 rounded-full bg-[#2A2A2A] hover:bg-[#B22222] transition"
                  disabled={actionLoading}
                >
                  <Minus size={16} />
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.foodId._id, item.quantity + 1)}
                  className="p-2 rounded-full bg-[#2A2A2A] hover:bg-[#D4AF37] transition"
                  disabled={actionLoading}
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => handleRemove(item.foodId._id)}
                  className="p-2 rounded-full bg-[#2A2A2A] text-red-500 hover:bg-[#B22222] hover:text-white transition"
                  disabled={actionLoading}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 border-t border-[#2A2A2A] pt-6">
            <p className="text-xl font-bold text-[#D4AF37]">
              Total: ₹{totalPrice.toLocaleString("en-IN")}
            </p>

            <div className="mt-4 sm:mt-0 flex space-x-4">
              <button
                onClick={handleClearCart}
                className="px-5 py-2 bg-[#2A2A2A] text-white rounded-full hover:bg-[#B22222] transition"
                disabled={actionLoading}
              >
                Clear Cart
              </button>
              <button
                onClick={() => toast.success("Proceeding to checkout...")}
                className="px-5 py-2 bg-[#D4AF37] text-black rounded-full hover:bg-[#B22222] hover:text-white transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
