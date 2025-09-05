import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewCommunity() {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [privacy, setPrivacy] = useState('Public');

  const categories = [
    { id: 'study', name: 'Study', icon: '📚' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'social', name: 'Social', icon: '🏠' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮' },
    { id: 'campus', name: 'Campus Life', icon: '🏫' },
    { id: 'others', name: 'Others', icon: '•••' }
  ];

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCreate = () => {
    if (communityName.trim() && description.trim() && selectedCategories.length > 0) {
      // Here you would typically save the community to your backend
      toast("Community created successfully! Welcome to your new community.");
      navigate(-1);
    } else {
      toast("Please fill in all required fields and select at least one category.");
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePhotoSelect = () => {
    // In a real app, this would open a file picker
    setSelectedPhoto('selected');
    toast("Photo selection would be implemented here");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ffffff, #d1e0f4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Modal Container */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Inter, system-ui, sans-serif',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#5DADE2',
          textAlign: 'center',
          marginBottom: '24px',
          margin: '0 0 24px 0'
        }}>
          New Community
        </h2>

        {/* Name Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Name
          </label>
          <input
            type="text"
            placeholder="Type here..."
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Inter, system-ui, sans-serif',
              outline: 'none',
              backgroundColor: '#f8f9fa',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Description
          </label>
          <textarea
            placeholder="Type here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Inter, system-ui, sans-serif',
              resize: 'none',
              outline: 'none',
              backgroundColor: '#f8f9fa',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Photo Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Photo
          </label>
          <button
            onClick={handlePhotoSelect}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              backgroundColor: '#f8f9fa',
              color: selectedPhoto ? '#333' : '#999',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '16px' }}>📷</span>
            {selectedPhoto ? 'Photo selected' : 'Select Your Photo'}
          </button>
        </div>

        {/* Categories Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '12px'
          }}>
            Categories
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 8px',
                  border: selectedCategories.includes(category.id) 
                    ? '2px solid #5DADE2' 
                    : '1px solid #e0e0e0',
                  borderRadius: '12px',
                  backgroundColor: selectedCategories.includes(category.id) 
                    ? '#f0f9ff' 
                    : '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '70px',
                  fontSize: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                <span style={{ fontSize: '24px', marginBottom: '4px' }}>
                  {category.icon}
                </span>
                <span style={{ 
                  color: selectedCategories.includes(category.id) ? '#5DADE2' : '#666',
                  fontWeight: selectedCategories.includes(category.id) ? '600' : '400'
                }}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Field */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            Privacy
          </label>
          <Select value={privacy} onValueChange={setPrivacy}>
            <SelectTrigger style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer'
            }}>
              <SelectValue placeholder="Select privacy setting" />
            </SelectTrigger>
            <SelectContent className="custom-select-content">
                <SelectItem value="Public" className="custom-select-item">Public</SelectItem>
                <SelectItem value="Private" className="custom-select-item">Private</SelectItem>
                </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              borderRadius: '25px',
              backgroundColor: '#e0e0e0',
              color: '#666',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              borderRadius: '25px',
              backgroundColor: '#5DADE2',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Create
            <span style={{ fontSize: '14px' }}>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
