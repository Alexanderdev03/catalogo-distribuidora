import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="product-detail">
      <h2>Detalle del Producto {id}</h2>
      {/* Product info and add to cart buttons */}
    </div>
  );
};

export default ProductDetail;
