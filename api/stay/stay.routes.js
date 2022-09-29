const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStays, getStayById, addStay, updateStay, removeStay, getPlaceList } = require('./stay.controller')
const router = express.Router()

router.get('/', log, getStays)
router.get('/placelist', getPlaceList)
router.get('/:id', getStayById)
router.post('/', log, requireAuth, addStay)
router.put('/:id', updateStay)
router.delete('/:id', log, requireAuth, requireAdmin, removeStay)

module.exports = router
