const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishListController');

const router = express.Router();

router.post('/add', addToWishlist);
router.get('/:userId', getWishlist);
router.delete('/remove', removeFromWishlist);

module.exports = router;
