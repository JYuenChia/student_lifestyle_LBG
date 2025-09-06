import { FaPlus } from 'react-icons/fa';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import TimerModal from './TimerModal';

export default function ToDoCategoryPage({
  title,
  tasks,
  setTasks,
  showTimer,
  setShowTimer,
  showAddTask,
  setShowAddTask,
  editTaskIdx,
  setEditTaskIdx,
  editTaskData,
  setEditTaskData,
  handleAddTask,
  handleEditTask
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '32px 0 0 24px', fontFamily: 'Canva Sans, sans-serif', position: 'relative' }}>
      <button
        onClick={() => setShowAddTask(true)}
        style={{
          position: 'fixed',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#38b6ff',
          border: 'none',
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(56,182,255,0.18)',
          zIndex: 101,
          cursor: 'pointer'
        }}
      >
        <FaPlus color="#fff" size={28} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 16 }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#38b6ff',
            textDecoration: 'underline',
            textDecorationColor: '#38b6ff',
            cursor: 'pointer'
          }}
          onClick={() => setShowTimer(true)}
        >
          Focus Mode
        </span>
      </div>
      <TimerModal show={showTimer} onClose={() => setShowTimer(false)} />
      <AddTaskModal show={showAddTask} onClose={() => setShowAddTask(false)} onAdd={handleAddTask} />
      {editTaskIdx !== null && (
        <AddTaskModal
          show={true}
          onClose={() => { setEditTaskIdx(null); setEditTaskData(null); }}
          onAdd={handleEditTask}
          initialData={editTaskData}
        />
      )}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // centers children horizontally
        marginTop: 16
        }}>
        {tasks.map((task, idx) => (
          <TaskCard
            key={idx}
            task={task}
            onEdit={() => {
              setEditTaskIdx(idx);
              setEditTaskData(task);
              setShowAddTask(false);
            }}
            onDelete={() => {
              setTasks(tasks.filter((_, i) => i !== idx));
            }}
            onToggleDone={() => {
              setTasks(tasks.map((t, i) =>
                i === idx ? { ...t, done: !t.done } : t
              ));
            }}
          />
        ))}
      </div>
    </div>
  );
}