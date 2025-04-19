const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { 
  validateCreateComplaint, 
  validateUpdateComplaint, 
  validateUpdateStatus, 
  validateAddAdminResponse 
} = require('../validators/complaint.validator');

// Routes CRUD de base
router.post('/', validateCreateComplaint, complaintController.createComplaint);
router.get('/', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintById);
router.put('/:id', validateUpdateComplaint, complaintController.updateComplaint);
router.delete('/:id', complaintController.deleteComplaint);

// Routes avancées
router.patch('/:id/status', validateUpdateStatus, complaintController.updateStatus);
router.patch('/:id/admin-response', validateAddAdminResponse, complaintController.addAdminResponse);
router.patch('/:id/resolve', complaintController.markAsResolved);
router.get('/statistics/all', complaintController.getStatistics);
router.get('/user/:email', complaintController.getUserComplaints);

module.exports = router;
