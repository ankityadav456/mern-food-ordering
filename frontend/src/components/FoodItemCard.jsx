import PropTypes from "prop-types"; // ✅ Import PropTypes

const FoodItemCard = ({ item, addToCart }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h2 className="text-lg font-semibold">{item.name}</h2>
      <p className="text-gray-600">${item.price}</p>
      <button
        onClick={() => addToCart(item)}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

// ✅ Define prop types for better debugging
FoodItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default FoodItemCard;
