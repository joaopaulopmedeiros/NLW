import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemController {
    async index (req: Request, res: Response) {
        const items = await knex('items').select('*')
        
        const serializedItems = items.map(item => {
            return { 
                id: item.id,
                title: item.name,
                image_url: `https://localhost:3333/uploads/${item.image}`,
             }
        })
    
        res.json(serializedItems)
    }
}

export default ItemController