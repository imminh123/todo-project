const express = require('express');
const TodoRouter = express.Router();
const TodoModel = require('../model/todoModel');


TodoRouter.get('/', (req,res) => {
    TodoModel.find({})
    .then(todoFound => {
        res.status(201).json({success: 1, todo: todoFound});
    })
    .catch(err => {
        res.status(500).json({success: 0, error: err});
    })
})

TodoRouter.put('/checkall', (req,res) => {
    const {check} = req.body;
    console.log('check in the server '+check)
    TodoModel.find({})
    .then(todoFound => {
        todoFound.forEach(todo => {
            todo.completed = check
            todo.save();
        })
    })
    .catch(err => {
        res.status(500).json({success: 0, error: err});
    })
})

TodoRouter.delete('/clearcompleted', (req,res) => {
    TodoModel.find({})
    .then(todoFound => {
        todoFound.forEach(todo => {
            if(todo.completed) {
                todo.remove();
            }
        })
    })
    .catch(err => {
        res.status(500).json({success: 0, error: err});
    })
})

TodoRouter.post('/', (req,res) => {
    const {title} = req.body;
    TodoModel.create({title})
    .then(todoCreated => {
        res.status(200).json({success: 1, todo: todoCreated});
    })
    .catch(err => {
        res.status(500).json({success: 0, error: err});
    })
})

TodoRouter.delete('/:id', (req,res) => {
    const id = req.params.id;
    TodoModel.deleteOne({_id: id}, (err)=> {
        if(err) res.status(500).json({success: 0, error: err});
    })
})

TodoRouter.put('/:id', (req,res) => {
    const id = req.params.id;
    const {title, completed, edited} = req.body;
    console.log(req.body);
    TodoModel.findOne({_id: id}, (err, todoFound) => {
        if(err) res.status(500).json({success: 0, error: err});
        else if( !todoFound) res.status(500).json({success: 0, error: "Todo not found"});
        else{
            for(key in {title, completed,edited}){
                todoFound[key] = req.body[key]
            }
            todoFound.save((err, todoUpdated) => {
                if(err) res.status(500).json({success: 0, error: err})
                else res.status(200).json({success: 1, todo: todoUpdated})
            })
        }
    })
})

module.exports = TodoRouter;