let timeLeft = 25 * 60;
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
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        timerId = null;
      }
    }, 1000);
  }
});

pauseBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  timeLeft = 25 * 60;
  updateDisplay();
});

addBtn.addEventListener('click', () => {
  const li = document.createElement('li');
  li.textContent = todoInput.value;
  todoList.appendChild(li);
  todoInput.value = '';
});