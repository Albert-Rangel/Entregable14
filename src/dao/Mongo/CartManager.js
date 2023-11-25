
import { ticketsModel } from '../models/tickets.model.js';
// import ProductManager from './ProductManager.js';
import {
  getProducts,
  addProduct,
  getProducts_,
  getProductById,
  updateProduct,
  deleteProduct,

} from '../Mongo/ProductManager.js'

import CustomError from '../../services/errors/customError.js';
import EError from '../../services/errors/enum.js';
import { generateUserErrorInfo, generategeneralExepction } from '../../services/errors/info.js';

import cartsService from '../../services/cartService.js';
import emailsService from '../../services/emailService.js';



const emailService = new emailsService()
const CartsService = new cartsService()
// const productManager = new ProductManager()


function ManageAnswer(answer) {
  const arrayAnswer = []
  if (answer) {
    const splitString = answer.split("|");
    switch (splitString[0]) {
      case "E01":
        arrayAnswer.push(400)
        arrayAnswer.push(splitString[1])
        return arrayAnswer
        break;
      case "E02":
        arrayAnswer.push(404)
        arrayAnswer.push(splitString[1])
        return arrayAnswer
        break;
      case "SUC":
        arrayAnswer.push(200)
        arrayAnswer.push(splitString[1])
        return arrayAnswer
        break;
      case "ERR":
      default:
        arrayAnswer.push(500)
        arrayAnswer.push(splitString[1])
        return arrayAnswer
        break;
    }
  }
}
export const addCart = async (req, res) => {

  try {

    let carnew = await CartsService.addCartviaService()
    const arrayAnswer = ManageAnswer(carnew)

    return res.status(arrayAnswer[0]).send({
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    })

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Error occured in CartManager in AddProduct`
    })
  }
}
export const addCartProducts = async (req, res) => {

  try {
    const pid = req.params.pid
    const cid = req.params.cid

    if (!pid || !cid) {
      CustomError.CreateError({
        name: "General Exeption",
        cause: generategeneralExepction("error supuesto por validacioens"),
        message: "Error occured in CartManager in addCartProducts",
        code: EError.INVALID_TYPE_ERROR
      })
    }

    const answer = await CartsService.addCartProductsviaService(pid, cid)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    })

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getCarts = async (req, res) => {
  try {
    const limit = req.query.limit;

    const allCarts = await CartsService.getcartsviaService();

    if (allCarts == undefined) return res.status().send({
      status: "404",
      message: `E02|No existen carros actualmente.`
    })

    const isString = (value) => typeof value === 'string';

    if (isString(allCarts)) {
      const arrayAnswer = ManageAnswer(allCarts)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return res.status(404).send(error)
    }

    if (limit) return res.status().send(allCarts.slice(0, limit));

    return res.send(allCarts.sort((a, b) => a.id - b.id))

  } catch (error) {
    console.log(error)
    return res.status().send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid

    if (!cid) {
      CustomError.CreateError({
        name: "General Exeption",
        cause: generategeneralExepction("error supuesto por validacioens"),
        message: "Error occured in CartManager in getCartById",
        code: EError.INVALID_TYPE_ERROR
      })
    }

    const CartById = await CartsService.getCartbyIDviaService(cid)

    if (CartById == undefined) return res.status().send({
      status: "404",
      message: `E02|El carro con el id ${cid} no se encuentra agregado.`
    })

    const isString = (value) => typeof value === 'string';
    if (isString(CartById)) {
      const arrayAnswer = ManageAnswer(CartById)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return res.status(404).send(error)
    }
    return res.send(CartById);

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getProductsinCartById = async (req, res) => {
  try {
    let cid = 0
    let swWeb = false
    if (req.params != undefined) {
      cid = req.params.cid
      if (!cid) {
        CustomError.CreateError({
          name: "General Exeption",
          cause: generategeneralExepction("error supuesto por validacioens"),
          message: "Error occured in CartManager in getProductsinCartById",
          code: EError.INVALID_TYPE_ERROR
        })
      }
    } else {
      swWeb = true
      if (req.cid == undefined) {
        cid = req
      } else {
        cid = req.cid
      }
    }

    const answer = await CartsService.getProductsinCartbyIDviaService(cid)
    const isString = (value) => typeof value === 'string';
    if (isString(answer)) {
      const arrayAnswer = ManageAnswer(answer)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return swWeb ? answer : res.status.send(error)
    }
    return swWeb ? answer : res.send(answer);
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getProductsinCartByIdPagination = async (req, res) => {
  try {
    const cid = req.params.cid
    if (!cid) {
      CustomError.CreateError({
        name: "General Exeption",
        cause: generategeneralExepction("error supuesto por validacioens"),
        message: "Error occured in CartManager in getProductsinCartByIdPagination",
        code: EError.INVALID_TYPE_ERROR
      })
    }
    const answer = await CartsService.getProductsinCartbyIDviaServicePagination(cid)
    const isString = (value) => typeof value === 'string';
    if (isString(answer)) {
      const arrayAnswer = ManageAnswer(answer)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return res.send(answer);
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const deleteCart = async (req, res) => {
  try {
    const cid = req.params.cid
    if (!cid) {
      CustomError.CreateError({
        name: "General Exeption",
        cause: generategeneralExepction("error supuesto por validacioens"),
        message: "Error occured in CartManager in deleteCart",
        code: EError.INVALID_TYPE_ERROR
      })
    }
    const answer = await CartsService.deleteCartviaService({ _id: cid })
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return res.send(anwserObject);
  }
  catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const deleteCartProduct = async (req, res) => {
  try {
    let cid = 0
    let pid = 0
    let swWeb = false
    // const pidstring = ""

    if (req.params != undefined) {
      cid = req.params.cid
      pid = req.params.pid
      if (!cid || !pid) {
        CustomError.CreateError({
          name: "General Exeption",
          cause: generategeneralExepction("error supuesto por validacioens"),
          message: "Error occured in CartManager in deleteCartProduct",
          code: EError.INVALID_TYPE_ERROR
        })
      }
      // pidstring = JSON.stringify(pid)
    } else {
      swWeb = true
      cid = req.cid
      pid = req.pid
    }

    const answer = await CartsService.deleteCartProductviaService(pid, cid)
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return swWeb ? anwserObject : res.send(anwserObject);
  }
  catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const deleteAllCartProducts = async (req, res) => {
  try {
    const cid = req.params.cid
    if (!cid) {
      CustomError.CreateError({
        name: "General Exeption",
        cause: generategeneralExepction("error supuesto por validacioens"),
        message: "Error occured in CartManager in deleteAllCartProducts",
        code: EError.INVALID_TYPE_ERROR
      })
    }

    const answer = await CartsService.deleteAllCartProductsviaService(cid)
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return res.send(anwserObject);
  }
  catch (error) {
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const updateCartProductQuantity = async (req, res) => {
  try {
    let cid = 0
    let pid = 0
    let quantity_ = 0
    let swWeb = false

    if (req.params != undefined) {
      console.log("entro en api")

      cid = req.params.cid
      pid = req.params.pid
      quantity_ = req.body.quantity
      if (!cid || !pid) {
        CustomError.CreateError({
          name: "General Exeption",
          cause: generategeneralExepction("error supuesto por validacioens"),
          message: "Error occured in CartManager in updateCartProductQuantity",
          code: EError.INVALID_TYPE_ERROR
        })
      }

    } else {
      console.log("entro en web")
      swWeb = true
      cid = req.cid
      pid = req.pid
      quantity_ = req.finalqtt
    }
    console.log("va a llamar a updateProductQuantityviaService")
    console.log(pid + " " +  cid +  " "+ quantity_)
    const answer = await CartsService.updateProductQuantityviaService(pid, cid, quantity_)

    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }

    return swWeb ? anwserObject : res.send(anwserObject);
    //return anwserObject
  }
  catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const updateCartProducts = async (req, res) => {
  try {

    let cid = 0
    let products = {}
    let swWeb = false
    if (req.params != undefined) {
      cid = req.params.cid
      products = req.body
      if (!cid || !products) {
        CustomError.CreateError({
          name: "General Exeption",
          cause: generategeneralExepction("error supuesto por validacioens"),
          message: "Error occured in CartManager in updateCartProducts",
          code: EError.INVALID_TYPE_ERROR
        })
      }

    } else {
      swWeb = true
      cid = req.cid
      products = req.body
    }
    const answer = await CartsService.updateCartProducstviaService(cid, products)
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return swWeb ? arrayAnswer : res.send(arrayAnswer);
  }
  catch (error) {
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const purchaseCart = async (req, res) => {
  try {
    let cid = 0
    let email = ""

    let swWeb = false
    if (req.params != undefined && req.session.user == undefined) {
      cid = req.params.cid
      email = "claudie.funk69@ethereal.email"
      if (!cid || !email) {
        CustomError.CreateError({
          name: "General Exeption",
          cause: generategeneralExepction("error supuesto por validacioens"),
          message: "Error occured in CartManager in updateCartProducts",
          code: EError.INVALID_TYPE_ERROR
        })
      }
    } else {

      swWeb = true
      cid = req.session.user.cart
      email = req.session.user.email
    }


    let totalsum = 0
    //obtener los productos dentro del carrito
    const answer = await getProductsinCartById(cid)


    //valido si es un string es caso fallido y retorno
    const isString = (value) => typeof value === 'string';

    if (isString(answer)) {
      const arrayAnswer = ManageAnswer(answer)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return swWeb ? error : res.send(error);
    }

    //itero por cada objeto dentro del array de productos
    for (let i = 0; i < answer.length; i++) {
      let resultQtt = 0
      let swResult = false
      let stock = parseInt(answer[i].id.stock, 10); // Access the stock property within the nested object
      let initialstock = stock
      let endstock = 0
      let pidobject = answer[i].id._id; // Access the stock property within the nested object

      // Extract the hexadecimal representation
      let pid = pidobject.toHexString();

      let quantity = parseInt(answer[i].quantity, 10); // Access the quantity property directly
      let price = answer[i].id.price;
      let sumtotalprice = 0

      let finalqtt = quantity
      console.log("pid:", pid);
      console.log("Stock:", stock);
      console.log("Quantity:", quantity);
      console.log("Price:", price);
      while (!swResult) {
        let resultQtt = stock - quantity
        if (resultQtt >= 0) {
          stock = resultQtt
          swResult = true
          finalqtt = finalqtt - quantity
          break
        } else {

          quantity = quantity - 1
        }
      }
      let amounttisubstract = initialstock - stock
      sumtotalprice = price * amounttisubstract
      totalsum = totalsum + sumtotalprice
      //ya tengo la cantidad de productos que quedan de un producto en especifico en stock
      console.log("FINAL Stock:", stock);
      console.log("FINAL Quantity:", finalqtt);
      console.log("sumatoria de precio", sumtotalprice)
      console.log("suma total", totalsum)

      // //Actualizar el Quantity de ese producto
      const updateProductQTT = await updateProduct({ pid, "stock": stock })

      if (isString(updateProductQTT) && updateProductQTT.substring(0, 3) != "SUC") {
        const arrayAnswer = ManageAnswer(updateProductQTT)
        const error = {
          status: arrayAnswer[0],
          message: arrayAnswer[1]
        }
        return swWeb ? error : res.send(error);

      }

      //ELIMINAR EL PRODUCTO DEL CARRITO EN CANSO DE QTT = 0 O ACTUAKLIZAR LA CANTIDAD EN CARRITO
      if (finalqtt == 0) {
        //eliminar producto de carrito
        let deletebject = {
          pid,
          cid,
        }
        let eliminateProdinCart = await deleteCartProduct(deletebject)


        if (isString(eliminateProdinCart) && eliminateProdinCart.substring(0, 3) != "SUC") {
          const arrayAnswer = ManageAnswer(eliminateProdinCart)
          const error = {
            status: arrayAnswer[0],
            message: arrayAnswer[1]
          }
          return swWeb ? error : res.send(error);

        }

      } else {
        let upqttobject = {
          pid,
          cid,
          finalqtt
        }
        //Actualizamos la quantity del producto en el carrito
        let updateProdInCart = await updateCartProductQuantity(upqttobject)

        if (isString(updateProdInCart) && updateProdInCart.substring(0, 3) != "SUC") {
          const arrayAnswer = ManageAnswer(updateProdInCart)
          const error = {
            status: arrayAnswer[0],
            message: arrayAnswer[1]
          }
          return swWeb ? error : res.send(error);

        }
      }
    }

    //Despues de que se actualizaran los productos y se actualizara el carrito correspondiente hay que generar un ticket y despues enviar correo
    const ticket = await ticketsModel.create({
      amount: totalsum,
      purchaser: email
    })

    const emailSend = await emailService.sendEmail(ticket)

    if (isString(emailSend) && emailSend.substring(0, 3) != "SUC") {
      const arrayAnswer = ManageAnswer(emailSend)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return swWeb ? error : res.send(error);
    }

    return swWeb ? res.redirect('/products') : res.send({ status: 200, message: "ha sido enviado el correo" });

  }
  catch (error) {
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}




