const express = require('express');
const adminRoutes = require('./admin.routes')
const userRoutes = require('./user.routes')
const payment = require('./Payment.routes');
const ccAvenue = require('./ccAvenue.routes');
const roomRoutes =  require('./room.routes')
const boliRoutes = require('./boli.routes');
const trustRoutes = require('./trust.routes');
const committeeRoutes = require('./committee.routes');
const vehicleRoutes = require('./vehicle.routes');
const hrRoutes = require('./hr.routes');
const expenseRoutes = require('./expense.routes');
const storeRoutes = require('./store.routes');

const router = express.Router();



router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/payment', payment)
router.use('/ccAvenue', ccAvenue)
router.use('/room', roomRoutes);
router.use('/boli', boliRoutes);
router.use('/trust', trustRoutes);
router.use('/committee', committeeRoutes);
router.use('/vehicle', vehicleRoutes);
router.use('/hr', hrRoutes);
router.use('/expense', expenseRoutes);
router.use('/store', storeRoutes);

module.exports = router;
