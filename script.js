let currentDuration = 50 * 60; // المدة الافتراضية
let timeLeft = currentDuration;
let timerId = null;
let currentFilter = 'all';

let tasks = JSON.parse(localStorage.getItem('focus_tasks')) || [];

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// عناصر تحديد الدقائق الجديدة
const customMinsInput = document.getElementById('custom-mins');
const setTimeBtn = document.getElementById('set-time-btn');

function playAlertChime() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.8);
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerDisplay.textContent = formatted;
  document.title = `(${formatted}) Focus Workspace`;
}

// تفعيل زر تغيير الدقائق بالمزاج
setTimeBtn.addEventListener('click', () => {
  if (timerId !== null) return; // لا تغيير أثناء العد
  const mins = parseInt(customMinsInput.value);
  if (isNaN(mins) || mins <= 0) return;
  
  currentDuration = mins * 60;
  timeLeft = currentDuration;
  updateDisplay();
});

function saveAndRender() {
  localStorage.setItem('focus_tasks', JSON.stringify(tasks));
  todoList.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');
    li.addEventListener('click', () => {
      task.completed = !task.completed;
      saveAndRender();
    });
    todoList.appendChild(li);
  });
}

startBtn.addEventListener('click', () => {
  if (timerId === null) {
    startBtn.disabled = true;
    customMinsInput.disabled = true;
    setTimeBtn.disabled = true;
    
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        timerId = null;
        startBtn.disabled = false;
        customMinsInput.disabled = false;
        setTimeBtn.disabled = false;
        playAlertChime();
      }
    }, 1000);
  }
});

pauseBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  startBtn.disabled = false;
  customMinsInput.disabled = false;
  setTimeBtn.disabled = false;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  startBtn.disabled = false;
  customMinsInput.disabled = false;
  setTimeBtn.disabled = false;
  timeLeft = currentDuration; // يرجع للوقت اللي المستخدم حدده
  updateDisplay();
});

addBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, completed: false });
  todoInput.value = '';
  saveAndRender();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    saveAndRender();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveAndRender();
});

updateDisplay();
saveAndRender();