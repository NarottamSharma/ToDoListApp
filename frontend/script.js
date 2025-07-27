document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: Change this to your Droplet's IP or domain name during deployment
    const API_URL = 'http://localhost:5000/'; 
    
    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    const logoutBtn = document.getElementById('logout-btn');

    // Toggle between login and register forms
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form-container').classList.add('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
    });

    // Check for token on initial load
    const token = localStorage.getItem('token');
    if (token) {
        showApp();
        fetchTodos();
    } else {
        showAuth();
    }

    function showApp() {
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }

    function showAuth() {
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }

    // --- Event Listeners ---
    registerForm.addEventListener('submit', handleRegister);
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    todoForm.addEventListener('submit', handleAddTodo);

    // --- API Handlers ---

    async function handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Registration failed');
            
            localStorage.setItem('token', data.token);
            showApp();
            fetchTodos();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Login failed');

            localStorage.setItem('token', data.token);
            showApp();
            fetchTodos();
        } catch (err) {
            alert(err.message);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        todoList.innerHTML = '';
        showAuth();
    }

    async function fetchTodos() {
        try {
            const res = await fetch(`${API_URL}/todos`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (!res.ok) throw new Error('Could not fetch todos');
            const todos = await res.json();
            renderTodos(todos);
        } catch (err) {
            console.error(err);
            handleLogout(); // If token is invalid, log out
        }
    }

    async function handleAddTodo(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (!text) return;
        try {
            await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') },
                body: JSON.stringify({ text }),
            });
            todoInput.value = '';
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    }

    async function toggleTodo(id, completed) {
        try {
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') },
                body: JSON.stringify({ completed }),
            });
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteTodo(id) {
        try {
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': localStorage.getItem('token') },
            });
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    }

    // --- DOM Rendering ---

    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.dataset.id = todo._id;
            if (todo.completed) {
                li.classList.add('completed');
            }

            const span = document.createElement('span');
            span.textContent = todo.text;
            span.addEventListener('click', () => toggleTodo(todo._id, !todo.completed));

            const button = document.createElement('button');
            button.textContent = 'X';
            button.addEventListener('click', () => deleteTodo(todo._id));
            
            li.appendChild(span);
            li.appendChild(button);
            todoList.appendChild(li);
        });
    }
});