import axios from 'axios'
import cookie from "react-cookies"

const BASE_URL = 'http://127.0.0.1:8000';

export let endpoints = {
    'categories': '/categories/',
    'products': '/products/',
    'product-details': (productId) => `/products/${productId}/`,
    'product-comments': (productId) => `/products/${productId}/productcomments/`,
    'p-comments': (productId) => `/products/${productId}/comments/`,
    'blogs': '/blogs/',
    'blog-details': (blogId) => `/blogs/${blogId}/`,
    'blog-comments': (blogId) => `/blogs/${blogId}/bcomments/`,
    'b-comments': (blogId) => `/blogs/${blogId}/comments/`,
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register': '/users/',
}

export const authAPI = () => axios.create({
    baseURL: BASE_URL,
    headers: {
        "Authorization": `Bearer ${cookie.load('access_token')}`
    }
})

export default axios.create({
    baseURL: BASE_URL
})