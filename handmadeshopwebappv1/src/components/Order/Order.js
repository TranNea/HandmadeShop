import React, { useEffect, useState, useContext } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { authAPI, endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import { UserContext } from "../../configs/MyContext";
import { useNavigate, Navigate } from "react-router-dom";

const Order = () => {
    const [user] = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await authAPI().get(endpoints['orders']);
                setOrders(res.data);
                setFilteredOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleFilterChange = (e) => {
        const status = e.target.value;
        setSelectedStatus(status);
        if (status === "All") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === status));
        }
    };

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

    const handleViewDetails = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    if (loading) {
        return <Loading />;
    }

    if (user === null) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{ maxWidth: '100%', margin: '0 90px' }}>
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Your Orders</h1>

            <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'flex-end' }}>
                <Form.Group controlId="orderStatus">
                    <Form.Label style={{ marginRight: '15px' }}>Filter by Status:</Form.Label>
                    <Form.Control as="select" value={selectedStatus} onChange={handleFilterChange}>
                        <option value="All">All</option>
                        <option value="P">Preparing</option>
                        <option value="S">Shipping</option>
                        <option value="D">Delivered</option>
                        <option value="R">Returning</option>
                        <option value="C">Canceled</option>
                    </Form.Control>
                </Form.Group>
            </div>

            {filteredOrders.length === 0 && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <p>No orders found for the selected status.</p>
                </div>
            )}

            <Table className="border p-6 rounded-md shadow-md" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ width: '30%', padding: '15px 0' }}>Order</th>
                        <th style={{ width: '25%', padding: '15px 0' }}>Price</th>
                        <th style={{ width: '25%', padding: '15px 0' }}>Status</th>
                        <th style={{ width: '20%', padding: '15px 0' }}>Payment</th>
                        <th style={{ width: '25%', padding: '15px 0' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td style={{ textAlign: 'center', paddingTop: '15px' }}>
                                {order.items.map(item => (
                                    <div key={item.id}>
                                        {item.product.name} x {item.quantity}
                                    </div>
                                ))}
                            </td>
                            <td style={{ textAlign: 'center', padding: '15px 0' }}>{order.total_order_price.toLocaleString("en")} VNĐ</td>
                            <td style={{ textAlign: 'center', padding: '15px 0' }}>{getStatusLabel(order.status)}</td>
                            <td style={{ textAlign: 'center', padding: '15px 0' }}>{getPaymentMethodLabel(order.payment_method)}</td>
                            <td style={{ textAlign: 'center', padding: '15px 0' }}>
                                <Button variant="info" onClick={() => handleViewDetails(order.id)} style={{ padding: '0 10px', backgroundColor: 'lightgreen' }}>
                                    View Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Order;