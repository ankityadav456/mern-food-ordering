import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, quantity) => {
    updateQuantity(itemId, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-6">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 shadow-lg rounded-md">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-grow ml-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-lg text-gray-600">${item.price}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-2 py-1 bg-blue-500 text-white rounded-md">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-2 py-1 bg-blue-500 text-white rounded-md">+</button>
                </div>
              </div>
              <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-400">
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Link to="/checkout" className="bg-green-600 text-white p-3 rounded-lg">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
