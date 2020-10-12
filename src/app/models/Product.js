const Base = require('./Base')
const db = require('../../config/db');

Base.init({table:'products'})

module.exports = {
    ...Base,

    async files(id){
        const results = await db.query(`
            SELECT * From files WHERE products_id = $1
        `, [id])
        return results.rows
    }, 
    async search(params){
        const {filter , category}=params
        let query = "",
            filterquery='WHERE'
        if(category){
            filterquery= `${filterquery}
            products.category_id=${category}
            AND
            `
        }
        filterquery =`
            ${filterquery}
            products.name ilike '%${filter}%'
            OR products.description ilike'%${filter}%'
        `


        query = `
            SELECT products.*,
                categories.name AS category_name
            from products
            LEFT JOIN  categories ON(categories.id = products.category_id)
            ${filterquery}
        `

        const results = await db.query(query)
        return results.rows
    }
}


//     async create(data){
//         const strsql = `  INSERT INTO products(
//             category_id,
//             user_id,
//             name,
//             description,
//             old_price,
//             price,
//             quantity,
//             status    
//         )VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
//         RETURNING id
// ` ;     

//     data.price = data.price.replace(/\D/g,"");
    
//     const values= [
//         data.category_id,
//         data.user_id ,
//         data.name,
//         data.description,
//         data.old_price || data.price,
//         data.price,
//         data.quantity,
//         data.status || 1,
//     ]
//          return await (await db.query(strsql,values));  
//     },