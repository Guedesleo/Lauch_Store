const {unlinkSync} = require('fs')

const Category = require('../models/category')
const Product = require('../models/Product')
const File = require('../models/File')

const {date, formatPrice}=require('../../lib/utils')


module.exports ={
   async create(req,res){
        try {
             //Pegar Categorias
            const categories = await Category.findAll()
            return res.render("products/create.njk",{categories})
        } catch (error) {
            console.error("Erro Products",error)
        }       
    },

    async post(req,res){
        try {
            
             //logica de salvar
                const keys = Object.keys(req.body)
                for(key of keys){     
                    if (req.body[key] == ""){
                        return res.send('Please, fill all fieslds')                    
                       }
                   }
                   if(req.files.length == 0)
                        return res.send('Please , send ate least one image')
               
                    let {category_id, name , description , old_price,
                    price, quantity,status} = req.body

                    price = price.replace(/\D/g,"");

                    const products_id = await  Product.create({
                        category_id, 
                        user_id:req.session.userId,
                        name , 
                        description , 
                        old_price:old_price || price,
                        price,
                        quantity,
                        status: status || 1
                    })
               
                   const filesPromise = req.files.map(file => 
                    File.create({name:file.filename , path : file.path ,products_id}))
               
                   await Promise.all(filesPromise)

                 return res.redirect(`/products/${products_id}/edit`)
        } catch (error) {
            console.error("Erro Products",error)
        }
    },  

    async show(req,res){
        try {
            const product = await Product.find(req.params.id)

            if(!product) return res.send("Product Not found ")
    
            const {day,hour,minutes,month}=date(product.update_at)
    
            product.published ={
                day :`${day}/${month}`,
                hour:`${hour}h${minutes}`,
    
            }
    
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)
    
            let files = await Product.files(product.id)
    
            files= files.map(file =>({
                ...file,
                src1:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))
            
            return res.render("products/show", {product,files})
        } catch (error) {
            console.error("Erro Products show",error)
        }
    },

    async edit (req,res){
        try {
            
        const product = await Product.find(req.params.id)

        if(!product) return res.send("Product not found")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        
        const categories = await   Category.findAll();
        
        //get Images
        let files = await Product.files(product.id)
          files = files.map(file => ({
              ...file,
              src1:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
          }))

      return res.render("products/edit",{product,categories,files})
    } catch (error) {
        console.error( "Erro Products edit",error);
    }
    },

    async put (req,res){
        try {
            const keys = Object.keys(req.body)
            for(key of keys){     
                if (req.body[key] == "" && key != "removed_files"){
                    return res.send('Please, fill all fieslds')                    
                   }
               }

               if(req.files.length !=0){
                   const newFilesPromise = req.files.map( file => File.create({...file, product_id :req.body.id}))

                   await Promise.all(newFilesPromise)
               }

            if(req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")  
                const lastIndex= removedFiles.length -1
                removedFiles.splice(lastIndex,1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }
            req.body.price = req.body.price.replace(/\D/g,"");

            if(req.body.old_price != req.body.price){
                const oldProduct = await Product.find(req.body.id);

                req.body.old_price = oldProduct.rows[0].price;
            }
            await Product.put(req.body.id,{
                category_id : req.body.category_id,
                name : req.body.name,
                description : req.body.description,
                old_price : req.body.old_price,
                price : req.body.price,
                quantity : req.body.quantity,
                status : req.body.status,
            })

            return res.redirect(`/products/${req.body.id}`)                    
    } catch (error) {
        console.error("Erro Products put",error);
    }
    },
    
    async delete(req,res){
        const files = await Product.files(req.body.id)
        
        await Product.delete(req.body.id)

        files.map(file =>{
            try{
                unlinkSync(file.path)
            }catch(err){
                console.error(err);
            }   
         })

        return res.redirect('/products/create')
    }
}