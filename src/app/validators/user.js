const User = require('../models/User')
const {compare} = require('bcryptjs')

function checkAllfields(body){
    const keys = Object.keys(body)
    for(key of keys){     
        if (body[key] == ""){
           return {
               user:body,
               error:"Por favor, preencha todos os campos"
           }                
        }
    }
}
async function show(req, res, next){
    const {userId: id} = req.session

    const user = await User.findOne({where:{id}})

    if(!user) return res.render("users/register",{
        error:"Usúario não encotrado !"
    })

    req.user=user
    next()
}

async function post (req,res,next){
     //check is has all fields
        const fillAllFields = checkAllfields(req.body)
        if(fillAllFields){
            return res.render("users/register",fillAllFields)
        }
     //check if user exists email, cpf_cnpj
     let {email , cpf_cnpj, password, passwordRepeat} = req.body

     cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
     
     const user = await User.findOne({
         where:{email},
         or:{cpf_cnpj},
     })

     if(user) return res.render('users/register',{
         user:req.body,
         error:"Usuario já cadastro."
     })
     //check if password match
     if(password != passwordRepeat) return res.render('users/register',{
        user:req.body,
        error:"A senha e a repetição da senha estão incorretas"
    })
    next()
}

async function put (req,res,next){
    //check is has all fields
    const fillAllFields = checkAllfields(req.body)
    if(fillAllFields){
        return res.render("users/index",fillAllFields)
    }
 
     const {id , password} =req.body

     if(!password) return res.render("users/index",{
         user:req.body,
         error:"Coloque a sua senha apra atualizar o seu cadastro."
     })

     const user = await User.findOne({where:{id}})

     const passed = await compare(password, user.password)
     
     if(!passed) return res.render("users/index",{
         user:req.body,
         error:"Senha incorreta."
     })
      req.user = user
      next()
}

module.exports ={
    post,
    show,
    put
}