const transactionModel = require('../models/transactionModel');
const moment = require('moment');
const userModel = require('../models/userModel');

const getAllTransaction = async (req, res) => {
  try {
      const { frequency, selectedDate, type, sortBy } = req.body;
      let sortCriteria = { date: -1 }; // Default sort by date descending

      if (sortBy === 'amountDesc') {
          sortCriteria = { amount: -1 };
      } else if (sortBy === 'amountAsc') {
          sortCriteria = { amount: 1 };
      } else if (sortBy === 'dateAsc') {
          sortCriteria = { date: 1 };
      }

      const transactions = await transactionModel.find({
          ...(frequency !== 'custom' ? {
              date: {
                  $gt: moment().subtract(Number(frequency), "d").toDate(),
              },
          } : {
              date: {
                  $gte: selectedDate[0],
                  $lte: selectedDate[1]
              }
          }),
          userid: req.body.userid,
          ...(type !== 'all' && { type })
      }).sort(sortCriteria);
      console.log(transactions);
      res.status(200).json(transactions);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
};

const addTransaction = async (req, res) => {
  try {
      const newTransaction = new transactionModel(req.body);
      await newTransaction.save();

      // Update user balance
      const user = await userModel.findById(req.body.userid);
      const amount = parseFloat(req.body.amount);
      if (req.body.type === 'income') {
          user.initialBalance += amount;
      } else if (req.body.type === 'expense') {
          user.initialBalance -= amount;
      }
      await user.save();

      res.status(201).send('Transaction Created');
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
};

const editTransaction = async (req, res) => {
  try {
      const { transactionId, payload } = req.body;
      const oldTransaction = await transactionModel.findById(transactionId);

      const user = await userModel.findById(oldTransaction.userid);

      const oldAmount = parseFloat(oldTransaction.amount);
      const newAmount = parseFloat(payload.amount);

      if (oldTransaction.type === 'income') {
          user.initialBalance -= oldAmount;
      } else if (oldTransaction.type === 'expense') {
          user.initialBalance += oldAmount;
      }

      await transactionModel.findByIdAndUpdate(transactionId, payload);

      if (payload.type === 'income') {
          user.initialBalance += newAmount;
      } else if (payload.type === 'expense') {
          user.initialBalance -= newAmount;
      }

      await user.save();
      res.status(200).send('Edit Successful');
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
};

const deleteTransaction = async (req, res) => {
  try {
      const transaction = await transactionModel.findById(req.body.transactionId);

      const user = await userModel.findById(transaction.userid);

      const amount = parseFloat(transaction.amount);

      if (transaction.type === 'income') {
          user.initialBalance -= amount;
      } else if (transaction.type === 'expense') {
          user.initialBalance += amount;
      }

      await user.save();
      await transactionModel.findByIdAndDelete(req.body.transactionId);

      res.status(200).send('Transaction Deleted');
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
};

module.exports = { getAllTransaction, addTransaction, editTransaction, deleteTransaction };