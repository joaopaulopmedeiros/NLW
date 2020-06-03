import { Request, Response } from 'express'
import knex from '../database/connection'

class PointController {
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