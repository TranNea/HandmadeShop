import React, { useEffect, useState, useContext } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { authAPI, endpoints } from "../configs/API";
import Loading from "../layouts/Loading";
import { UserContext } from "../configs/MyContext";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
    const [user, setUser] = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [voucherValue, setVoucherValue] = useState(0);

    const [formData, setFormData] = useState({
        name: user?.username || "",
        selected_address: user?.address1 || user?.address2 || "",
        custom_address: "",
        phone: user?.phone || "",
        email: user?.email || "",
        payment_method: "C",
    });
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const cartRes = await authAPI().get(endpoints['carts']);
                setCart(cartRes.data);

                let total = cartRes.data.reduce((acc, item) => {
                    const price = item.product.discount
                        ? (item.product.price - item.product.discount) * item.quantity
                        : item.product.price * item.quantity;
                    return acc + price;
                }, 0);
                setTotalPrice(total);

                const voucherRes = await authAPI().get(endpoints['vouchers']);
                setVouchers(voucherRes.data);
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Cập nhật tổng tiền khi Voucher thay đổi
    useEffect(() => {
        if (selectedVoucher) {
            setVoucherValue(selectedVoucher.value);
            setTotalPrice(prev => prev - selectedVoucher.value);
        } else {
            setVoucherValue(0);
            // Tính lại tổng giá tiền mà không áp dụng voucher
            const total = cart?.reduce((acc, item) => {
                const price = item.product.discount
                    ? (item.product.price - item.product.discount) * item.quantity
                    : item.product.price * item.quantity;
                return acc + price;
            }, 0) || 0;
            setTotalPrice(total);
        }
    }, [selectedVoucher, cart]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            custom_address: name === 'selected_address' && value !== 'custom' ? "" : prev.custom_address
        }));
    };

    const handleSelectVoucher = (e) => {
        const voucherId = e.target.value;
        if (voucherId === "") {
            setSelectedVoucher(null);
        } else {
            const voucher = vouchers.find(v => v.id === parseInt(voucherId));
            setSelectedVoucher(voucher);
        }
    };

    const handleCheckOut = async () => {
        if (!formData.name || !getShippingAddress() || !formData.phone || !formData.email) {
            alert("Please fill in all the required fields.");
            return;
        }

        const data = {
            payment_method: formData.payment_method,
            shipping_address: getShippingAddress(),
            voucher_code: selectedVoucher ? selectedVoucher.code : null,
        };

        try {
            await authAPI().post(endpoints['add-orders'], data);
            alert("Order created successfully!");
            // navigate("/orders");
        } catch (error) {
            console.error("Failed to create order:", error);
            alert("Failed to create order.");
        }
    };

    const getShippingAddress = () => {
        if (formData.selected_address === "custom") {
            return formData.custom_address;
        } else {
            return formData.selected_address;
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <h1 className="text-5xl text-primeColor font-titleFont text-center font-bold pb-10">Checkout Details</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>

                {/* Column 1: Payment Information */}
                <div style={{ display: '1 1 45%', minWidth: '500px' }}>
                    <h3 className="text-xl font-bold border-b-2 pb-2 mb-4">Information</h3>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label className="text-base font-titleFont font-semibold px-2">Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                placeholder="Enter your name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label className="text-base font-titleFont font-semibold px-2">Address</Form.Label>
                            <Form.Control
                                as="select"
                                name="selected_address"
                                value={formData.selected_address}
                                onChange={handleAddressChange}
                            >
                                <option value="">-- Select Address --</option>
                                {user.address1 && <option value={user.address1}>Address 1</option>}
                                {user.address2 && <option value={user.address2}>Address 2</option>}
                                <option value="custom">Custom Address</option>
                            </Form.Control>

                            {formData.selected_address === "custom" && (
                                <Form.Control
                                    type="text"
                                    name="custom_address"
                                    value={formData.custom_address}
                                    onChange={handleChange}
                                    className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                    placeholder="Enter your custom address"
                                />
                            )}

                            {formData.selected_address && formData.selected_address !== "custom" && (
                                <div style={{ marginTop: '10px', padding: '10px' }} className="mt-3 p-2 border rounded">
                                    <p>{formData.selected_address}</p>
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label className="text-base font-titleFont font-semibold px-2">Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                placeholder="Enter your phone number"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label className="text-base font-titleFont font-semibold px-2">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                                placeholder="Enter your email"
                            />
                        </Form.Group>
                    </Form>

                    <h6 className="px-2" style={{ fontSize: 'small' }}>Your personal data will be used to process your order, support your experience throughout this website</h6>
                </div>

                {/* Column 2: Your Order */}
                <div style={{ display: '1 1 45%', minWidth: '500px' }}>
                    <h3 className="text-xl font-bold border-b-2 pb-2 mb-4">Your Order</h3>
                    <Table style={{ marginBottom: '20px', minWidth: '500px' }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td style={{ textAlign: 'center' }}>{item.product.name}</td>
                                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'center' }}>{item.final_price.toLocaleString("en")} VNĐ</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Voucher */}
                    <div style={{ marginBottom: '10px' }}>
                        <Form.Label className="text-base font-titleFont font-semibold px-2">Voucher</Form.Label>
                        <Form.Control
                            as="select"
                            name="voucher"
                            value={selectedVoucher ? selectedVoucher.id : ""}
                            onChange={handleSelectVoucher}
                        >
                            <option value="">-- Select Voucher --</option>
                            {vouchers.map(voucher => (
                                <option key={voucher.id} value={voucher.id}>
                                    {voucher.code} (-{voucher.value.toLocaleString("en")} VNĐ)
                                </option>
                            ))}
                        </Form.Control>
                    </div>

                    {/* Total Price */}
                    <div>
                        <h5 style={{ marginBottom: '10px' }}>
                            <span className="text-base font-titleFont font-semibold px-2"> Total Price: </span> {totalPrice.toLocaleString("en")} VNĐ
                        </h5>

                        <h5 style={{ marginBottom: '10px' }}> <span className="text-base font-titleFont font-semibold px-2"> Ship: </span> 35,000 VNĐ</h5>

                        <h5 style={{ marginBottom: '10px' }}>
                            <span className="text-base font-titleFont font-semibold px-2"> Total Payment: </span> {(totalPrice + 35000).toLocaleString("en")} VNĐ
                        </h5>
                    </div>

                    {/* Payment Method */}
                    <Form.Group className="mb-3" controlId="formPaymentMethod">
                        <Form.Label className="text-base font-titleFont font-semibold px-2">Payment Method</Form.Label>
                        <Form.Control
                            as="select"
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                        >
                            <option value="B">BANKING</option>
                            <option value="Q">QR CODE</option>
                            <option value="C">COD</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Check Out Button */}
                    <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'center' }}>
                        <Button variant="primary" onClick={handleCheckOut}
                            className="w-44 bg-black text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200">
                            Check Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;