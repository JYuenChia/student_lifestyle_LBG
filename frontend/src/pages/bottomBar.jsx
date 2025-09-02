import { FaRegCommentDots, FaUsers, FaHome, FaBullseye, FaCog } from 'react-icons/fa';

export default function BottomBar() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '84.6px',
        backgroundColor: '#fff',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <FaRegCommentDots size={28} color="#939598" />
      <FaUsers size={28} color="#939598" />
      <FaHome size={28} color="#939598" />
      <FaBullseye size={28} color="#939598" />
      <FaCog size={28} color="#939598" />
    </div>
  );
}