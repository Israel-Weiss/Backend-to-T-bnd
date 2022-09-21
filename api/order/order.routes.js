const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getOrders, getOrderById, addOrder, updateOrder, removeOrder } = require('./order.controller')
const router = express.Router()

router.get('/', log, getOrders)
router.get('/:id', log, getOrderById)
router.post('/', log, addOrder)
router.put('/:id', log,  updateOrder)
router.delete('/:id', log, removeOrder)

module.exports = router
