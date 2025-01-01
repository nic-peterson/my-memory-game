import PropTypes from "prop-types";

function Card({ id, imageUrl, handleCardClick }) {
  return (
    <div className="card" onClick={() => handleCardClick(id)}>
      <img src={imageUrl} alt="cat" />
    </div>
  );
}

Card.propTypes = {
  id: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default Card;
