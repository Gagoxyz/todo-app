const API_URL = '/api/tasks';
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
});

// Crear tarea
document.getElementById('newTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!title) return;

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ title, description })
    });


    const newTask = await res.json();
    if (res.ok) {
        renderTask(newTask);
        e.target.reset();
    } else {
        alert(newTask.msg || 'Error al crear tarea');
    }
});

// Cargar tareas
const loadTasks = async () => {
    const res = await fetch(API_URL, {
        headers: { Authorization: token }
    });

    const tasks = await res.json();

    if (res.ok) {
        tasks.forEach(renderTask);
    } else {
        alert(tasks.msg || 'Error al cargar tareas');
    }
};

// Renderizar una tarea
function renderTask(task) {
    const div = document.createElement('div');
    div.className = 'task';
    div.draggable = true;
    div.dataset.id = task._id;

    div.innerHTML = `
        <strong>${task.title}</strong>
        ${task.description ? `<p>${task.description}</p>` : ''}
    `;

    // Drag events
    div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task._id);
    });

    const list = document.getElementById(task.status);
    if (list) list.appendChild(div);
}

// Drag & drop en columnas
document.querySelectorAll('.task-list').forEach((list) => {
    list.addEventListener('dragover', (e) => e.preventDefault());

    list.addEventListener('drop', async (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const newStatus = list.id;

        // Actualizar en DB
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            const taskEl = document.querySelector(`[data-id="${id}"]`);
            list.appendChild(taskEl);
        }
    });
});

loadTasks();
