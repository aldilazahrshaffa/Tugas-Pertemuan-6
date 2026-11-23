
import './style.css'

const appName: string = import.meta.env.VITE_APP_NAME

interface Task {
  id: number
  title: string
  subject: string
  deadline: string
  completed: boolean
}

type TaskFilter = 'all' | 'pending' | 'completed'

function getItems<T>(items: T[]): T[] {
  return items
}

let tasks: Task[] = [
  {
    id: 1,
    title: 'Membuat laporan praktikum',
    subject: 'Basis Data',
    deadline: '2026-11-23',
    completed: false
  },
  {
    id: 2,
    title: 'Menyelesaikan desain UI aplikasi',
    subject: 'Pengembangan Aplikasi Mobile',
    deadline: '2026-11-25',
    completed: false
  },
  {
    id: 3,
    title: 'Mempelajari materi TypeScript',
    subject: 'Pengembangan Aplikasi Web',
    deadline: '2026-11-20',
    completed: true
  }
]

let currentFilter: TaskFilter = 'all'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="dashboard">
    <aside class="sidebar">
      <div class="brand">🌿 ${appName}</div>

      <p class="menu-label">MENU UTAMA</p>
      <nav>

  <a href="#tasks" class="menu-item active" data-filter="all">
    📚 Semua Tugas
  </a>

  <a href="#tasks" class="menu-item" data-filter="pending">
    ⏳ Belum Selesai
  </a>

  <a href="#tasks" class="menu-item" data-filter="completed">
    ✅ Selesai
  </a>
</nav>

      <div class="sidebar-footer">
      </div>
    </aside>

    <main class="content">
      <header class="topbar">
        <div>
          <p class="greeting">SELAMAT DATANG 👋</p>
          <h1>Hai, semangat mengerjakan tugas!</h1>
          <p class="subtitle">Atur tugas kuliahmu agar lebih terorganisir.</p>
        </div>
        <div class="profile">🌷</div>
      </header>

      <section class="summary">
        <article class="summary-card">
          <span>📚</span>
          <p>Total Tugas</p>
          <h2 id="total-count">0</h2>
        </article>
        <article class="summary-card">
          <span>⏳</span>
          <p>Belum Selesai</p>
          <h2 id="pending-count">0</h2>
        </article>
        <article class="summary-card">
          <span>🌸</span>
          <p>Selesai</p>
          <h2 id="completed-count">0</h2>
        </article>
      </section>

      <section class="task-section" id="tasks">
        <div class="section-heading">
          <div>
            <h2>Daftar Tugas</h2>
            <p>Yuk, selesaikan satu per satu!</p>
          </div>
          <button class="add-button" id="add-task">+ Tambah Tugas</button>
        </div>

        <div class="task-list" id="task-list"></div>
      </section>
    </main>
  </div>

  <div class="modal-overlay" id="task-modal">
    <div class="task-modal">
      <div class="modal-heading">
        <div>
          <h2>Tambah Tugas 🌿</h2>
          <p>Catat tugas kuliah barumu di sini.</p>
        </div>
        <button type="button" class="close-button" id="close-modal">×</button>
      </div>

      <form id="task-form">
        <label for="task-title">Nama Tugas</label>
        <input id="task-title" type="text" placeholder="Masukkan nama tugas" required>

        <label for="task-subject">Mata Kuliah</label>
        <input id="task-subject" type="text" placeholder="Masukkan mata kuliah" required>

        <label for="task-deadline">Deadline</label>
        <input id="task-deadline" type="date" required>

        <div class="modal-actions">
          <button type="button" class="cancel-button" id="cancel-modal">Batal</button>
          <button type="submit" class="save-button">Simpan Tugas</button>
        </div>
      </form>
    </div>
  </div>
`

function renderTasks(): void {
  const taskList = document.querySelector<HTMLDivElement>('#task-list')!

  const completed = tasks.filter(task => task.completed).length
  const pending = tasks.length - completed

  document.querySelector('#total-count')!.textContent = String(tasks.length)
  document.querySelector('#pending-count')!.textContent = String(pending)
  document.querySelector('#completed-count')!.textContent = String(completed)

  const filteredTasks = getItems(tasks).filter(task => {
    if (currentFilter === 'pending') return !task.completed
    if (currentFilter === 'completed') return task.completed
    return true
  })

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p class="empty-message">Belum ada tugas di kategori ini 🌸</p>'
    return
  }

  taskList.innerHTML = filteredTasks.map(task => `
    <article class="task-card">
      <div class="task-info">
        <h3>${task.title}</h3>
        <p>${task.subject}</p>
        <small>📅 Deadline: ${task.deadline}</small>
      </div>

      <div class="task-actions">
        <span class="task-status ${task.completed ? 'done' : 'pending'}">
          ${task.completed ? 'Selesai' : 'Belum Selesai'}
        </span>

        <button class="toggle-task" data-id="${task.id}">
          ${task.completed ? '↩ Belum Selesai' : '✓ Tandai Selesai'}
        </button>

        <button class="edit-task" data-id="${task.id}">
          ✏️ Edit
        </button>

        <button class="delete-task" data-id="${task.id}">
          🗑️ Hapus
        </button>
      </div>
    </article>
  `).join('')
}

const modal = document.querySelector<HTMLDivElement>('#task-modal')!
const form = document.querySelector<HTMLFormElement>('#task-form')!

let editingTaskId: number | null = null

function openModal(): void {
  editingTaskId = null
  form.reset()

  document.querySelector('#task-modal h2')!.textContent = 'Tambah Tugas 🍓'
  document.querySelector<HTMLButtonElement>('.save-button')!.textContent = 'Simpan Tugas'

  modal.classList.add('show')
}

function editTask(id: number): void {
  const task = tasks.find(task => task.id === id)

  if (!task) return

  editingTaskId = id

  document.querySelector<HTMLInputElement>('#task-title')!.value = task.title
  document.querySelector<HTMLInputElement>('#task-subject')!.value = task.subject
  document.querySelector<HTMLInputElement>('#task-deadline')!.value = task.deadline

  document.querySelector('#task-modal h2')!.textContent = 'Edit Tugas 🍓'
  document.querySelector<HTMLButtonElement>('.save-button')!.textContent = 'Simpan Perubahan'

  modal.classList.add('show')
}

function closeModal(): void {
  modal.classList.remove('show')
  form.reset()
  editingTaskId = null
}

document.querySelector('#add-task')!.addEventListener('click', openModal)
document.querySelector('#close-modal')!.addEventListener('click', closeModal)
document.querySelector('#cancel-modal')!.addEventListener('click', closeModal)

form.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault()

  const title = document.querySelector<HTMLInputElement>('#task-title')!.value.trim()
  const subject = document.querySelector<HTMLInputElement>('#task-subject')!.value.trim()
  const deadline = document.querySelector<HTMLInputElement>('#task-deadline')!.value

  if (!title || !subject || !deadline) return

  if (editingTaskId !== null) {
    tasks = tasks.map(task =>
      task.id === editingTaskId
        ? { ...task, title, subject, deadline }
        : task
    )
  } else {
    const newTask: Task = {
      id: Date.now(),
      title,
      subject,
      deadline,
      completed: false
    }

    tasks.push(newTask)
  }

  renderTasks()
  closeModal()
})

document.querySelector('#task-list')!.addEventListener('click', (event: Event) => {
  const target = event.target

  if (!(target instanceof Element)) return

  const editButton = target.closest<HTMLButtonElement>('.edit-task')
  const deleteButton = target.closest<HTMLButtonElement>('.delete-task')
  const toggleButton = target.closest<HTMLButtonElement>('.toggle-task')

  if (editButton) {
    const id = Number(editButton.dataset.id)
    editTask(id)
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.id)
    const confirmed = window.confirm('Yakin ingin menghapus tugas ini?')

    if (!confirmed) return

    tasks = tasks.filter(task => task.id !== id)
    renderTasks()
  }

  if (toggleButton) {
    const id = Number(toggleButton.dataset.id)

    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    )

    renderTasks()
  }
})

document.querySelectorAll<HTMLAnchorElement>('.menu-item[data-filter]').forEach(menu => {
  menu.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault()

    const filter = menu.dataset.filter as TaskFilter
    currentFilter = filter

    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active')
    })

    menu.classList.add('active')

    renderTasks()
  })
})

renderTasks()
