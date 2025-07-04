function $(selector) {
  return document.querySelector(selector);
}

const loginForm = $('#login-form');
const forumSection = $('#forum-section');
const loginSection = $('#login-section');
const topicForm = $('#topic-form');
const topicsDiv = $('#topics');

const userStorageKey = 'chems_user';
const topicsStorageKey = 'chems_topics';

function loadUser() {
  return JSON.parse(localStorage.getItem(userStorageKey));
}

function saveUser(user) {
  localStorage.setItem(userStorageKey, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(userStorageKey);
}

function loadTopics() {
  return JSON.parse(localStorage.getItem(topicsStorageKey)) || [];
}

function saveTopics(topics) {
  localStorage.setItem(topicsStorageKey, JSON.stringify(topics));
}

function showLogin() {
  loginSection.classList.remove('hidden');
  forumSection.classList.add('hidden');
}

function showForum() {
  loginSection.classList.add('hidden');
  forumSection.classList.remove('hidden');
}

function renderTopics() {
  const user = loadUser();
  const topics = loadTopics();
  topicsDiv.innerHTML = '';
  if (topics.length === 0) {
    topicsDiv.innerHTML = '<p>Aucun sujet pour le moment.</p>';
    return;
  }
  topics.forEach((topic, index) => {
    const div = document.createElement('div');
    div.className = 'topic';
    div.innerHTML = `<h3>${topic.title}</h3>\n      <p>${topic.content}</p>\n      <p class="meta">Par ${topic.author} le ${topic.date}</p>`;
    if (user && user.role === 'admin') {
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Supprimer';
      delBtn.addEventListener('click', () => {
        topics.splice(index, 1);
        saveTopics(topics);
        renderTopics();
      });
      div.appendChild(delBtn);
    }
    topicsDiv.appendChild(div);
  });
}

function init() {
  const user = loadUser();
  if (user) {
    showForum();
    $('#welcome').textContent = `Bienvenue ${user.username} (${user.role})`;
    renderTopics();
  } else {
    showLogin();
  }
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = $('#username').value.trim();
  const role = $('#role').value;
  if (username) {
    saveUser({ username, role });
    $('#username').value = '';
    init();
  }
});

$('#logout-button').addEventListener('click', () => {
  clearUser();
  init();
});

topicForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('#topic-title').value.trim();
  const content = $('#topic-content').value.trim();
  if (title && content) {
    const user = loadUser();
    const topics = loadTopics();
    const date = new Date().toLocaleString('fr-FR');
    topics.push({ title, content, author: user.username, date });
    saveTopics(topics);
    topicForm.reset();
    renderTopics();
  }
});

init();
