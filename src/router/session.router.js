import { Router, json } from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../dao/models/user.model.js';
import publicRoutes from "../middlewares/publicRoutes.js"
import passport from 'passport';
import privateRoutes from '../middlewares/privateRoutes.js';

import { fork } from "child_process"

const router = Router();

router.post('/login', publicRoutes,
  passport.authenticate('login', { failureRedirect: '/failogin' }),
  async (req, res) => {
    if (!req.user) {
      res.status(400).send();
    }

    const objectId_ = req.user.cart[0]._id;

    // Extract the hexadecimal representation
    const hexString = objectId_.toHexString();


    req.session.user = {
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      cart: hexString,
      admin: false,
      role: req.user.role,
    };
   
    req.session.isLogged = true;

    res.redirect('/products');
  }
);

router.post('/signup', publicRoutes, passport.authenticate("register",
  { failureRedirect: "/failsignup" }),
  async (req, res) => {
    res.redirect('/login');
  });

router.post('/recover', publicRoutes, async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).lean();

  if (!user) {
    return res.send(
      'Si tu correo existe en nuestros registros, recibiras un mail con la información para recuperar tu contraseña'
    );
  }

  user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await userModel.updateOne({ email }, user);

  res.redirect('/login');
});

router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] }))

router.get("/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {

    const objectId_ = req.user.cart[0]._id;

    // Extract the hexadecimal representation
    const hexString = objectId_.toHexString();

    req.session.user = {
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      cart: hexString,
      role: req.user.role,
      admin: false
    };
    req.session.isLogged = true;

    // console.log(req.session.user )

    res.redirect("/products")
  })

router.get(
  '/current', privateRoutes,
  async (req, res) => {
    const objectId_ = req.user.cart[0]._id;

    // Extract the hexadecimal representation
    const hexString = objectId_.toHexString();

    const dtouser = {
      _id: req.user._id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      age: req.user.age,
      email: req.user.email,
      cart: hexString,
      role: req.user.role,
    }
    res.send(dtouser);
  }
);


export default router;