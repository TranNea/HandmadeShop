import React from "react";
import { MdLocalShipping } from "react-icons/md";
import { CgRedo } from "react-icons/cg";
import './BannerBottom.css'; // Import the CSS file
import { FaPhone } from "react-icons/fa";

const BannerBottom = () => {
  return (
    <div className="banner-container">
      <div className="banner-content">

        <div className="banner-item">
          <span className="banner-icon">3</span>
          <p className="banner-text">Three months warranty</p>
        </div>

        <div className="banner-item">
          <span className="banner-icon">
            <MdLocalShipping />
          </span>
          <p className="banner-text">Fast delivery</p>
        </div>

        <div className="banner-item">
          <span className="banner-icon">
            <CgRedo />
          </span>
          <p className="banner-text">Return policy in 7 days</p>
        </div>

        <div className="banner-item">
          <span className="banner-icon">
            <FaPhone />
          </span>
          <p className="banner-text">Hotline: 0854821565</p>
        </div>

      </div>
    </div>
  );
};

export default BannerBottom;