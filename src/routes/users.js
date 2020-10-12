const express = require("express")
const routes = express.Router()

const SessionContoller = require('../app/controllers/SessionContoller')
const UserController = require('../app/controllers/UserController')


const Usevalidator = require('../app/validators/user')
const Sessionvalidator = require('../app/validators/session')

const {isLoggedRedirectToUsers ,onlyUsers } = require('../app/middlewares/session')
//Login/logout  SessionContoller
routes.get('/login',isLoggedRedirectToUsers,SessionContoller.loginForm)
routes.post('/login',Sessionvalidator.login,SessionContoller.login)
routes.post('/logout',SessionContoller.logout)

// //resetPassword/forgot
routes.get('/forgot-password',SessionContoller.forgotForm)
routes.get('/password-reset',SessionContoller.resetForm)
routes.post('/forgot-password',Sessionvalidator.forgot,SessionContoller.forgot)
routes.post('/password-reset',Sessionvalidator.reset,SessionContoller.reset)

// //users register USERcONTROLLER
routes.get('/register', UserController.registerForm)
routes.post('/register',Usevalidator.post,UserController.post)

routes.get('/',onlyUsers,Usevalidator.show,UserController.show)
routes.put('/',Usevalidator.put,UserController.put)
routes.delete('/',UserController.delete)



module.exports = routes