import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import API, { authAPI, endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import avatar from "../../assets/images/avatar.jpeg";
import Moment from "react-moment"
import { UserContext } from "../../configs/MyContext";

const BlogDetail = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const [user,] = useContext(UserContext);

    useEffect(() => {
        const loadBlog = async () => {
            try {
                const res = await API.get(endpoints['blog-details'](blogId));
                setBlog(res.data);
                console.info(res.data);

            } catch (ex) {
                console.error(ex);
            }
        };

        loadBlog();
    }, [blogId]);

    useEffect(() => {
        const loadComments = async () => {
            let res = await API.get(endpoints['blog-comments'](blogId));
            setComments(res.data);
        }

        loadComments();
    }, []);


    const addComment = (evt) => {
        evt.preventDefault()

        const process = async () => {
            try {
                let res = await authAPI().post(endpoints['b-comments'](blogId), {
                    'content': content
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


    if (blog === null) {
        return <Loading />;
    }

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <h1 className="text-5xl text-primeColor text-center font-titleFont font-bold pb-10">{blog.title}</h1>
            {blog.image && <img src={blog.image} className="pb-10" style={{ width: '500px', height: '500px', display: 'block', margin: '0 auto' }} alt={blog.title} />}
            <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>

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
                            value={content}
                            onChange={e => setContent(e.target.value)}
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
                        <div style={{ display: 'flex', margin: '20px', alignItems: 'center' }}>
                            <Image src={avatar} style={{ width: '50px', height: '50px', marginRight: '10px' }} alt={c.user.username} fluid rounded />
                            <div>
                                <p dangerouslySetInnerHTML={{ __html: c.content }}></p>
                                <small>Comment by {c.user.username}. &nbsp;&nbsp;&nbsp;&nbsp; Time: <Moment fromNow>{c.created_date}</Moment></small>
                            </div>

                        </div>
                    )
                })
            )}
        </div>
    );
};

export default BlogDetail;