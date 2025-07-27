import Todo from '../models/Todo.js';

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const createTodo = async (req, res) => {
    const { text } = req.body;
    try {
        const newTodo = new Todo({
            text,
            user: req.user.id
        });
        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateTodo = async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Make sure user owns the todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        todo = await Todo.findByIdAndUpdate(req.params.id, { $set: { completed: req.body.completed } }, { new: true });
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const deleteTodo = async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Make sure user owns the todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Todo.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};