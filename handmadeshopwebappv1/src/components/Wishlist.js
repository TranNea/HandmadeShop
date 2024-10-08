import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { authAPI, endpoints } from "../configs/API";
import Loading from "../layouts/Loading";
import { UserContext } from "../configs/MyContext";
import { Link, Navigate } from "react-router-dom"

const Wishlist = () => {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user,] = useContext(UserContext);

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const res = await authAPI().get(endpoints['wishlists']);
                setWishlist(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        loadWishlist();
    }, []);

    const removeFromWishlist = async (productId) => {
        try {
            await authAPI().delete(endpoints['remove-wishlists'](productId));
            setWishlist((curr) => curr.filter(item => item.product.id !== productId));
        } catch (error) {
            console.error("Failed to remove product from wishlist:", error);
        }
    };

    if (user === null) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <Loading />;
    }

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="mx-auto">
                <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Wishlist</h1>
                <Link to="/products"
                    style={{ padding: '10px', margin: '20px' }}
                    className="bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                >
                    Shopping Now
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '100%', margin: '0 60px' }}>
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Wishlist</h1>

            <Table className="border p-6 rounded-md shadow-md" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ width: '25%', paddingTop: '15px' }}>Image</th>
                        <th style={{ width: '30%', paddingTop: '15px' }}>Product</th>
                        <th style={{ width: '25%', paddingTop: '15px' }}>Status</th>
                        <th style={{ width: '20%', paddingTop: '15px' }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {wishlist.map(item => (
                        <tr key={item.id}>
                            <td style={{ display: 'flex', justifyContent: 'center', padding: '15px 0' }}>
                                <img
                                    src={item.product.image1}
                                    alt={item.product.name}
                                    style={{ width: '150px', height: '150px' }}
                                />
                            </td>
                            <td style={{ textAlign: 'center' }}>{item.product.name}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span className="font-semibold" style={{ padding: '5px', backgroundColor: item.product.status === 'O' ? 'yellow' : 'lightgreen' }}>
                                    {item.product.status === 'O' ? 'Out of Stock' : 'Stock'}
                                </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <Button
                                    className="text-black h-10 font-semibold hover:text-white duration-200"
                                    style={{ padding: '0 10px', backgroundColor: 'red' }}
                                    onClick={() => removeFromWishlist(item.product.id)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Wishlist;