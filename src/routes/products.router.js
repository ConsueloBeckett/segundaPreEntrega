import  express from'express'
import router from express.Router()

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


router.get('/api/products', (req, res) => {
    res.json({ products });
});



router.get('/api/products', (req, res) => {
   
    const limit = parseInt(req.query.limit) || 10; 
    const page = parseInt(req.query.page) || 1;   
    const sort = req.query.sort === 'asc' || req.query.sort === 'desc' ? req.query.sort : null;
    const query = req.query.query ? { name: { $regex: new RegExp(req.query.query, 'i') } } : '';

   
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

  
   let filteredProducts = [...products];
   if (query) {
       filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
   }
   if (sort) {
       filteredProducts = filteredProducts.sort((a, b) => {
           if (sort === 'asc') {
               return a.price - b.price;
           } else {
               return b.price - a.price;
           }
       });
   }
 
const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

const totalProducts = filteredProducts.length;
const totalPages = Math.ceil(totalProducts / limit);
const hasPrevPage = page > 1;
const hasNextPage = page < totalPages;


const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null;
const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null;


return res.json({
    status: 'success',
    payload: paginatedProducts,
    totalPages,
    prevPage: hasPrevPage ? page - 1 : null,
    nextPage: hasNextPage ? page + 1 : null,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink
    
    });
});


router.post('/api/products', (req, res) => {

    const newProduct = req.body;

   
    if (!newProduct.id ||
        !newProduct.name ||
        !newProduct.price ||
        !newProduct.description ||
        !newProduct.code ||
        !newProduct.stock ||
        !newProduct.category) {
            res.json({ message: 'Product added succesfully' });
       
    }else{

        return res.status(400).json({ message: 'Fill all the fields to continue' });
    }

    products.push(newProduct);

});


router.put('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const updateFields = req.body;

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'You have to add one field at least' });
    }

    const productIndex = products.findIndex((product) => product.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product isnt found.' });
    }

    products[productIndex] = {
        ...products[productIndex],
        ...updateFields
    };

    return res.json(products[productIndex]);
});


router.delete('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);


    const productIndex = products.find((product) => product.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product havent been found.' });
    }

    const deletedProduct = products.splice(productIndex, 1);

    return res.json(deletedProduct[0]);
});


export default router;