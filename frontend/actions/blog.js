import fetch from 'isomorphic-fetch';
import queryString from 'query-string'
import { API } from '../config';
import {isAuth, handleResponse} from './auth'

export const createBlog = (blog, token) => {
    let createBlogEndPoint;

    if(isAuth() && isAuth().role ===1) {
        createBlogEndPoint = `${API}/api/v1/blogs` 
    } else if(isAuth() && isAuth().role === 0) {
        createBlogEndPoint = `${API}/api/v1/blogs/user`
    } 
    

    return fetch(`${createBlogEndPoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            
            return response.json();
        })
        .catch(err => console.log(err));
};


export const listBlogsWithCategoriesAndTags = (skip,limit) => {
    const data = {
        limit, skip
    }
    return fetch(`${API}/api/v1/blogs/blogs-categories-tags`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const singleBlog = slug => {
    return fetch(`${API}/api/v1/blogs/${slug}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const listRelated = blog => {
    return fetch(`${API}/api/v1/blogs/related`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const list = (username) => {
    let listBlogsEndPoint;

    if(username) {
        listBlogsEndPoint = `${API}/api/v1/blogs/${username}/blogs` 
    } else{
        listBlogsEndPoint = `${API}/api/v1/blogs`
    } 


    return fetch(`${listBlogsEndPoint}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const removeBlog = (slug, token) => {
    let deleteBlogEndPoint;

    if(isAuth() && isAuth().role ===1) {
        deleteBlogEndPoint = `${API}/api/v1/blogs/${slug}` 
    } else if(isAuth() && isAuth().role === 0) {
        deleteBlogEndPoint = `${API}/api/v1/blogs/user/${slug}`
    } 
    return fetch(`${deleteBlogEndPoint}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateBlog = (blog, token, slug) => {
    let updateBlogEndPoint;

    if(isAuth() && isAuth().role ===1) {
        updateBlogEndPoint = `${API}/api/v1/blogs/${slug}` 
    } else if(isAuth() && isAuth().role === 0) {
        updateBlogEndPoint = `${API}/api/v1/blogs/user/${slug}`
    } 
    return fetch(`${updateBlogEndPoint}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const listSearch = (params) => {
    let query = queryString.stringify(params)
    return fetch(`${API}/api/v1/blogs/search?${query}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};