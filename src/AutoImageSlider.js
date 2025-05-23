import React, { useState, useEffect } from "react";
import "./AutoImageSlider.css";
const AutoImageSlider = ({ images, autoPlay = false, autoPlayInterval = 3000, }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        let interval;
        if (autoPlay) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
            }, autoPlayInterval);
        }
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, images]);
    return (<div className="auto-image-slider">
      <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex}`} className="slider-image"/>
    </div>);
};
export default AutoImageSlider;
