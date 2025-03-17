import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-md" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 my-2">{product.description}</p>
          <p className="text-2xl font-semibold text-primary">${product.price}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
