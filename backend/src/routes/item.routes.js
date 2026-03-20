import express from 'express'
import { CreateItemData, deleteItem, getItems, getSingleItem } from '../controllers/Item.controller.js'

const ItemRouter = express.Router()

ItemRouter.post('/save', CreateItemData)
ItemRouter.get('/', getItems)
ItemRouter.get('/:id', getSingleItem)
ItemRouter.delete('/:id', deleteItem)
// ItemRouter.post('/save', CreateItemData)


export default ItemRouter