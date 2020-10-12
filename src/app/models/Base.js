const db = require('../../config/db');

function find(filters,table){
    let query = ` SELECT * FROM  ${table}`
   
    if(filters){
        Object.keys(filters).map(key =>{
            //WHERE | OR |AND
            query  =`${query}
            ${key}`

            Object.keys(filters[key]).map(field =>{
                // query += `${field}='${filters[key][field]}'`
                query = `${query} ${field} = '${filters[key] [field]}'`

            })
        })
    }

    return db.query(query)
}

const Base = {
    init({table}){
        if(!table) throw new Error('Invalid Params')

        this.table = table

        return this
    },

    async find (id){
        const results = await find({where:{id}},this.table)

        return results.rows[0]
    },

    async findOne (filters){
        const results = await find(filters,this.table)

        return results.rows[0]
    },

    async findAll (filters){
        const results = await find(filters,this.table)

        return results.rows
    },

    async create (fields){
        // User.create({ name:'Leonardo'})
        try {
            let keys = [],
                values = []

            Object.keys(fields).map( key =>{
                keys.push(key)
                values.push(`'${fields[key]}'`)

            })

            const query = ` INSERT INTO ${this.table}(${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id`
            
            const results = await db.query(query)

            return results.rows[0].id
        } catch (error) {
            console.error("Erro base",error)
        }
    },

    put (id,fileds){
        try {
            let update = []

            Object.keys(fileds).map( key =>{
                //categoru_id=($1)
                const line = ` ${key} = '${fileds[key]}'`
                update.push(line)
            })
            let query = `UPDATE ${this.table} SET
             ${update.join(',')} WHERE id =${id}
            `
            
            return  db.query(query) 
        } catch (error) {
            console.error("Erro base",error)
        }
    },

    delete(id){
        return db.query(`DELETE FROM ${this.table} WHERE id=$1`,[id])
    },
}

module.exports = Base