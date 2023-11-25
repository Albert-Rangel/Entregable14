
import { cartsModel } from '../dao/models/carts.model.js';
import { productsModel } from '../dao/models/products.model.js';
export default class cartsService {

    async addCartviaService() {
        let cart2 = {}
        try {
            cart2 = { products: [] }
            const carnnew = await cartsModel.create(cart2)
            return `SUC|Carrito agregado con el id ${carnnew._id}`

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async addCartProductsviaService(pid, cid) {
        try {

            const cartObject = await cartsModel.findById({ _id: cid })
            if (cartObject == undefined || Object.keys(cartObject).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const productObject = await productsModel.find({ _id: pid })

            if (productObject == undefined || Object.keys(productObject).length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

            if (cartObject.products.find(prod => prod.id == pid)) {
                let ProductinsideCart = cartObject.products.find(prod => prod.id == pid)

                ProductinsideCart.quantity += 1

                cartObject.save();

                return `SUC|Producto sumado al carrito con el producto ya existente`
            }
            cartObject.products.push({ id: pid, quantity: 1 });

            await cartObject.save();

            return `SUC|Producto agregado al carrito ${cid}`

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getcartsviaService() {
        try {
            const allCarts = await cartsModel.find();
            return allCarts

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }
    }


    async getCartbyIDviaService(cid) {
        try {
            const CartById = await cartsModel.find({ _id: cid }).lean()

            if (CartById == undefined || Object.keys(CartById).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            return CartById

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getProductsinCartbyIDviaService(cid) {
        try {

            const cartObject = await cartsModel.find({ _id: cid }).lean()
            if (cartObject == undefined || Object.keys(cartObject).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const products = cartObject[0].products;

            return products

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getProductsinCartbyIDviaServicePagination(cid) {
        try {
            const cartObject = await cartsModel.paginate(
                { _id: cid }
                ,
                {
                    page: 1,
                    limit: 100,
                    sort: undefined,
                    lean: true
                });

            return cartObject

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async deleteCartviaService(cid) {
        try {
            const cartObject = await cartsModel.find({ _id: cid }).lean()

            if (cartObject == undefined || Object.keys(cartObject).length === 0) return `E02|El carro con el id ${cid._id} no se encuentra agregado.`;

            await cartsModel.deleteOne({ _id: cid })

            return `SUC|El carrito con el id ${cid._id} fue eliminado.`
        }
        catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }

    }

    async deleteCartProductviaService(pid, cid) {
        try {
            console.log("entro endeleteCartProductviaService")

            const CartById = await cartsModel.findById({ _id: cid })

            // console.log("imprimir cartbyid CartById")
            // console.log(CartById)

            //valido si existe el carro
            if (CartById == undefined || Object.keys(CartById).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            let quantityofobjects = CartById.products.length
            // console.log("imprimir quantityofobjects ")
            // console.log(quantityofobjects)

            //valido si existe el producto dentro del carro
            let ProductinsideCart = CartById.products.find(prod => prod.id == pid)
            // console.log("imprimir ProductinsideCart ")
            // console.log(ProductinsideCart)

            if (ProductinsideCart == undefined || Object.keys(ProductinsideCart).length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado al carrito con el id ${cid}.`;

            let productidinsideCart = CartById.products.find(prod => prod.id == pid)
            // console.log("imprimir productidinsideCart ")
            // console.log(productidinsideCart)

            let quantity = ProductinsideCart.quantity
            // console.log("imprimir ProductinsideCart ")
            // console.log(ProductinsideCart)

            if (quantity == 1 && quantityofobjects == 1) {
                // console.log("primer if ")

                await cartsModel.updateOne(
                    { "_id": cid },
                    { $set: { products: [] } }
                )
                return `SUC|Producto eliminado del carrito`
            }

            if (quantity > 1) {
                // console.log("segundo if ")

                await cartsModel.updateOne({
                    "_id": cid,
                    "products.id": pid
                }, {
                    $set: {
                        "products.$.quantity": quantity - 1
                    }
                })
                return `SUC|Producto eliminado del carrito`
            }

            if (quantity = 1 && quantityofobjects >= 1) {
                // console.log("tercer if ")

                await CartById.products.pull(productidinsideCart);
                await CartById.save();
                return `SUC|Producto eliminado del carrito`

            }

            return `SUC|Producto eliminado del carrito`

        }
        catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }

    }

    async deleteAllCartProductsviaService(cid) {
        const CartById = await cartsModel.findById({ _id: cid })
        if (CartById == undefined || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

        const response = await cartsModel.updateOne(
            { "_id": cid },
            { $set: { products: [] } }
        )
        return `SUC|Productos eliminados del carrito ${cid}`

    }

    async updateProductQuantityviaService(pid, cid, quantity_) {
        try {

            let { quantity } = quantity_;

            const cartObject = await cartsModel.findById({ _id: cid })
            if (cartObject == undefined || Object.keys(cartObject).length === 0 || cartObject.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            
            const productObject = await productsModel.find({ _id: pid })
            if (productObject == undefined || Object.keys(productObject).length === 0 || productObject.length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;
            console.log("cart" +cartObject)
            let updateObject = await cartsModel.updateOne({
                "_id": cid,
                "products.id": pid
            }, {
                $set: {
                    "products.$.quantity": quantity_
                }
            })
            if (updateObject.modifiedCount > 0) {
                return `SUC|Producto actualizado del carrito`
            } else {
                return `E02|No se pudo actualizar el productocon el id ${cid}`;
            }

        } catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }

    }


    async updateCartProducstviaService(cid, productsnew) {
        try {
            const CartById = await cartsModel.findById(cid)

            if (CartById == undefined || Object.keys(CartById).length === 0 || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const response = await cartsModel.updateOne(
                { "_id": cid },
                { $set: { products: [] } }
            )
            CartById.products.push(productsnew)
            await CartById.save()

            return `SUC|Carrito ${cid} actualizado.`
        }
        catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }

    }


    async purchaseCart(cid) {
        try {
            const CartById = await cartsModel.findById(cid)

            if (CartById == undefined || Object.keys(CartById).length === 0 || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const response = await cartsModel.updateOne(
                { "_id": cid },
                { $set: { products: [] } }
            )
            CartById.products.push(productsnew)
            await CartById.save()

            return `SUC|Carrito ${cid} actualizado.`
        }
        catch (error) {
            return `ERR|Error generico. Descripcion :${error}`
        }

    }

}