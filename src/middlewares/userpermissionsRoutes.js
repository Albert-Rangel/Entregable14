const userpermissionsRoutes = (req, res, next) => {
 
    if (req.session.user == undefined || req.session.user.role === "Admin") {
        return res.redirect('/products');
    }

    next()
}
export default userpermissionsRoutes

