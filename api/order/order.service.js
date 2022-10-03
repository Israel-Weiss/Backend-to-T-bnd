const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy) {
    try {
        const criteria = {}
        const collection = await dbService.getCollection('order')
        var orders = await collection.find(criteria).limit(99999999).sort({ _id: -1 }).toArray()
        return orders.reverse()
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('order')
        const criteria = { _id: ObjectId(reviewId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    console.log(order);
    try {
        // const orderToAdd = {
        //     byUserId: ObjectId(order.byUserId),
        //     aboutUserId: ObjectId(order.aboutUserId),
        //     txt: order.txt
        // }
        const collection = await dbService.getCollection('order')
        const addedStay = await collection.insertOne(order)
        return addedStay
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        var id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: id }, { $set: { ...order } })
        return order
    } catch (err) {
        logger.error(`cannot update order ${toyId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.hostId) criteria.bedrooms = filterBy.hostId
    return criteria
}




module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}