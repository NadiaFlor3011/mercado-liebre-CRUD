const { json } = require('express');
const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/productsDataBase.json'), 'utf-8'));
const saveProducts = (products) => {
    fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(products, 'utf-8'));
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
    // Root - Show all products
    index: (req, res) => {

        res.render('products', {
            products,
            toThousand
        })
    },

    // Detail - Detail from one product
    detail: (req, res) => {
        let { id } = req.params;
        let productId = products.filter(producto => producto.id === +id);

        res.render('detail', {
            productId,
            toThousand
        })
    },

    // Create - Form to create
    create: (req, res) => {
        res.render('product-create-form')
    },

    // Create -  Method to store
    store: (req, res) => {

        let { name, discount, price, category, description } = req.body;
        let newProduct = {
            id: products[products.length - 1].id + 1,
            name: name.trim(),
            discount: +discount,
            price: +price,
            category,
            description: description.trim(),
            image: 'default-image.png'
        }

        let productsModify = [...products, newProduct];
        saveProducts(productsModify);
        res.redirect('/products')
    },

    // Update - Form to edit
    edit: (req, res) => {
        let { id } = req.params;
        let productToEdit = products.find(product => product.id === +id);
        res.render('product-edit-form', {
            productToEdit
        })


    },
    // Update - Method to update
    update: (req, res) => {

        let { id } = req.params;
        let { name, discount, price, category, description } = req.body;
        let productsModify = products.map(product => {
            if (product.id === +id) {
                return {
                    id: product.id,
                    name: name.trim(),
                    discount: +discount,
                    price: +price,
                    category,
                    description: description.trim(),
                    image: product.image
                }

            }
            return product;

        });
        saveProducts(productsModify);
        res.redirect('/products/detail/' + id);

    },

    // Delete - Delete one product from DB
    destroy: (req, res) => {
        let { id } = req.params;
        let productsModify = products.filter(product => product.id !== +id)
        saveProducts(productsModify);
        res.redirect('/products');

    }
};

module.exports = controller;