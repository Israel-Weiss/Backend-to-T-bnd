const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStays, getStayById, addStay, updateStay, removeStay, addReview } = require('./stay.controller')
const router = express.Router()

router.get('/', log, getStays)
router.get('/:id', log, getStayById)
router.post('/', log, requireAuth, addStay)
router.put('/:id', log, requireAuth, updateStay)
router.delete('/:id', log, requireAuth, requireAdmin, removeStay)

module.exports = router
