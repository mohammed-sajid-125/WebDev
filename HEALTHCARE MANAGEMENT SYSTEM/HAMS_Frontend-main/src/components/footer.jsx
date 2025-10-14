import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <footer className="bg-[#fafbfc] pt-10 pb-2 border-t border-gray-200 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand Description */}
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-xl md:text-2xl font-bold mb-2">HAMSA</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Health care refers to the efforts that medical professionals make to restore our physical and mental well-being. The term also includes the provision of services to maintain emotional well-being. We call people and organizations that provide these services health-care providers.
            </p>
          </div>
          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 w-full md:w-2/3">
            <div className="mb-4 sm:mb-0 w-full sm:w-auto">
              <h3 className="text-base font-semibold text-[#527C88] mb-2">Overview</h3>
              <ul className="space-y-1 text-gray-700">
                <li>Medicines</li>
                <li>Healthcare Devices</li>
                <li>Health Progress</li>
              </ul>
            </div>
            <div className="mb-4 sm:mb-0 w-full sm:w-auto">
              <h3 className="text-base font-semibold text-[#527C88] mb-2">Company</h3>
              <ul className="space-y-1 text-gray-700">
                <li>Home</li>
                <li>About us</li>
                <li>Services</li>
              </ul>
            </div>
            <div className="mb-4 sm:mb-0 w-full sm:w-auto">
              <h3 className="text-base font-semibold text-[#527C88] mb-2">Explore</h3>
              <ul className="space-y-1 text-gray-700">
                <li>Blogs & Feeds</li>
                <li>Privacy Policy</li>
                <li>Cookies</li>
              </ul>
            </div>
            <div className="w-full sm:w-auto">
              <h3 className="text-base font-semibold text-[#527C88] mb-2">Social Media</h3>
              <div className="flex gap-4 mt-2">
                <FacebookOutlinedIcon fontSize="medium" />
                <InstagramIcon fontSize="medium" />
                <GitHubIcon fontSize="medium" />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-xs text-gray-500">
          Copyright © HAMSA 2025
        </div>
      </div>
    </footer>
  );
};

export default Footer;
