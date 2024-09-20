import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import avatar from "../../assets/images/avatar.jpeg";
import Moment from "react-moment"

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await API.get(endpoints['product-details'](productId));
                setProduct(res.data);
                console.info(res.data);

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


    // const addComment = (evt) => {
    //     evt.preventDefault()

    //     const process = async () => {
    //         try {
    //             let res = await authAPI().post(endpoints['b-comments'](blogId), {
    //                 'content': content
    //             })
    //             setComments(curr => ([res.data, ...curr]))
    //         } catch (ex) {
    //             console.info(ex)
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     setLoading(true)
    //     process()
    // }


    if (product === null) {
        return <Loading />;
    }

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <h1 className="text-5xl text-primeColor text-center font-titleFont font-bold pb-10">{product.name}</h1>
            {product.image1 && <img src={product.image1} className="pb-10" style={{ width: '500px', height: '500px', display: 'block', margin: '0 auto' }} />}
            <p dangerouslySetInnerHTML={{ __html: product.description }}></p>

            <hr />

            {comments === null ? <Loading /> : (
                comments.map(c => {
                    return (
                        <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'center' }}>
                            <Image src={avatar} style={{ width: '50px', height: '50px', marginRight: '10px' }} alt={c.user.username} fluid rounded />
                            <div>
                                <p dangerouslySetInnerHTML={{ __html: c.content }}></p>
                                <small>Comment by {c.user.username}. &nbsp;&nbsp;&nbsp;&nbsp; Time: <Moment fromNow>{c.created_date}</Moment></small>
                            </div>

                        </div>
                    )
                })
            )}

            {/* {user===null?<Link to="/login">Login</Link>:(
                 <Form onSubmit={addComment}>
                    <Form.Group className="mb-3" controlId="content">
                        <Form.Control as="textarea" 
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={3} placeholder="Your comment..." />
                    </Form.Group>
                    {loading?<Loading />:<Button type="submit" variant="primary">Comment</Button>}
                </Form>
            )} */}
        </div>
    );
};

export default ProductDetails;