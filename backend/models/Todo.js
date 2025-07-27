import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', TodoSchema);
export default Todo;