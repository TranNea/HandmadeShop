import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.webp";
import { motion } from "framer-motion";
import APIs, { endpoints } from '../../configs/API';
import Flex from "../../layouts/Flex";
import Image from "../../layouts/Image";

const Header = () => {
    return (
        <div className="w-full h-20 bg-white sticky top-0 z-50 border-b-[1px] border-b-gray-200">
            <nav className="h-full px-4 max-w-container mx-auto relative">
                <Flex className="flex items-center justify-between h-full">

                    <Link to="/">
                        <div>
                            <Image className="w-20 object-cover" imgSrc={logo} />
                        </div>
                    </Link>

                    <div>
                        <motion.ul
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center w-auto z-50 p-0 gap-2"
                        >
                            <>
                                <NavLink className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                                    to="/">
                                    <li>Home</li>
                                </NavLink>

                                <NavLink className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                                    to="/product">
                                    <li>Product</li>
                                </NavLink>

                                <NavLink className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                                    to="/blogs">
                                    <li>Blog</li>
                                </NavLink>

                                <NavLink className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                                    to="/about">
                                    <li>About</li>
                                </NavLink>

                                <NavLink className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                                    to="/contact">
                                    <li>Contact</li>
                                </NavLink>
                            </>
                        </motion.ul>
                    </div>

                </Flex>
            </nav>
        </div >
    );
};

export default Header;