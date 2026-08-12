import { useNavigate } from "react-router-dom";

function CategoryCard({ id, name, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?categoryId=${id}`);
  };

  return (
    <div
      className="category-card"
      onClick={handleClick}
    >
      <img
        src={image}
        alt={name}
      />

      <h3>{name}</h3>
    </div>
  );
}

export default CategoryCard;