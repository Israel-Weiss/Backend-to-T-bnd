const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy) {
    try {
        const criteria = _buildCriteria({ filterBy })
        console.log(criteria);
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).limit(99999999).toArray()
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
        const stayToAdd = {
            byUserId: ObjectId(stay.byUserId),
            aboutUserId: ObjectId(stay.aboutUserId),
            txt: stay.txt
        }
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stayToAdd)
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
    const criteria = {}
    if (filterBy.hostId) criteria.bedrooms = filterBy.hostId
    // if (filterBy.tag) criteria.type = filterBy.type
    // if (filterBy.Price) criteria.Price = {price:{$gt:filterBy.Price[0],$lte:filterBy.Price[1]}}
    // if (label) {criteria.amenities = { $in: [label] }}
    return criteria
}

// function _buildCriteria_({ inStock, label, name }) {
//     const criteria = {}
//     inStock = JSON.parse(inStock)
//     if (name) {
//         const regex = new RegExp(name, 'i')
//         criteria.name = { $regex: regex }
//     }
//     if (inStock) {
//         criteria.inStock = true
//     }
//     if (label) {
//         criteria.labels = { $in: [label] }
//     }
//     return criteria
// }

// function _buildCriteria__(filterBy) {
//     const criteria = {}
//     if (filterBy.txt) {
//         const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
//         criteria.$or = [
//             {
//                 username: txtCriteria
//             },
//             {
//                 fullname: txtCriteria
//             }
//         ]
//     }
//     if (filterBy.minBalance) {
//         criteria.score = { $gte: filterBy.minBalance }
//     }
//     return criteria
// }



module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}