import React from "react";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import banner1 from "../../assets/images/banner1.webp";
import banner2 from "../../assets/images/banner2.webp";
import banner3 from "../../assets/images/banner3.jpeg";
import './Banner.css';

const Banner = () => {
    const images = [banner1, banner2, banner3];

    return (
        <Slide>
            {images.map((image, index) => (
                <div className="each-slide-effect" key={index}>
                    <div style={{ backgroundImage: `url(${image})` }}>
                    </div>
                </div>
            ))}
        </Slide>
    );
};

export default Banner;
