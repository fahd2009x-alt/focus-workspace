// Edit 3: Updated default duration to 50 minutes
const DEFAULT_TIME = 50 * 60;
let timeLeft = DEFAULT_TIME;
let timerId = null;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
  if (timerId === null) {
    // Edit 5: Disable Start button while running
    startBtn.disabled = true;
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        timerId = null;
        startBtn.disabled = false;
      }
    }, 1000);
  }
});

pauseBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  startBtn.disabled = false;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  startBtn.disabled = false;
  timeLeft = DEFAULT_TIME;
  updateDisplay();
});

addBtn.addEventListener('click', () => {
  // Edit 4: Prevent empty task submissions
  const text = todoInput.value.trim();
  if (!text) return;

  const li = document.createElement('li');
  li.textContent = text;
  todoList.appendChild(li);
  todoInput.value = '';
});