import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const StarRating = ({ rating }) => {
  const stars = [];
  
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} />);
  }

  const hasHalfStar = rating % 1 >= 0.5;
  if (hasHalfStar) {
    stars.push(<StarHalfIcon key="half" />);
  }

  const totalStars = hasHalfStar ? fullStars + 1 : fullStars;
  for (let i = totalStars; i < 5; i++) {
    stars.push(<StarBorderIcon key={`empty-${i}`} />);
  }

  return (
    <div style={{ color: '#f5c518', display: 'flex' }}>
      {stars}
    </div>
  );
};

export default StarRating;
