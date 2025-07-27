import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

// @route   GET api/todos
// @desc    Get all user's todos
// @access  Private
router.get('/', authMiddleware, getTodos);

// @route   POST api/todos
// @desc    Create a todo
// @access  Private
router.post('/', authMiddleware, createTodo);

// @route   PUT api/todos/:id
// @desc    Update a todo (mark as complete)
// @access  Private
router.put('/:id', authMiddleware, updateTodo);

// @route   DELETE api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', authMiddleware, deleteTodo);

export default router;