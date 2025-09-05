import { useState } from 'react';
import ToDoCategoryPage from './ToDoCategoryPage';

export default function MainToDo() {
  const [selectedCat, setSelectedCat] = useState('Academic');
  const [academicTasks, setAcademicTasks] = useState([]);
  const [personalTasks, setPersonalTasks] = useState([]);
  const [wellnessTasks, setWellnessTasks] = useState([]);

  const [showTimer, setShowTimer] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editTaskIdx, setEditTaskIdx] = useState(null);
  const [editTaskData, setEditTaskData] = useState(null);

  const categoryProps = {
    Academic: {
      title: 'Academic',
      tasks: academicTasks,
      setTasks: setAcademicTasks,
    },
    Personal: {
      title: 'Personal',
      tasks: personalTasks,
      setTasks: setPersonalTasks,
    },
    Wellness: {
      title: 'Wellness',
      tasks: wellnessTasks,
      setTasks: setWellnessTasks,
    },
  };

return (
  <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Canva Sans, sans-serif' }}>
    {/* Smaller Title */}
    <div style={{
      fontSize: 24,
      fontWeight: 700,
      color: '#222',
      marginBottom: 16,
      marginTop: 32,
      textAlign: 'left',
      paddingLeft: 24
    }}>
      To-Do List
    </div>
    {/* Navigation Bar */}
    <div
      style={{
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 340,
        height: 35,
        backgroundColor: '#f5f6f7',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        gap: 30,
        padding: 4,
        marginBottom: 16, // reduced space below nav bar
      }}
    >
      {['Academic', 'Personal', 'Wellness'].map(cat => (
        <button
          key={cat}
          onClick={() => {
            setSelectedCat(cat);
            setShowTimer(false);
            setShowAddTask(false);
            setEditTaskIdx(null);
            setEditTaskData(null);
          }}
          style={{
            border: 'none',
            background: selectedCat === cat ? '#38b6ff' : 'transparent',
            color: selectedCat === cat ? '#fff' : '#939598',
            fontSize: 13,
            borderRadius: selectedCat === cat ? 20 : 14,
            padding: selectedCat === cat ? '6px 18px' : '6px 10px',
            boxShadow: selectedCat === cat ? '0 2px 8px rgba(56,182,255,0.18)' : 'none',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
    {/* Category Page */}
    <ToDoCategoryPage
      {...categoryProps[selectedCat]}
      showTimer={showTimer}
      setShowTimer={setShowTimer}
      showAddTask={showAddTask}
      setShowAddTask={setShowAddTask}
      editTaskIdx={editTaskIdx}
      setEditTaskIdx={setEditTaskIdx}
      editTaskData={editTaskData}
      setEditTaskData={setEditTaskData}
      handleAddTask={task => {
        categoryProps[selectedCat].setTasks([...categoryProps[selectedCat].tasks, task]);
      }}
      handleEditTask={updatedTask => {
        categoryProps[selectedCat].setTasks(
          categoryProps[selectedCat].tasks.map((t, i) =>
            i === editTaskIdx ? updatedTask : t
          )
        );
        setEditTaskIdx(null);
        setEditTaskData(null);
      }}
      focusModeMarginTop={0} // pass this prop to control margin in ToDoCategoryPage
    />
  </div>
);
}