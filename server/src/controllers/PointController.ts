import { Request, Response, response } from 'express'
import knex from '../database/connection'

class PointController {
    
    async show (req: Request, res: Response){
        const { id } = req.params  

        const point = await knex('points').where('id', id).first()

        if(!point) {
            return res.status(400).json({ message: 'point not found' })
        }
        
        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title')

        return res.json({ point, items })
    }

    async store (req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body
        
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await knex('points').insert(point)
    
        const point_id = insertedIds[0]
        
        const pointItems = items.map((item_id: number) => {
            return {point_id, item_id}
        })
    
        await knex('points_items').insert(pointItems)
    
        return res.json({
            id: point_id,
            ...point
        })
    }
}

export default PointController