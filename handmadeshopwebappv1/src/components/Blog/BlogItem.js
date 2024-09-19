import React from 'react';
import { Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

const BlogItem = ({ blog }) => {
    const url = `/blogs/${blog.id}`;

    return (
        <Col md={3} xs={12} style={{ padding: '0.5rem' }}>
            <Card style={{ border: '2px solid #007bff', borderRadius: '0.5rem', padding: '0.5rem', width: '18rem', height: '28rem', position: 'relative' }}>
                {blog.image && (<Card.Img variant="top" src={blog.image} style={{ width: '18rem', height: '13rem' }} />)}

                <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>

                    <Card.Text>
                        {blog.short_description || blog.content.slice(0, 100) + '...'}
                    </Card.Text>

                    <Link to={url} style={{ textDecoration: 'none'}}>
                        <Button
                            style={{ width: '94%', backgroundColor: 'black', color: 'gray', height: '40px', fontWeight: '600', transition: 'color 0.2s', border: 'none', borderRadius: '0.25rem', position: 'absolute', bottom: '0.5rem'}}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
                        >
                            Read more
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        </Col >
    );
};

export default BlogItem;