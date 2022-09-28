const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const { log } = require('../../middlewares/logger.middleware')

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).sort({ _id: -1 }).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('stay')
        const criteria = { _id: ObjectId(reviewId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {

        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay) {
    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: id }, { $set: { ...stay } })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${toyId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    console.log(filterBy);
    var criteria = {}
    if (filterBy.range) criteria.price = { $gt: filterBy.range.start, $lt: filterBy.range.end }
    if (filterBy.type) criteria.type = filterBy.type
    if (filterBy.text) {
        var regex = new RegExp("^" + filterBy.text)
        criteria = { ...criteria, $or: [{ "loc.country": { $regex: regex, $options: 'i' } }, { "loc.city": { $regex: regex, $options: 'i' } }] }
    }
    if (filterBy.roomType) criteria = { ...criteria, roomType: { $regex: filterBy.roomType, $options: 'i' } }
    if (filterBy.capacity) criteria = { ...criteria, "capacity.guests": filterBy.capacity}
    if (filterBy.bedrooms) criteria = { ...criteria, "capacity.bedrooms": filterBy.bedrooms } 
    if (filterBy.bathrooms) criteria = { ...criteria, "capacity.bathrooms":  filterBy.bathrooms} 
    
    console.log("criteria ", criteria);
    return criteria
}



module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}