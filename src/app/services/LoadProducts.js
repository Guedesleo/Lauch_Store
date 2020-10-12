const Product = require('../models/Product')


const {date, formatPrice}=require('../../lib/utils')

async function getImages(productId){
    let files = await Product.files(productId)

   files= files.map(file =>({
    ...file,
    src:`${file.path.replace("public","")}`
   }))
    return files
}

async function format(product){

    const files = await getImages(product.id)
    product.img = files[0].src
    product.files = files
    product.formattedOldPrice = formatPrice(product.old_price)
    product.formattedPrice = formatPrice(product.price)

    const {day,hour,minutes,month}=date(product.update_at)
    
    product.published ={
        day :`${day}/${month}`,
        hour:`${hour}h${minutes}`,

    }
    return product
}

const LoadService ={
  load(service , filter){
      this.filter = filter
    return this[service]()
  },

  async product(filter){
      try {
        const product = await Product.findOne(this.filter)
        return format(product)
      } catch (error) {
          console.log("LoadProduct",error)
      }
  },
  async products(filter){
    try {
        const products = await Product.findAll(this.filter)
        const productsPromise = products.map(format)
        
        Promise.all(productsPromise).then((values) => {
          console.log(values);
        });

        return Promise.all(productsPromise)
      } catch (error) {
          console.log("LoadProducts",error)
      }
  },
  format,
}


module.exports = LoadService