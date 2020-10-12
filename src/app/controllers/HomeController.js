const LoadProducts = require('../services/LoadProducts')

module.exports ={
    async index(req,res){
        
        const allProducts =  await LoadProducts.load('products')
        const products = allProducts

        .filter((product,index)=> index >2 ? false:true)

        return res.render("home/index",{products})
    }
}