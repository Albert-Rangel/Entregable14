import Router from "express"
// import CartManager from '../dao/Mongo/CartManager.js'
import {
    addCart,
    addCartProducts,
    getCarts,
    getCartById,
    getProductsinCartById,
    deleteCart,
    deleteCartProduct,
    deleteAllCartProducts,
    updateCartProductQuantity,
    updateCartProducts,
    purchaseCart
  } from "../dao/Mongo/CartManager.js";
const CartRoute = Router();

//Obtiene un carro por su id
CartRoute.get('/byId/:cid', getCartById);

//Obtiene los productos de un carro por su id
CartRoute.get('/CartProd/:cid', getProductsinCartById);

//obtiene todos los carros
CartRoute.get('/', getCarts);

//Obtiene un carro por su id
CartRoute.get('/:cid/purchase', purchaseCart);

//crea un carro sin productos
CartRoute.post('/', addCart)

//Agrega un producto  especifico a un carro especifico
CartRoute.post('/:cid/product/:pid', addCartProducts)

//Elimina un producto especifico de un carro especifico
CartRoute.delete('/:cid/product/:pid', deleteCartProduct)

//Elimina un carro en especifico
CartRoute.delete('/SpecificCart/:cid', deleteCart)

//Elimina todos los productos dentro de un carro especifico
CartRoute.delete('/:cid', deleteAllCartProducts)

//Actualiza el Quantity Dde un producto especifico en un carro especifico
CartRoute.put('/:cid/product/:pid', updateCartProductQuantity)

//Actualiza los productos en un carro especifico
CartRoute.put('/:cid', updateCartProducts)

CartRoute.get('/cartPurchase', purchaseCart);

export default CartRoute;