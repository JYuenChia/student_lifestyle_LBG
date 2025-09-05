import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import category icons
import booksIcon from '../../assets/images/books.png';
import wellnessIcon from '../../assets/images/wellness.png';
import sportsIcon from '../../assets/images/sports.png';
import financeIcon from '../../assets/images/finance.png';
import socialIcon from '../../assets/images/social.png';
import entertainmentIcon from '../../assets/images/entertainment.png';
import campusLifeIcon from '../../assets/images/campus-life.png';
import othersIcon from '../../assets/images/others.png';

export default function NewCommunity() {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [privacy, setPrivacy] = useState('Public');

  const categories = [
    { id: 'study', name: 'Study', icon: booksIcon },
    { id: 'wellness', name: 'Health', icon: wellnessIcon },
    { id: 'sports', name: 'Sports', icon: sportsIcon },
    { id: 'finance', name: 'Finance', icon: financeIcon },
    { id: 'social', name: 'Social', icon: socialIcon },
    { id: 'entertainment', name: 'Fun', icon: entertainmentIcon },
    { id: 'campus', name: 'College', icon: campusLifeIcon },
    { id: 'others', name: 'Others', icon: othersIcon }
  ];

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCreate = () => {
    if (communityName.trim() && description.trim() && selectedCategories.length > 0) {
      // Create the community object
      const newCommunity = {
        name: communityName.trim(),
        description: description.trim(),
        categories: selectedCategories,
        privacy: privacy,
        photo: selectedPhoto
      };
      
      // Store the new community data in localStorage temporarily
      localStorage.setItem('newCommunity', JSON.stringify(newCommunity));
      localStorage.setItem('navigateToCommunitiesTab', 'true');
      
      toast("Community created successfully! Welcome to your new community.");
      
      // Navigate back to previous page
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

  const handlePhotoSelect = (files) => {
    if (files && files.length > 0) {
      setSelectedPhoto(files[0]);
      toast(`Photo "${files[0].name}" selected successfully!`);
    }
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
              fontSize: '14px',
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
              fontSize: '14px',
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoSelect(e.target.files)}
            style={{ display: 'none' }}
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              backgroundColor: '#f8f9fa',
              color: selectedPhoto ? '#333' : '#999',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxSizing: 'border-box'
            }}
          >
            {selectedPhoto ? `Selected: ${selectedPhoto.name}` : 'Select Your Photo'}
          </label>
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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '5px'
          }}>
            {categories.map((category) => (
              <Toggle
                key={category.id}
                pressed={selectedCategories.includes(category.id)}
                onPressedChange={() => toggleCategory(category.id)}
                aria-label={`Toggle ${category.name}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 8px',
                  border: 'none',
                  borderRadius: '0',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '80px',
                  fontSize: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  width: '100%',
                  height: 'auto'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: selectedCategories.includes(category.id) ? '#5DADE2' : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  transition: 'all 0.2s ease'
                }}>
                  <img 
                    src={category.icon} 
                    alt={category.name}
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain',
                      filter: selectedCategories.includes(category.id) ? 'brightness(0) invert(1)' : 'none'
                    }}
                  />
                </div>
                <span style={{ 
                  color: selectedCategories.includes(category.id) ? '#5DADE2' : '#374151',
                  fontWeight: selectedCategories.includes(category.id) ? '600' : '500',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  fontSize: '12px'
                }}>
                  {category.name}
                </span>
              </Toggle>
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
