import express from 'express'
import routes from './routes'
import path from 'path'

const app = express()
const files = path.resolve(__dirname, '..', 'uploads')

app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(files))

app.listen(3333)