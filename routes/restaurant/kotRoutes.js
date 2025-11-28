const express = require('express');
const kotController = require('../../controllers/restaurant/kotController');

const router = express.Router();

router.post('/create', kotController.createKOT);
router.get('/all', kotController.getAllKOTs);

router.patch('/:kotId/item-statuses', kotController.updateItemStatuses);

router.get('/:id', kotController.getKOTById);
router.patch('/:id/status', kotController.updateKOTStatus);

module.exports = router;
