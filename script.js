// Theme toggle
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// To-Do List
function addTask() {
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  if (input.value.trim() === '') return;
  const li = document.createElement('li');
  li.textContent = input.value;
  li.onclick = () => li.remove();
  list.appendChild(li);
  input.value = '';
  saveData();
}

// Notes
function saveNotes() {
  const notes = document.getElementById('notes-input').value;
  localStorage.setItem('notes', notes);
  loadNotes();
}
function loadNotes() {
  const saved = localStorage.getItem('notes');
  document.getElementById('saved-notes').textContent = saved || 'No notes yet';
}

// Backup / Restore
function downloadBackup() {
  const data = {
    notes: localStorage.getItem('notes') || '',
    todo: Array.from(document.querySelectorAll('#todo-list li')).map(li => li.textContent)
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'backup.json';
  link.click();
}
function restoreBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    localStorage.setItem('notes', data.notes || '');
    document.getElementById('todo-list').innerHTML = '';
    (data.todo || []).forEach(task => {
      const li = document.createElement('li');
      li.textContent = task;
      li.onclick = () => li.remove();
      document.getElementById('todo-list').appendChild(li);
    });
    loadNotes();
  };
  reader.readAsText(file);
}

// Save ToDo tasks in localStorage
function saveData() {
  const tasks = Array.from(document.querySelectorAll('#todo-list li')).map(li => li.textContent);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadData() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    li.onclick = () => li.remove();
    document.getElementById('todo-list').appendChild(li);
  });
}
window.onload = () => {
  loadNotes();
  loadData();
};
