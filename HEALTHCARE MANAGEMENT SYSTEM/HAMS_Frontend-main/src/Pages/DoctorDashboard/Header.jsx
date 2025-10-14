import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center">
        <IconButton
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="text-white hover:text-gray-300"
        >
          <MenuIcon />
        </IconButton>
      </div>
      <div className="items-center gap-4 justify-end flex">
        <h5 className="font-semibold">Doctor Dashboard</h5>
          <IconButton
            onClick={() => navigate("/")}
            aria-label="Go to Home"
            className="text-white hover:text-gray-300"
          >
            <HomeIcon />
          </IconButton>
        </div>
    </header>
  );
};

export default Header;
