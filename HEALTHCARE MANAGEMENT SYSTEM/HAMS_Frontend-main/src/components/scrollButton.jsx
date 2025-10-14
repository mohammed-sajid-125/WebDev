import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

/**
 * ScrollButton - a reusable arrow icon for scrolling.
 * 
 * Props:
 * - direction: "left" | "right"
 * - onClick: function to call on click
 * - className: optional Tailwind or MUI classes
 */
const ScrollButton = ({ direction = "right", onClick, className = "" }) => {
  const Icon = direction === "right" ? ArrowForwardIosIcon : ArrowBackIosNewIcon;

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow ${className}`}>
      <IconButton onClick={onClick} aria-label={`scroll-${direction}`}>
        <Icon className="text-[#10217D]" />
      </IconButton>
    </div>
  );
};

export default ScrollButton;
