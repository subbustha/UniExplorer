const express = require('express')
const authAdmin = require('../middleware/authAdmin')
const Item = require('../models/lafModel')
const multer = require('multer')
const sharp = require('sharp')
const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(request, file, callback) {
        request.validFile = true
        request.fileExist = false
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            //  return callback(new Error('Pleas Upload Image File of : JPEG, JPG or PNG'))
            request.validFile = false
            request.fileExist = true
        }
        callback(undefined, true)
    }
})
const router = new express.Router()

//Router to create item
router.post('/api/item/create', authAdmin, upload.single('image'), async (request, response) => {
    if (request.fileExist) {
        if (!request.validFile) {
            return response.status(406).send('Invalid Data Provided')
        }
    }
    const itemData = Object.keys(request.body)
    const allowedData = ['name', 'image', 'location', 'color'];
    const isValidOperation = itemData.every((data) => allowedData.includes(data))
    if (!isValidOperation) {
        return response.status(406).send("Invalid Data Provided")
    }
    try {
        if (request.file) {
            const buffer = await sharp(request.file.buffer).resize({ width: 300, height: 300 }).png({quality:20}).toBuffer()
            request.body.image = buffer
        }

        const item = new Item(request.body)
        await item.save()
        response.status(201).send(item)
    } catch (error) {
        response.status(500).send('Internal Server Error')
    }
})
//Router to get all items
router.get('/api/item', async (request, response) => {
    try {
        const items = await Item.find({})
        if (!items) {
            return response.status(404).send('Items not found')
        }
        response.status(200).send(items)
    } catch (error) {
        response.status(500).send('Internal Server Error')
    }
})
//Router to update an item with id
router.patch('/api/item/:id', authAdmin, async (request, response) => {
    if (!request.admin.super) {
        return response.status(401).send('Unauthorized')
    }
    const itemData = Object.keys(request.body)
    const allowedData = ['name', 'prices', 'description', 'available', 'picture']
    const isValidOperation = itemData.every((data) => allowedData.includes(data))
    if (!isValidOperation) {
        return response.status(406).send("Invalid Data Provided")
    }
    try {
        const item = await Item.findById({ _id: request.params.id })
        if (!item) {
            return response.status(404).send('Item not found')
        }
        itemData.forEach(data => {
            item[data] = request.body[data]
        })
        await item.save()
        response.status(200).send(item)
    } catch (error) {
        response.status(500).send('Internal Server Error')
    }
})
//Router to delete an item with id
router.delete('/api/item/:id', authAdmin, async (request, response) => {
    if (!request.admin.super) {
        return response.status(401).send('Unauthorized')
    }
    try {
        const item = await Item.findById({ _id: request.params.id })
        if (!item) {
            return response.status(404).send('Item not found')
        }
        await Item.deleteOne({ _id: request.params.id })
        response.status(200).send(item)
    } catch (error) {
        response.status(500).send("Internal Server Error")
    }

})
module.exports = router