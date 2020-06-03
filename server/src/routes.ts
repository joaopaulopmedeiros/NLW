import express, { response } from 'express'

import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'

const routes = express.Router()
const pointController = new PointController()
const itemController = new ItemController()

routes.get('/', (req, res) => {
    res.json({ message: "HTTP: 200. OK" })
})

routes.get('/items', itemController.index)

routes.post('/points', pointController.store)

routes.get('/points/:id', pointController.show)

export default routes