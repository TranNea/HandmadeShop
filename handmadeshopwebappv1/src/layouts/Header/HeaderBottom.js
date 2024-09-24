import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart, FaHeart } from "react-icons/fa";
import Flex from "../../layouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import { UserContext } from "../../configs/MyContext"


const HeaderBottom = () => {
    const [showUser, setShowUser] = useState(false);
    const navigate = useNavigate();
    const [kw, setKw] = useState("");
    const [user, dispatch] = useContext(UserContext)

    const search = (evt) => {
        evt.preventDefault();
        navigate(`/products/?kw=${kw}`);
    };

    const toggleUserMenu = () => {
        setShowUser(prev => !prev);
    };

    const handleClickOutside = (e) => {
        if (showUser && !e.target.closest('.user-menu') && !e.target.closest('.user-icon')) {
            setShowUser(false);
        }
    };

    useEffect(() => {
        document.body.addEventListener("click", handleClickOutside);
        return () => {
            document.body.removeEventListener("click", handleClickOutside);
        };
    }, [showUser]);

    const logout = () => {
        dispatch({ "type": "logout" });
        navigate("/");
    }

    return (
        <div className="w-full bg-[#F5F5F3] relative">
            <div className="max-w-container mx-auto">
                <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
                    <div></div>

                    <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
                        <Form inline onSubmit={search} className="flex w-full">
                            <Form.Control
                                type="search"
                                placeholder="Search here..."
                                className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
                                value={kw}
                                onChange={evt => setKw(evt.target.value)}
                            />
                            <Button type="submit" className="ml-2">
                                <FaSearch className="w-5 h-5" />
                            </Button>
                        </Form>
                    </div>

                    <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
                        <Link to="/">
                            <div className="relative">
                                <FaHeart />
                            </div>
                        </Link>

                        <Link to="/">
                            <div className="relative">
                                <FaShoppingCart />
                            </div>
                        </Link>

                        <div onClick={toggleUserMenu} className="flex user-icon">
                            <FaUser />
                            <FaCaretDown />
                        </div>

                        {showUser && (
                            <motion.ul
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="absolute top-6 right-0 z-50 bg-black w-44 text-[#767676] h-auto p-4 pb-6 user-menu rounded-md shadow-lg"
                            >
                                {user === null ? (
                                    <div>
                                        <Link to="/login" onClick={() => setShowUser(false)}>
                                            <li className="text-gray-400 px-4 py-2 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                                Login
                                            </li>
                                        </Link>
                                        <Link to="/register" onClick={() => setShowUser(false)}>
                                            <li className="text-gray-400 px-4 py-2 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                                Sign Up
                                            </li>
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        <Link to="/profile" onClick={() => setShowUser(false)}>
                                            <li className="text-gray-400 px-4 py-2 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                                Profile
                                            </li>
                                        </Link>
                                        <Link to="/" onClick={() => setShowUser(false)}>
                                            <li className="text-gray-400 px-4 py-2 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                                                Orders
                                            </li>
                                        </Link>
                                        <li onClick={() => { logout(); setShowUser(false); }} className="text-gray-400 px-4 py-2 hover:text-white duration-300 cursor-pointer">
                                            Log out
                                        </li>
                                    </div>
                                )}
                            </motion.ul>
                        )}
                    </div>
                </Flex>
            </div>
        </div>
    );
};

export default HeaderBottom;
