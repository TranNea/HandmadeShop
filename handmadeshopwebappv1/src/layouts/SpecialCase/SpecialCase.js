import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";

const SpecialCase = () => {
    const [showGoToTop, setShowGoToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowGoToTop(true);
            } else {
                setShowGoToTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
            <Link to="/profile">
                <div style={{ boxShadow: '0 0 25px #AAA' }} className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center overflow-x-hidden group cursor-pointer">
                    <div className="flex justify-center items-center">
                        <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

                        <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
                    </div>
                    <p className="text-xs font-semibold font-titleFont">Profile</p>
                </div>
            </Link>
            
            <Link to="/carts">
                <div style={{ boxShadow: '0 0 25px #AAA' }} className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center overflow-x-hidden group cursor-pointer relative">
                    <div className="flex justify-center items-center">
                        <RiShoppingCart2Fill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

                        <RiShoppingCart2Fill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
                    </div>
                    <p className="text-xs font-semibold font-titleFont">Buy Now</p>
                </div>
            </Link>

            {showGoToTop && (
                <div
                    onClick={scrollToTop}
                    style={{ boxShadow: '0 0 25px #AAA' }}
                    className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center cursor-pointer"
                >
                    <FaArrowUp className="text-2xl" />
                    <p className="text-xs font-semibold font-titleFont">Top</p>
                </div>
            )}
        </div>
    );
};

export default SpecialCase;