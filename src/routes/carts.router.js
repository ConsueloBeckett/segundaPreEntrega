const express = require('express');
const router = express.Router();


const carts = [] 

const products = [
    
    {
        id: 1,
        name: "Berenjena",
        price: 2500,
        stock: 10,
        code: "image/image1",
        description:"es una hortaliza de color morado oscuro que se utiliza en muchas preparaciones culinarias.",
        category:"verdura"
    },
    {
        id: 2,
        name: "Arandano",
        price: 5000,
        stock: 8,
        code: "image/image2",
        description:"es una fruta pequeña y dulce que se utiliza en postres y otros platos dulces.",
        category:"fruta"
    },
    {
        id: 3,
        name: "Frutilla",
        price: 3000,
        stock: 20,
        code: "image/image3",
        description:"es una fruta dulce y aromática que se utiliza en postres y otros platos dulces.",
        category:"fruta"
    },
    {
        id: 4,
        name: "Cereza",
        price: 5000,
        stock: 20,
        code: "image/image4",
        description:"es una fruta dulce y jugosa que se consume fresca o en conserva",
        category:"fruta"
    },
    {
        id: 5,
        name: "Durazno",
        price: 2500,
        stock: 15,
        code: "image/image5",        
        description:"es una fruta jugosa y dulce que se consume fresca o en conserva.",
        category:"fruta"
    }

]

//all products
router.post('/api/carts', (req, res) => {
    const cartId = carts.length + 1; 
    const cart = {
        id: cartId,
        products: []
    };

    for (let i = 0; i < 3; i++) {
        const randomProductIndex = Math.floor(Math.random() * products.length);
        const randomQuantity = Math.floor(Math.random() * 5) + 1; 
        const productToAdd = { ...products[randomProductIndex], quantity: randomQuantity };
        cart.products.push(productToAdd);
    }

    products.push(cart);

    res.json({ message: 'Succesfull added', cart });
});

router.put('/api/carts/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found.' });
    }

    const updatedProducts = req.body.products;

    if (!updatedProducts || !Array.isArray(updatedProducts)) {
        return res.status(400).json({ message: 'Invalid products array in the request body.' });
    }

    // Limpiar los productos actuales del carrito
    cart.products = [];

    // Añadir los nuevos productos al carrito
    updatedProducts.forEach((updatedProduct) => {
        const productId = updatedProduct.productId;
        const quantity = updatedProduct.quantity;

        const product = products.find((product) => product.id === productId);

        if (product) {
            const cartProduct = { ...product, quantity };
            cart.products.push(cartProduct);
        }
    });

    res.json({ message: 'Cart updated successfully', cart });
});


router.get('/api/carts/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find((cart) => cart.id === cartId);

     // Utiliza "populate" para obtener los productos completos
     CartModel.findById(cartId).populate('products').exec((err, cart) => {
        if (err || !cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

    res.json(cart);
     });
     
});

router.delete('/api/carts/:cid/products/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found.' });
    }

    const productIndex = cart.products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in the cart.' });
    }

    // Eliminar el producto del carrito
    cart.products.splice(productIndex, 1);

    res.json({ message: 'Product removed from cart', cart });
});


router.post('/api/carts/:cid/products', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({  message: 'Cart not found.' });
    }

    const productId = req.body.productId;
    const quantity = req.body.quantity;

    const product = products.find((product) => product.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const cartProduct = { ...product, quantity };
    cart.products.push(cartProduct)/vfc ;

    res.json({ message: 'Products added to cart', cartProduct });
    router.put('/api/carts/:cid/products/:pid', (req, res) => {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
    
        const cart = carts.find((cart) => cart.id === cartId);
    
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }
    
        const productIndex = cart.products.findIndex((product) => product.id === productId);
    
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in the cart.' });
        }
    
        const newQuantity = req.body.quantity;
    
        if (newQuantity === undefined || typeof newQuantity !== 'number' || newQuantity < 0) {
            return res.status(400).json({ message: 'Invalid quantity provided in the request body.' });
        }
    
        // Actualizar solo la cantidad del producto en el carrito
        cart.products[productIndex].quantity = newQuantity;
    
        res.json({ message: 'Product quantity updated in cart', cartProduct: cart.products[productIndex] });
    });
    
    router.delete('/api/carts/:cid', (req, res) => {
        const cartId = parseInt(req.params.cid);
    
        const cart = carts.find((cart) => cart.id === cartId);
    
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }
    
        // Limpiar todos los productos del carrito
        cart.products = [];
    
        res.json({ message: 'All products removed from cart', cart });
    });
    
});



module.exports = router;