import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { authAPI, endpoints } from "../configs/API";
import Loading from "../layouts/Loading";
import { UserContext } from "../configs/MyContext";
import { Link, Navigate } from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user] = useContext(UserContext);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const res = await authAPI().get(endpoints['carts']);
                setCart({ items: res.data });
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        loadCart();
    }, []);

    const removeFromCart = async (productId) => {
        try {
            await authAPI().delete(endpoints['remove-carts'], {
                data: { product_id: productId }
            });
            setCart((curr) => ({ ...curr, items: curr.items.filter(item => item.product.id !== productId) }));
        } catch (error) {
            console.error("Failed to remove product from cart:", error);
        }
    };

    const totalPrice = () => {
        if (!cart || !cart.items) return 0;

        return cart.items.reduce((total, item) => {
            const discountedPrice = item.product.discount ? (item.product.price - item.product.discount) : item.product.price;
            return total + (discountedPrice * item.quantity);
        }, 0);
    };
    const getTotalPrice = totalPrice();

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;

        const item = cart.items.find(item => item.product.id === productId);
        if (item && quantity > item.product.quantity) {
            alert(`Maximum quantity available is ${item.product.quantity}`);
            return;
        }

        try {
            await authAPI().patch(endpoints['update-carts'], {
                product_id: productId,
                quantity: quantity
            });
            setCart((curr) => ({
                ...curr,
                items: curr.items.map(item =>
                    item.product.id === productId ? {
                        ...item,
                        quantity: quantity,
                        final_price: item.product.discount
                            ? (item.product.price - item.product.discount) * quantity
                            : item.product.price * quantity
                    } : item
                )
            }));
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    if (user === null) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <Loading />;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
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
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Cart</h1>

            <Table className="border p-6 rounded-md shadow-md" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ width: '25%', paddingTop: '15px' }}>Image</th>
                        <th style={{ width: '30%', paddingTop: '15px' }}>Product</th>
                        <th style={{ width: '15%', paddingTop: '15px' }}>Quantity</th>
                        <th style={{ width: '15%', paddingTop: '15px' }}>Price</th>
                        <th style={{ width: '15%', paddingTop: '15px' }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {cart.items.map(item => (
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
                                <Button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                                <span style={{ padding: '0 10px' }}>{item.quantity}</span>
                                <Button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</Button>
                            </td>
                            <td style={{ textAlign: 'center' }}>{item.final_price.toLocaleString("en")} VNĐ</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button
                                    className="text-black h-10 font-semibold hover:text-white duration-200"
                                    style={{ padding: '0 10px', backgroundColor: 'red' }}
                                    onClick={() => removeFromCart(item.product.id)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <h3 className="text-base font-titleFont font-semibold px-2" style={{ marginRight: '30px' }}>Total Price: {getTotalPrice.toLocaleString("en")} VNĐ</h3>
                <Button className="w-44 bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200">
                    Order
                </Button>
            </div>
        </div>
    );
};

export default Cart;