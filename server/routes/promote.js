const express = require('express');
const router = express.Router();
// not using atm.
router.post('/group/:id', function (req, res) {

});
// define the about route
router.get('/about', function (req, res) {
    res.send('About birds')
});

module.exports = router;