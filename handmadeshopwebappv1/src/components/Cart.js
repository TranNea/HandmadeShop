import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { authAPI, endpoints } from "../configs/API";
import Loading from "../layouts/Loading";
import { UserContext } from "../configs/MyContext";
import { Link } from "react-router-dom"

const Cart = () => {
    const [cartItems, setCartItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user,] = useContext(UserContext);

    useEffect(() => {
        const loadCart = async () => {
            try {
                let res = await authAPI().get(endpoints['carts']);
                setCartItems(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        loadCart();
    }, []);

    const addToCart = async (productId, quantity) => {
        try {
            let res = await authAPI().post(endpoints['add-carts'], {
                product: productId,
                quantity: quantity
            });
            console.log('Product added to cart', res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await authAPI().delete(`${endpoints['remove-carts']}${cartItemId}/`);
            setCartItems((current) => current.filter(item => item.id !== cartItemId));
        } catch (err) {
            console.error("Failed to remove product from cart:", err);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="mx-auto">
                <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Cart</h1>
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
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Your Cart</h1>

            <Table className="border p-6 rounded-md shadow-md" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ width: '25%', paddingTop: '15px' }}>Image</th>
                        <th style={{ width: '30%', paddingTop: '15px' }}>Product</th>
                        <th style={{ width: '15%', paddingTop: '15px' }}>Price</th>
                        <th style={{ width: '15%', paddingTop: '15px' }}>Quantity</th>
                        <th style={{ width: '15%', paddingTop: '15px' }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                            <td style={{ display: 'flex', justifyContent: 'center', padding: '15px 0' }}>
                                <img
                                    src={item.product?.image1 ? item.product.image1 : 'default-image-url.jpg'}
                                    alt={item.product?.name || 'No name available'}
                                    style={{ width: '150px', height: '150px' }}
                                />

                            </td>
                            <td style={{ textAlign: 'center' }}>{item.product.name}</td>
                            <td style={{ textAlign: 'center' }}>{item.product.price.toLocaleString("en")} VNĐ</td>
                            <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button
                                    className="text-black h-10 font-semibold hover:text-white duration-200"
                                    style={{ padding: '0 10px', backgroundColor: 'red' }}
                                    onClick={() => removeFromCart(item.id)}
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

export default Cart;