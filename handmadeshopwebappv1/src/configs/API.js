import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000';

export let endpoints = {
    'categories': '/categories/',
    'products': '/products/',
    'blogs': '/blogs/',
    'blog-details': (blogId) => `/blogs/${blogId}/`,
}

export default axios.create({
    baseURL: BASE_URL
})