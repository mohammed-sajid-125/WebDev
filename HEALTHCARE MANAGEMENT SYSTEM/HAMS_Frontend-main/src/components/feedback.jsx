import { useState, useEffect, useRef } from "react";
import sampleFeedbacks from "../constants/feedback";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Feedback=() =>{
    const feedbacks = sampleFeedbacks;
    const [current,setCurrent] = useState(0);
    const length = feedbacks.length;
    const intervalRef = useRef();

    useEffect(() => {
      // Start auto-slide
      intervalRef.current = setInterval(() => {
        setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(intervalRef.current);
    }, [length]);

    if(!Array.isArray(feedbacks) || length ===0) return null;

    const { photo,review,name } = feedbacks[current];

    const nextSlide = () => setCurrent(prev => (prev === length-1?0:prev+1));
    const prevSlide= () => setCurrent(prev => (prev===0 ? length-1 : prev-1));
    return <>
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
         <div className=" text-2xl font-bold text-blue-900 ">
        Our  <span className="text-teal-600"> patients'</span> feedback about us
      </div>
      </div>
       
      
      <div className="bg-white">
        <div
          className="bg-[#e8eaf6] flex flex-row h-80"
          onMouseEnter={() => clearInterval(intervalRef.current)}
          onMouseLeave={() => {
            intervalRef.current = setInterval(() => {
              setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
            }, 4000);
          }}
        >
          <div className="w-1/3 mt-6 ml-0 flex justify-center">
          <div className="rounded-2xl ">
            <div className="border-teal-600 w-78 h-78 pt-2 pl-2  border-t-2 border-l-2 rounded-2xl">
              <div className="w-80 aspect-square flex items-center justify-center  rounded-2xl mx-auto mb-2 p-1">
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-full object-cover rounded-2xl shadow"
                />
              </div>
            </div>
            
          </div>
            
          </div>
          <div className="w-2/3 p-6 flex items-center justify-center text-center">
            <p className="text-xl text-gray-700 leading-relaxed">
               "{review} " 
            </p>
          </div>
        </div>
        <div className="flex flex-row md:flex-col items-center justify-between gap-4 m-3 p-4">
          <div className="flex w-full justify-between items-center">
            {/* Name & Tag */}
            <div></div>
            <div className="flex flex-col items-center mt-4">
              <p className="font-semibold text-gray-900 text-lg">{name}</p>
              <p className="text-sm text-gray-500">HAMSA Customer</p>
            </div>

            {/* Arrows */}
            <div className="mt-4 flex flex-row gap-5 text-gray-600">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="hover:text-teal-600 transition-colors"
              >
                <FaArrowLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="hover:text-teal-600 transition-colors"
              >
                <FaArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
}

export default Feedback;