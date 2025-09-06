import { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

export default function TaskCard({ task, onEdit, onDelete, onToggleDone }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if task is overdue
  const isOverdue = task.date && !task.done && new Date(task.date) < new Date();

  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      padding: 16,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
      minWidth: 320,
      maxWidth: 340
    }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggleDone}
        style={{ width: 24, height: 24, marginRight: 12, marginTop: 4 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 18,
          fontWeight: 600,
          color: isOverdue ? '#ff5e7f' : '#222', // Red if overdue
          textDecoration: task.done ? 'line-through' : 'none'
        }}>
          {task.title}
        </div>
        <div style={{ fontSize: 13, color: '#939598', marginTop: 2 }}>
          {task.date
            ? `${new Date(task.date).toLocaleDateString()} ${task.time} ${task.ampm}`
            : ''}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            marginLeft: 8,
            marginTop: 2
          }}
        >
          <FaEllipsisV color="#939598" size={18} />
        </button>
        {task.repeat && task.repeat !== 'None' && (
          <svg
            style={{
              marginTop: 8,
              color: '#939598',
              fontSize: 18,
              width: 18,
              height: 18,
              display: 'block'
            }}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            title="Repeating Task"
          >
            <path d="M2.5 7.5V5a2.5 2.5 0 0 1 2.5-2.5h10M17.5 12.5V15a2.5 2.5 0 0 1-2.5 2.5h-10" />
            <polyline points="17.5 7.5 17.5 2.5 12.5 2.5" />
            <polyline points="2.5 12.5 2.5 17.5 7.5 17.5" />
          </svg>
        )}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: 28,
            right: 0,
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 10,
            minWidth: 100,
            padding: 8
          }}>
            <button
              onClick={onEdit}
              style={{
                background: 'none',
                border: 'none',
                color: '#222',
                padding: '6px 12px',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff5e7f',
                padding: '6px 12px',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}