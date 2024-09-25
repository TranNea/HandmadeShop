import { useContext, useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import API, { endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import ProductItem from "./ProductItem";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [q] = useSearchParams();
    const [page, setPage] = useState(1);

    const [categories, setCategories] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            if (page > 0) {
                let url = `${endpoints['products']}?page=${page}`;

                let kw = q.get("kw");
                if (kw !== null) {
                    url += `&kw=${kw}`;
                }

                if (selectedCategory) {
                    url += `&category_id=${selectedCategory}`;
                }

                try {
                    let res = await API.get(url);

                    if (page === 1)
                        setProducts(res.data.results);
                    else if (page > 1)
                        setProducts(prevProducts => [...prevProducts, ...res.data.results]);

                    if (res.data.next === null)
                        setPage(0);
                } catch (ex) {
                    console.error(ex);
                }
            }
        };

        loadProducts();
    }, [page, selectedCategory, q]);

    const loadCategories = async () => {
        try {
            let res = await API.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [selectedCategory, q]);

    const loadMore = () => {
        setPage(page + 1);
    }

    if (products === null)
        return <Loading />;

    if (products.length === 0)
        return <div className="alert alert-info m-1">There are no products!</div>

    return (
        <>
            <div style={styles.categoryColumn}>
                <h5 style={styles.category}>Product by Category</h5>
                <ul style={styles.categoryList}>
                    <li
                        style={selectedCategory === null ? styles.selectedCategory : styles.categoryItem}
                        onClick={() => setSelectedCategory(null)}
                    >
                        All Products
                    </li>
                    {categories.map(category => (
                        <li
                            key={category.id}
                            style={selectedCategory === category.id ? styles.selectedCategory : styles.categoryItem}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={styles.productColumn}>
                <div style={styles.productContainer}>
                    {products.map(product => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>

                <div style={styles.loadMoreContainer} className="pt-10">
                    <Button style={{ width: '150px', backgroundColor: 'black', color: 'gray', height: '50px', fontWeight: '600', transition: 'color 0.2s', border: 'none', borderRadius: '0.25rem' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
                        onClick={loadMore} variant="primary">Load more</Button>
                </div>
            </div>
        </>
    );
}
export default Product;

const styles = {
    category: {
        minWidth: '100%',
        fontSize: '1.5rem',
        color: 'black',
        fontWeight: 'bold',
        paddingBottom: '10px',
    },
    categoryColumn: {
        minWidth: '20%',
        maxWidth: '20%',
        padding: '10px',
        borderRight: '1px solid #ddd',
        alignSelf: 'flex-start',
        position: 'sticky',
    },
    categoryList: {
        listStyle: 'none',
        padding: 0,
    },
    categoryItem: {
        padding: '10px',
        cursor: 'pointer',
        borderBottom: '1px solid #ddd',
    },
    selectedCategory: {
        padding: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ddd',
    },
    productColumn: {
        flexGrow: 1,
        paddingLeft: '50px',
    },
    productContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: '50px',
    },
    loadMoreContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
};