import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLocations } from '../../services/api';
import { useForm } from 'react-hook-form';
import AdminNavbar from '../../components/AdminNavbar';
import axios from 'axios';

function LocationManagement() {
  const queryClient = useQueryClient();
  const [editingLocation, setEditingLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  // Fetch locations
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations
  });
  
  // Form for adding/editing locations
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // Open modal for adding new location
  const openAddModal = () => {
    setModalMode('add');
    reset({ name: '' });
    setIsModalOpen(true);
  };
  
  // Open modal for editing a location
  const openEditModal = (location) => {
    setModalMode('edit');
    setEditingLocation(location);
    reset({ name: location.name });
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:3001/api/locations', data);
      } else {
        await axios.put(`http://localhost:3001/api/locations/${editingLocation.id}`, data);
      }
      
      // Refresh location list and close modal
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
      alert(error.response?.data || 'Failed to save location');
    }
  };
  
  // Handle location deletion
  const handleDeleteLocation = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/locations/${id}`);
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    } catch (error) {
      console.error('Error deleting location:', error);
      alert(error.response?.data || 'Failed to delete location');
    }
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      
      <div className="admin-content">
        <header className="admin-page-header">
          <h1 className="admin-page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Location Management
          </h1>
          <p className="admin-page-description">
            Manage the office locations for The Joshua Center. Staff can be assigned to these locations.
          </p>
        </header>
        
        <div className="admin-header-actions">
          <button onClick={openAddModal} className="button primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Location
          </button>
        </div>
        
        {isLoading ? (
          <div className="data-table-wrapper" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading locations...</p>
            </div>
          </div>
        ) : locations.length === 0 ? (
          <div className="data-table-wrapper" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="alert info">
              <div className="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div className="alert-content">
                <div className="alert-title">No Locations Found</div>
                <p>No locations have been added yet. Click the "Add New Location" button to get started.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <div className="data-table-header">
              <h3 className="data-table-title">Office Locations</h3>
              <div className="data-table-actions">
                <span>{locations.length} total locations</span>
              </div>
            </div>
            
            <div className="location-management-table-container">
              <div className="location-management-table">
                <div className="location-table-header">
                  <div className="location-table-cell name-cell">Location Name</div>
                  <div className="location-table-cell actions-cell">Actions</div>
                </div>
                
                {locations.map(location => (
                  <div className="location-table-row" key={location.id}>
                    <div className="location-table-cell name-cell">
                      <div className="location-name">
                        <span>{location.name}</span>
                      </div>
                    </div>
                    <div className="location-table-cell actions-cell">
                      <div className="location-actions">
                        <button 
                          onClick={() => openEditModal(location)} 
                          className="location-action-button edit"
                          title="Edit Location"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteLocation(location.id)} 
                          className="location-action-button delete"
                          title="Delete Location"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Modal for adding/editing locations */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{modalMode === 'add' ? 'Add New Location' : 'Edit Location'}</h3>
                <button 
                  className="modal-close" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                <div className="form-section">
                  <div className="form-field">
                    <label htmlFor="name">Location Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Example: Main Office"
                      className={errors.name ? "input-error" : ""}
                      {...register('name', { required: 'Location name is required' })}
                    />
                    {errors.name && <div className="error-message">{errors.name.message}</div>}
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="button secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button primary">
                    {modalMode === 'add' ? 'Add Location' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <style jsx="true">{`
          .admin-header-actions {
            margin-bottom: var(--space-6);
            display: flex;
            justify-content: flex-end;
          }
          
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            gap: var(--space-4);
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--gray-200);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .alert {
            display: flex;
            gap: var(--space-4);
            padding: var(--space-6);
            border-radius: var(--radius-lg);
            background-color: rgba(96, 165, 250, 0.1);
          }
          
          .alert-icon {
            color: var(--primary);
          }
          
          .alert-title {
            font-weight: 600;
            margin-bottom: var(--space-2);
          }
          
          /* New Location Management Table Styles */
          .location-management-table-container {
            background-color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            margin-bottom: var(--space-4);
            width: 100%;
          }
          
          .location-management-table {
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          
          .location-table-header {
            display: flex;
            background-color: var(--gray-50);
            font-weight: 600;
            border-bottom: 2px solid var(--gray-200);
          }
          
          .location-table-row {
            display: flex;
            border-bottom: 1px solid var(--gray-100);
            transition: background-color 0.2s ease;
          }
          
          .location-table-row:last-child {
            border-bottom: none;
          }
          
          .location-table-row:hover {
            background-color: var(--gray-50);
          }
          
          .location-table-cell {
            padding: var(--space-4);
            display: flex;
            align-items: center;
          }
          
          .name-cell {
            flex: 0 0 75%;
            word-break: break-all;
            overflow-wrap: break-word;
          }
          
          .actions-cell {
            flex: 0 0 25%;
            justify-content: flex-start;
            padding-top: var(--space-2);
            padding-bottom: var(--space-2);
          }
          
          .location-name {
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 0.95rem;
            color: var(--gray-800);
          }
          
          .location-actions {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: var(--space-2);
          }
          
          .location-action-button {
            display: inline-block;
            padding: var(--space-1) var(--space-2);
            min-width: 50px;
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-300);
            background-color: white;
            color: var(--gray-700);
            font-size: 11px;
            font-weight: 500;
            text-align: center;
            cursor: pointer;
            transition: all var(--transition-fast);
            margin: 0 2px;
            white-space: nowrap;
          }
          
          .location-action-button:hover {
            background-color: var(--gray-100);
            transform: translateY(-1px);
            box-shadow: var(--shadow-sm);
          }
          
          .location-action-button.edit {
            border-color: var(--primary);
            color: var(--primary);
          }
          
          .location-action-button.edit:hover {
            background-color: var(--primary-focus);
          }
          
          .location-action-button.delete {
            border-color: var(--danger);
            color: var(--danger);
          }
          
          .location-action-button.delete:hover {
            background-color: rgba(239, 68, 68, 0.1);
          }
          
          /* Modal styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: var(--space-4);
            box-sizing: border-box;
          }
          
          .modal {
            background-color: white;
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl);
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalFadeIn 0.3s;
            box-sizing: border-box;
            margin: 0 auto;
            z-index: 10001;
            pointer-events: auto;
            padding-bottom: var(--space-4);
          }
          
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--space-6);
            border-bottom: 1px solid var(--gray-200);
            margin-bottom: var(--space-2);
          }
          
          .modal-title {
            margin: 0;
            font-size: var(--font-size-xl);
            font-weight: 600;
            color: var(--gray-900);
          }
          
          .modal-close {
            background: transparent;
            border: none;
            padding: var(--space-2);
            cursor: pointer;
            color: var(--gray-500);
            transition: color var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .modal-close:hover {
            color: var(--gray-700);
          }
          
          .modal-form {
            padding: var(--space-6);
            pointer-events: auto;
            display: flex;
            flex-direction: column;
          }
          
          .form-section {
            margin-bottom: var(--space-6);
            position: relative;
          }
          
          .form-section:after {
            content: '';
            display: block;
            clear: both;
          }
          
          .form-field {
            margin-bottom: var(--space-4);
            box-sizing: border-box;
            width: 100%;
            position: relative;
          }
          
          .form-field:last-child {
            margin-bottom: 0;
          }
          
          .form-field label {
            display: block;
            margin-bottom: var(--space-3);
            font-weight: 500;
            color: var(--gray-700);
            font-size: 0.9rem;
          }
          
          .form-field input[type="text"] {
            width: 100%;
            height: 42px;
            padding: 0 var(--space-4);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-300);
            transition: all var(--transition-fast);
            box-sizing: border-box;
            font-size: 0.95rem;
            background-color: white;
          }
          
          .form-field input:focus {
            border-color: var(--primary);
            outline: none;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          }
          
          .input-error {
            border-color: var(--danger) !important;
          }
          
          .error-message {
            color: var(--danger);
            font-size: var(--font-size-sm);
            margin-top: var(--space-2);
            position: absolute;
          }
          
          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: var(--space-4);
            padding: var(--space-6);
            padding-top: var(--space-4);
            border-top: 1px solid var(--gray-200);
            margin-top: var(--space-6);
          }
          
          .modal-footer button {
            min-width: 100px;
            height: 38px;
            font-weight: 500;
          }
        `}</style>
      </div>
    </div>
  );
}

export default LocationManagement;