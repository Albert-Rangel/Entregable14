import Router from "express"
import {
    getProducts,
    addProduct,
    getProducts_,
    getProductById,
    updateProduct,
    deleteProduct,

}from '../dao/Mongo/ProductManager.js'
// const productManager = new ProductManager();
const ProductRoute = Router();

ProductRoute.get('/', getProducts);
ProductRoute.post('/',addProduct)
ProductRoute.get('/Npagin/', getProducts_)
ProductRoute.get('/:pid', getProductById);
ProductRoute.put('/:pid', updateProduct)
ProductRoute.delete('/:pid', deleteProduct)

export default ProductRoute;