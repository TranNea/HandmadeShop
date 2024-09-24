import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import API, { authAPI, endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import avatar from "../../assets/images/avatar.jpeg";
import Moment from "react-moment";
import "./ProductDetails.css";
import { BsSuitHeart, BsSuitHeartFill } from 'react-icons/bs';
import { UserContext } from "../../configs/MyContext";

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false)
    const [mainImage, setMainImage] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const [user,] = useContext(UserContext);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await API.get(endpoints['product-details'](productId));
                setProduct(res.data);
                console.info(res.data);

                setMainImage(res.data.image1);

            } catch (ex) {
                console.error(ex);
            }
        };

        loadProduct();
    }, [productId]);

    useEffect(() => {
        const loadComments = async () => {
            let res = await API.get(endpoints['product-comments'](productId));
            setComments(res.data);
        }

        loadComments();
    }, []);


    const addComment = (evt) => {
        evt.preventDefault()

        const process = async () => {
            try {
                let res = await authAPI().post(endpoints['p-comments'](productId), {
                    'description': description
                })
                setComments(curr => ([res.data, ...curr]))
            } catch (ex) {
                console.info(ex)
            } finally {
                setLoading(false)
            }
        }

        setLoading(true)
        process()
    }


    if (product === null) {
        return <Loading />;
    }

    const discountedPrice = product.discount ? product.price - product.discount : null;

    const addToWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="outer-container">
            <div className="productcontainer">
                <div className="product-main-container">

                    <div className="left-column">

                        <Image
                            src={product.image1}
                            className={`small-image ${mainImage === product.image1 ? 'selected' : ''}`}
                            onClick={() => setMainImage(product.image1)}
                            alt="Small Image 1"
                        />
                        <hr className="divider" />

                        {product.image2 && (
                            <>
                                <Image
                                    src={product.image2}
                                    className={`small-image ${mainImage === product.image2 ? 'selected' : ''}`}
                                    onClick={() => setMainImage(product.image2)}
                                    alt="Small Image 2"
                                />
                                <hr className="divider" />
                            </>
                        )}

                        {product.image3 && (
                            <>
                                <Image
                                    src={product.image3}
                                    className={`small-image ${mainImage === product.image3 ? 'selected' : ''}`}
                                    onClick={() => setMainImage(product.image3)}
                                    alt="Small Image 3"
                                />
                                <hr className="divider" />
                            </>
                        )}

                        {product.image4 && (
                            <Image
                                src={product.image4}
                                className={`small-image ${mainImage === product.image4 ? 'selected' : ''}`}
                                onClick={() => setMainImage(product.image4)}
                                alt="Small Image 4"
                            />
                        )}
                    </div>

                    <div className="center-column">
                        {mainImage && (
                            <Image src={mainImage} className="large-image" alt="Main Image" />
                        )}
                    </div>

                    <div className="right-column">
                        <h1 className="product-name">
                            {product.name}
                            <span onClick={addToWishlist} className="heart-icon">
                                {isWishlisted ? <BsSuitHeartFill color="red" /> : <BsSuitHeart />}
                            </span>
                        </h1>
                        <div className="price-section">
                            <span className={product.discount ? "old-price" : "price"}>
                                {product.price.toLocaleString("en")} VNĐ
                            </span>
                            {product.discount && (
                                <span className="new-price">
                                    {discountedPrice.toLocaleString("en")} VNĐ
                                </span>
                            )}
                        </div>
                        <p className="description" dangerouslySetInnerHTML={{ __html: product.description }}></p>
                        <p className="category">Category: {product.category.name}</p>
                        {product.status === 'O' ? (
                            <p className="out-of-stock">Out of Stock</p>
                        ) : (
                            <p className="quantity">Quantity: {product.quantity}</p>
                        )}

                        {product.status === 'S' && (
                            <Button className="add-to-cart-button">Add to Cart</Button>
                        )}
                    </div>
                </div>
            </div>

            <hr />

            <p className="text-xl font-bold" style={{ margin: '20px' }}> Comments </p>

            {user === null ? <Link to="/login"
                style={{ padding: '10px', margin: '20px' }}
                className="bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
            >
                Login to Comment
            </Link> : (
                <Form onSubmit={addComment} style={{ margin: '20px' }}>
                    <Form.Group className="mb-3" controlId="content">
                        <Form.Control as="textarea"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={{ border: '2px solid #ccc', padding: '10px', borderRadius: '5px', width: '70%' }}
                            rows={3} placeholder="Your comment..." />
                    </Form.Group>
                    {loading ? <Loading /> : <Button
                        className="bg-black mx-auto text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:text-white duration-200"
                        type="submit" variant="primary"
                        style={{ padding: '0 10px', marginBottom: '20px' }}
                    >
                        Comment
                    </Button>}
                </Form>
            )}

            {comments === null ? <Loading /> : (
                comments.map(c => {
                    return (
                        <div className="comment-container">
                            <Image src={avatar} className="comment-avatar" alt={c.user.username} fluid rounded />
                            <div>
                                <p dangerouslySetInnerHTML={{ __html: c.description }}></p>
                                <small>Comment by {c.user.username}. &nbsp;&nbsp;&nbsp;&nbsp; Time: <Moment fromNow>{c.created_date}</Moment></small>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
};

export default ProductDetails;