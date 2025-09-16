const STORAGE_USER = 'chems_user';
const STORAGE_TOPICS = 'chems_topics';

const loginForm = document.getElementById('login-form');
const loginName = document.getElementById('login-name');
const loginRole = document.getElementById('login-role');
const loginSection = document.getElementById('login-section');
const forumSection = document.getElementById('forum-section');
const adminSection = document.getElementById('admin-section');
const topicForm = document.getElementById('topic-form');
const topicTitle = document.getElementById('topic-title');
const topicContent = document.getElementById('topic-content');
const topicsDiv = document.getElementById('topics');
const adminTopicsDiv = document.getElementById('admin-topics');
const userInfo = document.getElementById('user-info');
const logoutButton = document.getElementById('logout-button');

function getUser() {
  return JSON.parse(localStorage.getItem(STORAGE_USER));
}

function setUser(user) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_USER);
}

function getTopics() {
  return JSON.parse(localStorage.getItem(STORAGE_TOPICS)) || [];
}

function setTopics(topics) {
  localStorage.setItem(STORAGE_TOPICS, JSON.stringify(topics));
}

function renderTopics() {
  const topics = getTopics();
  topicsDiv.innerHTML = '';
  if (topics.length === 0) {
    topicsDiv.innerHTML = '<p>Aucun sujet pour le moment.</p>';
    return;
  }
  topics.forEach(t => {
    const div = document.createElement('div');
    div.className = 'topic';
    div.innerHTML = `<h3>${t.title}</h3><p>${t.content}</p><p class="meta">Par ${t.author} le ${t.date}</p>`;
    topicsDiv.appendChild(div);
  });
}

function renderAdminTopics() {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    adminSection.classList.add('hidden');
    return;
  }
  adminSection.classList.remove('hidden');
  const topics = getTopics();
  adminTopicsDiv.innerHTML = '';
  if (topics.length === 0) {
    adminTopicsDiv.innerHTML = '<p>Aucun sujet.</p>';
    return;
  }
  topics.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'topic';
    div.innerHTML = `<strong>${t.title}</strong> - ${t.author} <button data-i="${i}">Supprimer</button>`;
    adminTopicsDiv.appendChild(div);
  });
  adminTopicsDiv.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-i'), 10);
      const all = getTopics();
      all.splice(idx, 1);
      setTopics(all);
      renderTopics();
      renderAdminTopics();
    });
  });
}

function updateUI() {
  const user = getUser();
  if (!user) {
    loginSection.classList.remove('hidden');
    forumSection.classList.add('hidden');
    adminSection.classList.add('hidden');
    userInfo.textContent = '';
    logoutButton.classList.add('hidden');
    return;
  }
  loginSection.classList.add('hidden');
  forumSection.classList.remove('hidden');
  userInfo.textContent = `Bienvenue ${user.name} (${user.role})`;
  logoutButton.classList.remove('hidden');
  renderTopics();
  renderAdminTopics();
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = loginName.value.trim();
  const role = loginRole.value;
  if (!name) return;
  setUser({ name, role });
  loginForm.reset();
  updateUI();
});

logoutButton.addEventListener('click', () => {
  clearUser();
  updateUI();
});

topicForm.addEventListener('submit', e => {
  e.preventDefault();
  const user = getUser();
  const title = topicTitle.value.trim();
  const content = topicContent.value.trim();
  if (!user || !title || !content) return;
  const all = getTopics();
  const date = new Date().toLocaleString('fr-FR');
  all.push({ title, content, author: user.name, date });
  setTopics(all);
  topicForm.reset();
  renderTopics();
  renderAdminTopics();
});

updateUI();
