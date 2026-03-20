import express from 'express'
import { CreateItemData, deleteItem, getItems, getSingleItem } from '../controllers/Item.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const ItemRouter = express.Router()

ItemRouter.post('/save', verifyJWT, CreateItemData)
ItemRouter.get('/', verifyJWT, getItems)
ItemRouter.get('/:id', verifyJWT, getSingleItem)
ItemRouter.delete('/:id', verifyJWT, deleteItem)
// ItemRouter.post('/save', CreateItemData)


export default ItemRouter