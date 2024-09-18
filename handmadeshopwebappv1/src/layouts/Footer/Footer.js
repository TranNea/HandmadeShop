import React from "react";
import { FaFacebook, FaInstagram} from "react-icons/fa";
import FooterListTitle from "./FooterListTitle";
import payment from "../../assets/images/payment.png";

const Footer = () => {
    return (
        <div className="w-full bg-[#F5F5F3] py-20">
            <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-6 px-4 gap-10">

                <div className="col-span-2">
                    <FooterListTitle title=" More about Chau Crochet Shop" />
                    <div className="flex flex-col gap-6">
                        <p className="text-base w-full xl:w-[80%]">
                            At "Chau Crochet Shop," we believe that every thread tells a unique story. 
                            Let your imagination run wild, and let your hands bring your vision to life. 
                            Whether you're a seasoned crafter or just embarking on your creative journey or just a customer, we've got something special for you.
                        </p>
                        <ul className="flex items-center gap-2">
                            <a
                                href="https://www.instagram.com/chau_crochet?igsh=ODlwNHNoZTdmOTVv"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <li className="w-7 h-7 bg-primeColor text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-black duration-300">
                                    <FaInstagram />
                                </li>
                            </a>
                            <a
                                href="https://www.facebook.com/profile.php?id=100023449041404"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <li className="w-7 h-7 bg-primeColor text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-black duration-300">
                                    <FaFacebook />
                                </li>
                            </a>
                        </ul>
                    </div>
                </div>

                <div>
                    <FooterListTitle title="Shop" />
                    <ul className="flex flex-col gap-2">
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            Mihoyo's Amigurumi
                        </li>
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            Amigurumi
                        </li>
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            Key chain
                        </li>
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            Home appliances
                        </li>
                        <li className="font-titleFont text-base text-lightText hover:text-black hover:underline decoration-[1px] decoration-gray-500 underline-offset-2 cursor-pointer duration-300">
                            New Arrivals
                        </li>
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
                            Favourite
                        </li>
                    </ul>
                </div>

                <div className="col-span-2 flex flex-col items-center w-full px-4">
                    <FooterListTitle title="Subscribe to our shop." />
                    <div className="w-full">
                        <p className="text-center mb-4">
                            Subscribe to our Facebook or Instagram to the first to recieve news about our amazing deals and offers.
                        </p>

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