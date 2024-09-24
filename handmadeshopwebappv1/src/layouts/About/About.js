import React from "react";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="max-w-container mx-auto px-4">
            <h1 className="text-5xl text-primeColor font-titleFont font-bold pb-20">Hello! We are Chau Crochet Shop </h1>
            <div className="pb-10">
                <h1 className="max-w-[600px] text-base text-lightText mb-2 pb-10">
                    Welcome to <span className="text-primeColor font-semibold text-lg">Chau Crochet Shop</span>
                    , where passion for creativity and love for handmade artistry come together!
                    We are a small but dedicated shop specializing in crafting beautiful, high-quality crochet items.
                    Our product range includes whimsical amigurumi (crocheted stuffed animals and characters), elegant crochet bags,
                    playful crochet keychains and a variety of other handmade creations that bring warmth and charm into your daily life.
                    <br></br>

                    <br></br>
                    At Chau Crochet Shop, we take pride in the meticulous attention to detail and care that goes into each piece we create.
                    Every item is crocheted by hand, ensuring that no two pieces are exactly alike—each creation is as unique as the person who will receive it.
                    We work with the finest yarns and materials, selected for their softness, durability
                    and vibrant colors, ensuring that our products not only look great but are also made to last.
                    <br></br>

                    <br></br>
                    Our signature amigurumi are especially popular, perfect for gifting to loved ones or for adding a touch of playful charm to your home or office.
                    Whether you're looking for a cute plush toy, a stylish accessory, or a meaningful handmade gift, you'll find something special here at <span className="text-primeColor font-semibold text-lg">Chau Crochet Shop</span>.
                    Each piece tells a story of creativity, patience, and the joy of making something by hand.
                    <br></br>

                    <br></br>
                    We are more than just a crochet shop, we are a community of crochet lovers and artisans who are passionate about preserving the beauty of traditional crafts.
                    We are committed to sharing this joy with you, whether through our products or by inspiring others to start their own crochet journey.
                    <br></br>

                    <br></br>
                    Thank you for choosing <span className="text-primeColor font-semibold text-lg">Chau Crochet Shop</span> and supporting handmade craftsmanship.
                    We are excited to share our love for crochet with you and hope that our creations bring as much happiness to your life as they bring to ours.
                </h1>

                <Link to="/products">
                    <button className="w-52 h-10 bg-black text-white">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default About;