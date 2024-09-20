import React, { useState } from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import { FaShoppingCart, FaExchangeAlt } from 'react-icons/fa';
import { MdOutlineLabelImportant } from 'react-icons/md';
import { BsSuitHeartFill } from 'react-icons/bs';

const ProductItem = ({ product }) => {
    const url = `/products/${product.id}`;

    const [isHovered, setIsHovered] = useState(false);
    const [hoveredAction, setHoveredAction] = useState(null);

    const styles = {
        productItem: {
            width: '18rem',
            height: '24rem',
            position: 'relative',
            border: '2px solid black',
            transition: 'transform 0.3s',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            cursor: 'pointer',
        },
        imageContainer: {
            maxWidth: '18rem',
            maxHeight: '24rem',
            position: 'relative',
            overflow: 'hidden',
        },
        productImage: {
            width: '18rem',
            height: '17rem',
            objectFit: 'cover',
            transition: 'transform 0.3s',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        },
        actionOverlay: {
            position: 'absolute',
            bottom: isHovered ? '0' : '-130px',
            left: '0',
            width: '100%',
            height: '8rem',
            backgroundColor: 'white',
            transition: 'bottom 0.7s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
        },
        actionItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            color: '#767676',
            fontSize: '0.875rem',
            cursor: 'pointer',
            paddingBottom: '0.25rem',
            borderBottom: '1px solid #e2e8f0',
            transition: 'color 0.3s, border-color 0.3s',
        },
        actionItemHover: {
            color: 'black',
            borderColor: 'black',
        },
        productInfo: {
            maxWidth: '100%',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
        },
        productName: {
            fontSize: '1.3rem',
            color: 'black',
            fontWeight: 'bold',
            margin: '0',
        },
        productPrice: {
            color: '#767676',
            fontSize: '0.875rem',
            margin: '0',
        },
    };

    return (
        // <Card style={{ border: '2px solid #007bff', borderRadius: '0.5rem', padding: '0.5rem', width: '18rem', height: '28rem', position: 'relative' }}>
        //     {product.image1 && (<Card.Img variant="top" src={product.image1} style={{ width: '18rem', height: '13rem' }} />)}

        //     <Card.Body>
        //         <Card.Title>{product.name}</Card.Title>

        //         <Card.Text>{product.price.toLocaleString("en")} VNĐ</Card.Text>

        //         <Button variant="danger" className="m-1" >Add to Cart</Button>

        //         <Link to={url} style={{ textDecoration: 'none' }}>
        //             <Button variant="primary" className="m-1" >View Details</Button>
        //         </Link>

        //         <Button variant="danger" className="m-1" >Add to Wishlist</Button>
        //     </Card.Body>
        // </Card>

        <div style={styles.productItem}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.imageContainer}>
                <Image src={product.image1} alt={product.name} style={styles.productImage} />
                <div style={styles.actionOverlay}>
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0', width: '100%' }}>
                        <li
                            style={{ ...styles.actionItem, ...(hoveredAction === 'addToCart' ? styles.actionItemHover : {}) }}
                            onMouseEnter={() => setHoveredAction('addToCart')}
                            onMouseLeave={() => setHoveredAction(null)}
                        >
                            Add to Cart <FaShoppingCart />
                        </li>

                        <Link to={url}>
                            <li
                                style={{ ...styles.actionItem, ...(hoveredAction === 'viewDetails' ? styles.actionItemHover : {}) }}
                                onMouseEnter={() => setHoveredAction('viewDetails')}
                                onMouseLeave={() => setHoveredAction(null)}
                            >
                                View Details <MdOutlineLabelImportant />
                            </li>
                        </Link>

                        <li
                            style={{ ...styles.actionItem, ...(hoveredAction === 'addToWishlist' ? styles.actionItemHover : {}) }}
                            onMouseEnter={() => setHoveredAction('addToWishlist')}
                            onMouseLeave={() => setHoveredAction(null)}
                        >
                            Add to Wishlist <BsSuitHeartFill />
                        </li>
                    </ul>
                </div>
            </div>
            <div style={styles.productInfo}>
                <h2 style={styles.productName}>{product.name}</h2>
                <p style={styles.productPrice}>{product.price.toLocaleString("en")} VNĐ</p>
            </div>
        </div>
    );
};

export default ProductItem;