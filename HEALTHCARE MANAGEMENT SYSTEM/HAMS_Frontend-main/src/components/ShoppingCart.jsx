import { useRef } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VitaminImg from "../assets/Vitamins.jpg"
import NutritonalDrink from "../assets/Nutritonal Drink.jpg";
import Skincare from "../assets/Skin Care.jpg";
import Wellness from "../assets/Wellness.jpg";
import Sexual from "../assets/sexualwellness.jpg";
import home from "../assets/home.jpg";
import pets from "../assets/pets.jpg";
import background from "../assets/background.jpg";
import ScrollButton from "./scrollButton";


const Shopping = () => {

  const shopCart = [
  {
    title: "Vitamins",
    image: VitaminImg,
  },
  {
    title: "Nutritional Drink",
    image: NutritonalDrink,
  },
  {
    title: "Skin Care",
    image: Skincare,
  },
  {
    title: "Wellness",
    image: Wellness,
  },
  {
    title: "Sexual Wellness",
    image: Sexual,
  },
  {
    title: "Home",
    image: home,
  },
  {
    title: "Pets",
    image: pets,
  },
];

  
  const carouselRef = useRef(null);

  const handleScroll = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };


  return (
   <div
  style={{ backgroundImage: `url(${background})` }}
  className="bg-cover bg-center h-[500px] flex items-center justify-center px-4"
>
  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl w-full">
    <div className="text-center mb-6">
      <h2 className="text-2xl sm:text-3xl font-semibold">
        <span className="text-green-600 font-bold">Shop</span>{" "}
        <span className="text-blue-900">for Medicines & Wellness</span>{" "}
        <span className="inline-block text-blue-900 ml-1">🛒</span>
      </h2>
      <p className="text-gray-500 text-sm mt-2">
        Shop everything that you need in one go...
      </p>
    </div>

    <div className="relative">
      <ScrollButton direction="left" onClick={() => handleScroll(-600)} className="left-0"/>
      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {shopCart.map((item, idx) => (
          <div
            key={idx}
            className=" snap-start flex-shrink-0 w-40 sm:w-48 bg-white rounded-xl shadow-md text-center p-3 hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-28 object-cover rounded-md mb-2"
            />
            <p className="text-sm font-medium text-gray-800">{item.title}</p>
          </div>
        ))}
      </div>
     <ScrollButton direction="right" onClick={() => handleScroll(600)} className="right-0"/>
    </div>
  </div>
</div>
  );
};

export default Shopping;
