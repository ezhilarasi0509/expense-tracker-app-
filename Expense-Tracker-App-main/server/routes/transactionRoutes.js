const express = require('express')
const { addTransaction, getAllTransaction, editTransaction, deleteTransaction } = require('../controllers/transactionCtrl')


//router

const router = express.Router()

//add transaction POST
router.post("/add", addTransaction)

router.post("/edit", editTransaction)

router.post('/delete', deleteTransaction)

//get transaction
router.post('/get', getAllTransaction)



module.exports=router;