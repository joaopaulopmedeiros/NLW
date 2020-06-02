import express, { response } from 'express'

const routes = express.Router()

routes.get('/', (req, res) => {
    res.json({ message: "HTTP: 200. OK" })
})

export default routes