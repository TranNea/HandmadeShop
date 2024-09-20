import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import API, { endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import ProductItem from "./ProductItem";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [q] = useSearchParams();
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadProducts = async () => {
            if (page > 0) {
                let url = `${endpoints['products']}?page=${page}`;
                const keyword = q.get("kw");

                if (keyword) {
                    url += `&q=${keyword}`;
                }

                try {
                    const res = await API.get(url);
                    setProducts(res.data.results);

                    if (res.data.next === null) {
                        setPage(0);
                    }
                } catch (ex) {
                    console.error(ex);
                }
            }
        };

        loadProducts();
    }, [page, useSearchParams]);

    const loadMore = () => {
        setPage(page + 1);
    }

    if (products === null)
        return <Loading />;

    if (products.length === 0)
        return <div className="alert alert-info m-1">There are no products!</div>

    return (
        <div style={styles.productContainer}>
            {products.map(product => (
                <ProductItem key={product.id} product={product} />
            ))}
            <div className="mt-2 text-center mb-1">
                <Button onClick={loadMore} variant="primary">Load more</Button>
            </div>
        </div>
    );
}
export default Product;

const styles = {
    productContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '20px',
    },
};