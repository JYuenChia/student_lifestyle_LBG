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
      {/* ...rest of your code... */}
    </div>
  );
}