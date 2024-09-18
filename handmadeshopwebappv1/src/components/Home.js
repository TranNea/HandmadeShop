import React from "react";
import BannerBottom from "../layouts/Banner/BannerBottom"
import Banner from "../layouts/Banner/Banner"
import Sale from "../layouts/Banner/Sale";
import YearProduct from "../layouts/Banner/YearProduct";

const Home = () => {
    return (
        <div className="w-full mx-auto">
            <Banner />
            <BannerBottom />
            <div className="max-w-container mx-auto px-4">
                <Sale />
                <YearProduct />
            </div>
        </div>
    )
}

export default Home