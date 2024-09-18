import React from "react";
import { Link } from "react-router-dom";
import sale1 from "../../assets/images/sale1.jpeg";
import sale2 from "../../assets/images/sale2.jpeg";
import sale3 from "../../assets/images/sale3.jpeg";
import Image from "../../layouts/Image";
import './Sale.css';

const Sale = () => {
    return (
        <div className="container">
            <div className="image-wrapper large">
                <Link to="/">
                    <Image className="full-image" imgSrc={sale1} />
                </Link>
            </div>
            <div className="image-column">
                <div className="image-wrapper">
                    <Link to="/">
                        <Image className="full-image" imgSrc={sale2} />
                    </Link>
                </div>
                <div className="image-wrapper">
                    <Link to="/">
                        <Image className="full-image" imgSrc={sale3} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sale;