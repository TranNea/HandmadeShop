import productOfTheYear from "../../assets/images/productOfTheYear.png";
import React from "react";
import { Link } from "react-router-dom";

const styles = {
    yearProduct: {
        width: '95%',
        height: '20rem',
        margin: '4rem auto',
        backgroundColor: '#f3f3f3',
        backgroundImage: `url(${productOfTheYear})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        fontFamily: 'YourFontTitle, sans-serif',
        overflow: 'hidden',
    },

    content: {
        width: '100%',
        maxWidth: '66.6667%',
        height: '100%',
        position: 'absolute',
        padding: '1rem',
        top: '50%',
        right: '0',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },

    title: {
        fontSize: '1.875rem',
        fontWeight: 600,
        color: 'var(--prime-color)',
        paddingTop: '1rem',
    },

    description: {
        fontSize: '1rem',
        fontWeight: 400,
        color: 'var(--prime-color)',
        maxWidth: '50rem',
        marginRight: '1rem',
    },

    button: {
        backgroundColor: 'grey',
        color: 'white',
        fontSize: '1.125rem',
        fontWeight: 700,
        width: '200px',
        height: '3.125rem',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
    },
};

const YearProduct = () => {
    return (
        <Link to="/products">
            <div style={styles.yearProduct}>
                <div style={styles.content}>
                    <h1 style={styles.title}> Product of The Year </h1>
                    <p style={styles.description}>
                        Meet our adorable Orange Cat Keychain, the top-selling item of the year!
                        Made from high-quality materials, this charming accessory keeps your keys organized while adding a fun touch to your everyday life.
                        Perfect for cat lovers, it makes a delightful gift or personal treat. Grab your Orange Cat Keychain today and let it bring a smile to your day!
                    </p>
                    <button
                        style={styles.button}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'black'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'grey'}
                    >
                        Shop Now
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default YearProduct;