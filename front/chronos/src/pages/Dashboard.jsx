
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useCallback } from 'react'

function Dashboard() {
  const navigate = useNavigate()
  const [reminders, setReminders] = useState([])
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [newReminder, setNewReminder] = useState({ title: '', description: '', date: '' })
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [editReminderModal, setEditReminderModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)
  const [editNoteModal, setEditNoteModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)


  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) navigate('/')
  }, [navigate, token])

const fetchData = useCallback(async () => {
  if (!token) return;
  
  const config = { 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  }

  try {
    const [reminderRes, notesRes] = await Promise.all([
      axios.get('http://localhost:5000/reminders', config),
      axios.get('http://localhost:5000/notes', config)
    ]);
    
    setReminders(reminderRes.data);
    setNotes(notesRes.data);
    setError('');
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/');  
    } else {
      setError(err.response?.data?.message || 'Erro ao carregar dados');
    }
  }
}, [token, navigate]);

useEffect(() => {
  fetchData();
}, [fetchData]);

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  const filteredReminders = reminders.filter(rem =>
    rem.date === selectedDate.toISOString().split('T')[0]
  )

  const upcomingReminders = reminders.filter(rem => {
    const remDate = new Date(rem.date);
    const now = new Date();
    const futureLimit = new Date()
    futureLimit.setMonth(futureLimit.getMonth() + 3);
    return remDate > now && remDate < futureLimit
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="min-h-screen bg-[#3B2F2F] text-white px-6 py-8">
      <div className="relative mb-8">
  <div className="absolute left-0 top-0">
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-sm"
    >
      Sair
    </button>
  </div>
  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start justify-center'>
  <div className="flex flex-col items-center">
    <h1 className="text-3xl font-bold text-amber-400 mb-4">Chronos</h1>
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
      className="react-calendar"
    />
  </div>

<div className="bg-[#5E4B3C] p-4 rounded-lg shadow max-h-[400px] overflow-y-auto">
            <h2 className="text-xl font-semibold text-amber-300 mb-2">Próximos Lembretes</h2>
            {upcomingReminders.length === 0 ? (
              <p className="text-gray-300">Nenhum lembrete futuro.</p>
            ) : (
              upcomingReminders.map(rem => (
                <div key={rem.id} className="mb-2 border-b border-amber-200 pb-2">
                  <p className="text-sm text-amber-200 font-bold">{rem.title}</p>
                  <p className="text-sm text-gray-200">{rem.description}</p>
                  <p className="text-xs text-gray-400">{rem.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {error && <p className="text-red-300 text-center mb-4">{error}</p>}
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lembretes do dia</h2>
            <button
              onClick={() => setShowReminderModal(true)}
              className="text-amber-300 hover:underline text-sm"
            >
              + Novo
            </button>
          </div>
          {filteredReminders.length === 0 ? (
            <p className="text-gray-300">Nenhum lembrete nesta data.</p>
          ) : (
            <ul className="space-y-4">
              {filteredReminders.map((item) => (
                <li key={item.id} className="bg-[#5E4B3C] p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-amber-200">{item.title}</h3>
                      <p className="text-sm text-gray-200">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Data: {item.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <FaEdit
                          className="cursor-pointer text-yellow-300"
                          onClick={() => {
                            setEditingReminder(item)
                            setEditReminderModal(true)
                          }}
                        />
                      <FaTrash
                        className="cursor-pointer text-red-400"
                        onClick={async () => {
                          await axios.delete(`http://localhost:5000/reminders/${item.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          })
                          fetchData()
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Anotações</h2>
            <button
              onClick={() => setShowNoteModal(true)}
              className="text-amber-300 hover:underline text-sm"
            >
              + Nova
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="text-gray-300">Nenhuma anotação registrada.</p>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note.id} className="bg-[#5E4B3C] p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-amber-200">{note.title}</h3>
                      <p className="text-sm text-gray-200">{note.content}</p>
                    </div>
                    <FaEdit
                      className="cursor-pointer text-yellow-300"
                      onClick={() => {
                        setEditingNote(note)
                        setEditNoteModal(true)
                      }}
                    />
                    <FaTrash
                      className="cursor-pointer text-red-400"
                      onClick={async () => {
                        await axios.delete(`http://localhost:5000/notes/${note.id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        })
                        fetchData()
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* inicio dos modais */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#5E4B3C] p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Novo Lembrete</h2>
            <input
              type="text"
              placeholder="Título"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              className="w-full p-2 mb-2 rounded bg-white text-black"
            />
            <textarea
              placeholder="Descrição"
              value={newReminder.description}
              onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
              className="w-full p-2 mb-2 rounded bg-white text-black"
            />
            <input
              type="date"
              value={newReminder.date}
              onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
              className="w-full p-2 mb-4 rounded bg-white text-black"
            />
            <div className="flex justify-between">
              <button
                onClick={async () => {
                  await axios.post('http://localhost:5000/reminders', newReminder, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  setShowReminderModal(false)
                  setNewReminder({ title: '', description: '', date: '' })
                  fetchData()
                }}
                className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button onClick={() => setShowReminderModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#5E4B3C] p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Nova Nota</h2>
            <input
              type="text"
              placeholder="Título"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full p-2 mb-2 rounded bg-white text-black"
            />
            <textarea
              placeholder="Conteúdo"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full p-2 mb-4 rounded bg-white text-black"
            />
            <div className="flex justify-between">
              <button
                onClick={async () => {
                  await axios.post('http://localhost:5000/notes', newNote, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  setShowNoteModal(false)
                  setNewNote({ title: '', content: '' })
                  fetchData()
                }}
                className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button onClick={() => setShowNoteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    

      {editReminderModal && editingReminder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#5E4B3C] p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Editar Lembrete</h2>
            <input
              type="text"
              value={editingReminder.title}
              onChange={(e) => setEditingReminder({ ...editingReminder, title: e.target.value })}
              className="w-full p-2 mb-2 rounded bg-white text-black"
            />
            <textarea
              value={editingReminder.description}
              onChange={(e) => setEditingReminder({ ...editingReminder, description: e.target.value })}
              className="w-full p-2 mb-2 rounded bg-white text-black"
            />
            <input
              type="date"
              value={editingReminder.date}
              onChange={(e) => setEditingReminder({ ...editingReminder, date: e.target.value })}
              className="w-full p-2 mb-4 rounded bg-white text-black"
            />
            <div className="flex justify-between">
              <button
                onClick={async () => {
                  await axios.put(`http://localhost:5000/reminders/${editingReminder.id}`, editingReminder, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  setEditReminderModal(false)
                  setEditingReminder(null)
                  fetchData()
                }}
                className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button onClick={() => setEditReminderModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {editNoteModal && editingNote && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#5E4B3C] p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Editar Nota</h2>
            <input
              type="text"
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              className="w-full p-2 mb-2 rounded bg-white text-black"
            />
            <textarea
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              className="w-full p-2 mb-4 rounded bg-white text-black"
            />
            <div className="flex justify-between">
              <button
                onClick={async () => {
                  await axios.put(`http://localhost:5000/notes/${editingNote.id}`, editingNote, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  setEditNoteModal(false)
                  setEditingNote(null)
                  fetchData()
                }}
                className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button onClick={() => setEditNoteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default Dashboard