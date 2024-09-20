import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import FooterListTitle from "./FooterListTitle";
import payment from "../../assets/images/payment.png";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="w-full bg-[#F5F5F3] py-20">
            <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-6 px-4 gap-10">

                <div className="col-span-2">
                    <FooterListTitle title=" More about Chau Crochet Shop" />
                    <div className="flex flex-col gap-6">
                        <p className="text-base w-full xl:w-[80%]">
                            At "Chau Crochet Shop", we believe that every thread tells a unique story.
                            Whether you're a seasoned crafter or just embarking on your creative journey or just a customer, we've got something special for you.
                        </p>
                        <ul className="flex items-center gap-2">
                            <a
                                href="https://www.instagram.com/chau_crochet?igsh=ODlwNHNoZTdmOTVv"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <li className="w-7 h-7 bg-black text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center duration-300">
                                    <FaInstagram />
                                </li>
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=100023449041404"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <li className="w-7 h-7 bg-black text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center duration-300">
                                    <FaFacebook />
                                </li>
                            </a>
                        </ul>
                    </div>
                </div>

                <div>
                    <FooterListTitle title="Shop" />
                    <ul className="flex flex-col gap-2">
                        <Link to="/">
                            <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                                Home
                            </li>
                        </Link>

                        <Link to="/product">
                            <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                                Product
                            </li>
                        </Link>

                        <Link to="/blogs">
                            <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                                Blog
                            </li>
                        </Link>

                        <Link to="/about">
                            <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                                About Us
                            </li>
                        </Link>

                        <Link to="/contact">
                            <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                                Contact Us
                            </li>
                        </Link>

                    </ul>
                </div>

                <div>
                    <FooterListTitle title="Your account" />
                    <ul className="flex flex-col gap-2">
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            Profile
                        </li>
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            Orders
                        </li>
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            Wishlist
                        </li>
                    </ul>
                </div>

                <div className="col-span-2 flex flex-col items-center w-full px-4">
                    <FooterListTitle title="Subscribe to our shop." />
                    <div className="w-full">

                        <p className="text-center mb-4"> Address: 539/32 Hương Lộ 3, Bình Hưng Hoà, Bình Tân, TP. Hồ Chí Minh </p>
                        <p className="text-center mb-4"> Email: 2151050296nhan@ou.edu.vn </p>

                        <img
                            src={payment}
                            alt="Payment Methods"
                            className="w-[80%] lg:w-[60%] mx-auto"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Footer;