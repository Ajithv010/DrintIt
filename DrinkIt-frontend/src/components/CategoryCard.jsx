import { useNavigate } from "react-router-dom";

function CategoryCard({ id, name, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?categoryId=${id}`);
  };

  return (
    <button
      type="button"
      className="category-card"
      onClick={handleClick}
    >
      <img
        src={image}
        alt={name}
      />

      <h3>{name}</h3>
    </button>
  );
}

export default CategoryCard;