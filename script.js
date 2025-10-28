let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let xp = parseInt(localStorage.getItem('xp')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;

const xpFill = document.getElementById('xpFill');
const xpText = document.getElementById('xpText');
const levelText = document.getElementById('level');
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const nextDayBtn = document.getElementById('nextDayBtn');

function updateXPDisplay() {
  const levelXP = xp % 100;
  xpFill.style.width = `${(levelXP / 100) * 100}%`;
  xpText.textContent = `XP: ${levelXP} / 100`;
  levelText.textContent = level;
}

function saveData() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('xp', xp);
  localStorage.setItem('level', level);
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, i) => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} data-index="${i}">
      ${task.text} (+${task.xp} XP)
      <button class="delete-btn" data-index="${i}">🗑</button>
    `;
    taskList.appendChild(label);
  });
}

function addTask(text, xpValue) {
  if (!text.trim()) return;
  tasks.push({ text, xp: parseInt(xpValue), done: false });
  renderTasks();
  saveData();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveData();
}

taskList.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const index = e.target.dataset.index;
    tasks[index].done = e.target.checked;
    xp += e.target.checked ? tasks[index].xp : -tasks[index].xp;

    if (xp >= 100) {
      level += Math.floor(xp / 100);
      xp = xp % 100;
    } else if (xp < 0) {
      xp = 0;
    }

    updateXPDisplay();
    saveData();
  }
});

taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    deleteTask(e.target.dataset.index);
  }
});

addTaskBtn.addEventListener('click', () => {
  const text = document.getElementById('newTaskText').value;
  const xpValue = document.getElementById('newTaskXP').value;
  addTask(text, xpValue);
  document.getElementById('newTaskText').value = '';
});

nextDayBtn.addEventListener('click', () => {
  tasks.forEach(task => (task.done = false));

  xp = 0;
  updateXPDisplay();

  renderTasks();
  saveData();
});

renderTasks();
updateXPDisplay();
