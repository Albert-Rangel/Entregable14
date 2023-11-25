import express from "express"
import handlebars from "express-handlebars"
import { Server } from 'socket.io'
import __dirname from './utils.js'
import ProductRoutes from './router/productMongo.routes.js'
// import CartManager from './dao/Mongo/CartManager.js'
import {
  addCartProducts,
  getProductsinCartByIdPagination,
} from "./dao/Mongo/CartManager.js";
import {
  getProducts,
  addProduct,
  deleteProduct,
} from "./dao/Mongo/ProductManager.js";
import ChatsRoutes from './router/chat.routes.js'
import MockRoutes from './router/mock.routes.js'
import CartRoutes from './router/cartMongo.routes.js'
import EmailsRoutes from './router/email.routes.js'
import errorHandler from './middlewares/errors/index.js'
// import ProductManager from './dao/Mongo/ProductManager.js'
import compression from "express-compression"
import ViewsRouter from './router/views.routes.js'
import SessionRouter from './router/session.router.js'
import passport from "passport"
import initiaizePassport from "./config/passport.config.js"
import MongoStore from "connect-mongo"
import session from "express-session"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import config from "./config/env.config.js"

// const productManager = new ProductManager();
// const cartManager = new CartManager();

const app = express()
// const program = new Command();
// const fileStore = FileStore(session)

const port = config.port;

//Creacion del servidorHTTP
const HTTPserver = app.listen(port, () =>
  console.log(`Port listening on port ${HTTPserver.address().port}`)
);

async function connectToMongoose() {
  try {
    //Conectando con Atlas
    await mongoose.connect(config.mongourl);
  } catch (error) {
    console.error(`Failed to connect to Mongoose: ${error}`);
  }
}

connectToMongoose().then(() => {
  console.log(`Connected to Mongoose`)
});


//Creacion del servidor con Socketio
const Socketserverio = new Server(HTTPserver)

// Mi socketSServer a la escucha
Socketserverio.on('connection', async (socket) => {

  console.log(`client connected with id ${socket.id}`)

  const productList = await getProducts({limit : 20,page: 1, sort : null,query :null});

  Socketserverio.emit('AllProducts', productList)

  Socketserverio.emit('AllProductsCart', productList)

  socket.on('sendNewProduct', async (newP) => {

    const newProduct = {
      description: newP.description,
      title: newP.title,
      price: parseInt(newP.price, 10),
      thumbnail: newP.thumbnail,
      code: newP.code,
      stock: parseInt(newP.stock, 10),
      status: newP.status,
      category: newP.category,
      swWeb: true,

    }
    await addProduct(newProduct);

    const productList = await getProducts({limit : 20,page: 1, sort : null,query :null});

    Socketserverio.emit('AllProducts', productList)
  })

  socket.on('functionDeleteProduct', async (idp) => {
    await deleteProduct(idp);
    const productList = await getProducts({limit : 20,page: 1, sort : null,query :null});
    Socketserverio.emit('AllProducts', productList)
  })
  socket.on('message', async (data) => {
    await messagesModel.create(data)
    const messag = await messagesModel.find().lean()
    Socketserverio.emit('newMessage', messag)
  })
  socket.on('obtainCartInfo', async (cid) => {
    const products = await getProductsinCartByIdPagination(cid)
    console.log("encontro los productos paginados" + products)
    Socketserverio.emit('cartProducts', products)
  })

  socket.on('addNewProducttoCart', async ({ pid, cartid }) => {

    const cid = cartid.substr(1, cartid.length - 1);
    const newproductincart = await addCartProducts(pid, cid)
    Socketserverio.emit('newProductinCart', newproductincart)
  })
})

HTTPserver.on("error", (error) => console.log`Server error ${error}`)

//Seccion de handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//Seccion de Static
app.use(express.static(__dirname + "/public"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.use(session({

  store: MongoStore.create({
    mongoUrl: config.mongourl,
    ttl: 999999999999,
  }),
  secret: 'secretCoder',
  resave: false,
  saveUninitialized: false,

}))

initiaizePassport();

app.use(compression({
  brotli: { enabled: true, zlib: {} }
}))

app.use(errorHandler)
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', SessionRouter)
app.use('/api/email', EmailsRoutes)
app.use('/api/products', ProductRoutes)
app.use('/api/carts', CartRoutes)
app.use('/api/chats', ChatsRoutes)
app.use('/api/Mocks', MockRoutes)
app.use('/', ViewsRouter)

//socketEvents(Socketserverio)

