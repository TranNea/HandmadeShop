import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { endpoints } from "../../configs/API";
import Loading from "../../layouts/Loading";

const BlogDetail = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);

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

    if (blog === null) {
        return <Loading />;
    }

    return (
        <div className="blog-detail">
            <h1>{blog.title}</h1>
            {blog.image && <img src={blog.image} alt={blog.title} />}
            <div>{blog.content}</div>
        </div>
    );
};

export default BlogDetail;