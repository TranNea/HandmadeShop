import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authAPI, endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import { UserContext } from "../../configs/MyContext";
import { Button, Table, Form } from "react-bootstrap";

const OrderDetails = () => {
    const { orderId } = useParams();
    const [user] = useContext(UserContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [refundReason, setRefundReason] = useState("");
    const navigate = useNavigate();

    const getStatusLabel = (status) => {
        switch (status) {
            case 'P':
                return 'Preparing';
            case 'S':
                return 'Shipping';
            case 'D':
                return 'Delivered';
            case 'R':
                return 'Returning';
            case 'C':
                return 'Canceled';
            default:
                return 'Unknown';
        }
    };

    const getPaymentMethodLabel = (method) => {
        const methodMap = {
            'B': 'BANKING',
            'Q': 'QR CODE',
            'C': 'COD'
        };
        return methodMap[method] || 'Unknown';
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await authAPI().get(endpoints['order-details'](orderId));
                setOrder(res.data);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleCancelOrder = async () => {
        try {
            await authAPI().patch(endpoints['cancel-orders'](orderId));
            setOrder(prevOrder => ({ ...prevOrder, status: 'C' }));
            alert(`Canceled Order.`);
        } catch (error) {
            console.error("Failed to cancel order:", error);
        }
    };

    const handleReceiveOrder = async () => {
        try {
            await authAPI().patch(endpoints['receive-orders'](orderId));
            setOrder(prevOrder => ({ ...prevOrder, status: 'D' }));
            alert(`Received Order.`);
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    const handleRequestRefund = async () => {
        if (!refundReason.trim()) {
            alert("Please enter a reason for the refund.");
            return;
        }

        try {
            await authAPI().post(endpoints['refunds'], { order_id: orderId, reason: refundReason });
            setShowRefundForm(false);
            setRefundReason("");
            alert(`Refund has been requested.`);
        } catch (error) {
            console.error("Failed to request refund:", error);
            alert("Failed to request refund.");
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!order) {
        return (
            <div className="order-detail-container">
                <h2>Order not found.</h2>
                <Button onClick={() => navigate("/orders")}
                    className="w-44 bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                >Back to Orders</Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold">Order Details</h1>

            <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'flex-start' }}>
                <Button onClick={() => navigate("/orders")}
                    className="w-44 bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                    style={{ marginTop: '20px' }}>
                    Back to Orders
                </Button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                <div style={{ display: '1 1 45%', minWidth: '500px' }}>
                    <h3 className="text-xl font-bold border-b-2 pb-2 mb-4">Information</h3>
                    <div>
                        <p style={{ margin: '10px 15px' }}><strong>Order ID:</strong> {order.id}</p>
                        <p style={{ margin: '10px 15px' }}><strong>Name:</strong> {user.username}</p>
                        <p style={{ margin: '10px 15px' }}><strong>Address:</strong> {order.shipping_address}</p>
                        <p style={{ margin: '10px 15px' }}><strong>Phone:</strong> {user.phone}</p>
                        <p style={{ margin: '10px 15px' }}><strong>Email:</strong> {user.email}</p>
                        <p style={{ margin: '10px 15px' }}><strong>Status:</strong> {getStatusLabel(order.status)}</p>
                    </div>
                </div>

                <div style={{ display: '1 1 45%', minWidth: '500px' }}>
                    <h3 className="text-xl font-bold border-b-2 pb-2 mb-4">Products</h3>

                    <Table style={{ marginBottom: '20px', minWidth: '500px' }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td style={{ textAlign: 'center' }}>{item.product.name}</td>
                                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'center' }}>{item.final_price.toLocaleString("en")} VNĐ</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div>
                        <p style={{ margin: '10px 15px' }}><strong>Voucher:</strong> {order.voucher ? `${order.voucher.code} (-${order.voucher.value.toLocaleString("en")} VNĐ)` : "None"}</p>
                        <p style={{ margin: '10px 15px' }}><strong>Shipping Fee:</strong> 35,000 VNĐ</p>
                        <p style={{ margin: '10px 15px' }}><strong>Total Price:</strong> {order.total_order_price.toLocaleString("en")} VNĐ</p>
                        <p style={{ margin: '10px 15px' }}><strong>Payment Method:</strong> {getPaymentMethodLabel(order.payment_method)}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                {order.status === 'P' && (
                    <Button variant="danger" onClick={handleCancelOrder}
                        className="w-44 bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200">
                        Cancel Order
                    </Button>
                )}

                {order.status === 'S' && (
                    <Button variant="success" onClick={handleReceiveOrder}
                        className="w-44 bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200">
                        Receive Order
                    </Button>
                )}

                {order.status === 'D' && (
                    <>
                        {!showRefundForm ? (
                            <Button variant="warning" onClick={() => setShowRefundForm(true)}
                                className="bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                                style={{ width: '150px' }}>
                                Request Refund
                            </Button>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter refund reason"
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    style={{ width: '250px' }}
                                />

                                <Button variant="primary" onClick={handleRequestRefund}
                                    className="bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                                    style={{ width: '100px' }}>
                                    Send
                                </Button>

                                <Button variant="secondary" onClick={() => { setShowRefundForm(false); setRefundReason(""); }}
                                    className="text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                                    style={{ width: '100px', backgroundColor: '#A9A9A9' }}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;