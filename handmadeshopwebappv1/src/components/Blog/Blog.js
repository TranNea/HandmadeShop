import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import API, { endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";
import BlogItem from "./BlogItem";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadBlogs = async () => {
            if (page > 0) {
                let url = `${endpoints['blogs']}?page=${page}`;
                const keyword = searchParams.get("kw");

                if (keyword) {
                    url += `&q=${keyword}`;
                }

                try {
                    const res = await API.get(url);
                    setBlogs(res.data.results);

                    if (res.data.next === null) {
                        setPage(0);
                    }
                } catch (ex) {
                    console.error(ex);
                }
            }
        };

        loadBlogs();
    }, [page, searchParams]);

    if (blogs.length === 0) {
        return <Loading />;
    }

    const nextPage = () => {
        setPage(current => current + 1);
    };

    const prevPage = () => {
        setPage(current => Math.max(current - 1, 1));
    };

    return (
        <div>
            <div className="text-center mb-5">
                <h1 className="text-5xl text-primeColor font-titleFont font-bold pb-10">Free Patterns</h1>
                <h1 className="text-3xl text-primeColor font-titleFont font-bold pb-10">New Tutorials Every Day</h1>
                <p className="text-lg text-gray-700 mx-auto" style={{ maxWidth: '800px' }}>
                    Welcome to our blog! Here, you will find a variety of articles covering different topics,
                    insights, and stories that aim to inform and inspire you. Whether you're a seasoned crafter
                    or just beginning your creative journey, our blog offers something for everyone. From step-by-step
                    tutorials and detailed patterns to inspiring stories and expert tips, we strive to bring you the
                    best content to fuel your passion. So dive in, explore, and let's create something beautiful together.
                    Happy reading!
                </p>
            </div>

            <Container style={{ minWidth: '1370px' }}>
                <Button onClick={prevPage} variant="primary" disabled={page === 1}>&lt;&lt;</Button>
                {blogs.map(blog => (
                    <BlogItem key={blog.id} blog={blog} />
                ))}
                <Button onClick={nextPage} variant="success">&gt;&gt;</Button>
            </Container>
        </div>
    );
};

export default Blogs;