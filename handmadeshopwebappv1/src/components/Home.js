import React from "react";
import BannerBottom from "../layouts/Banner/BannerBottom"
import Banner from "../layouts/Banner/Banner"
import Sale from "../layouts/Banner/Sale";
import YearProduct from "../layouts/Banner/YearProduct";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="w-full mx-auto">
            <Banner />
            <BannerBottom />
            <div className="max-w-container mx-auto px-4">
                <Sale />

                <div style={{ textAlign: 'center' }}>
                    <h1 className="text-3xl font-titleFont font-bold"> Learn on our Blog </h1>
                    <p className="text-lg text-gray-700 mx-auto" style={{ paddingTop: '20px', maxWidth: '1000px' }}>
                        Hey there fellow crocheters! Are you looking for fun and easy-to-follow amigurumi tutorials and tips? Look no further than our Blog!
                        By clicking the link below, you'll gain access to a whole library of free amigurumi tutorials and helpful tips.
                    </p>
                    <p className="text-lg text-gray-700 mx-auto" style={{ paddingTop: '20px', maxWidth: '1000px', marginBottom: '30px' }}>
                        Whether you're a beginner or an experienced crocheter, my channel offers something for everyone.
                        From adorable animal designs to cute character creations, I have a variety of patterns to choose from.
                        Plus, my tutorials are designed to be easy-to-follow and enjoyable to make.
                    </p>
                    <Link to="/login" style={{ padding: '10px' }}
                        className="bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                    > Go to Blog </Link>
                </div>

                <YearProduct />

                <div style={{ textAlign: 'center' }}>
                    <h1 className="text-3xl font-titleFont font-bold"> Discover Amigurumi Crochet </h1>
                    <p className="text-lg text-gray-700 mx-auto" style={{ paddingTop: '20px', maxWidth: '1000px', marginBottom: '30px' }}>
                        With a passion for the craft and a commitment to running our business with environmentally responsible production practices,
                        we take immense pride in our work and strive to bring you the best in handmade crochet items.
                        <br/>
                        At The Crochet Boutique, we use the highest quality yarn that is free of harmful chemicals and safe for your little ones to play with. 
                        Each piece is crafted with exquisite detail and made with the utmost attention to detail.
                    </p>
                    <Link to="/login" style={{ padding: '10px' }}
                        className="bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                    > Shopping Now </Link>
                </div>
            </div>
        </div>
    )
}

export default Home