import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, addUser, updateUser, deleteUser } from '../../services/api';
import { useForm } from 'react-hook-form';
import AdminNavbar from '../../components/AdminNavbar';

function UserManagement() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
  
  // Form for adding/editing users
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // Open modal for adding new user
  const openAddModal = () => {
    setModalMode('add');
    reset({ email: '', firstName: '', lastName: '', active: true });
    setIsModalOpen(true);
  };
  
  // Open modal for editing a user
  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUser(user);
    reset({ 
      email: user.email, 
      firstName: user.first_name, 
      lastName: user.last_name, 
      active: user.active 
    });
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (modalMode === 'add') {
        await addUser(data);
      } else {
        await updateUser(editingUser.id, data);
      }
      
      // Refresh user list and close modal
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data || 'Failed to save user');
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(id);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data || 'Failed to delete user');
    }
  };
  
  // Toggle user active status
  const toggleUserStatus = async (user) => {
    try {
      await updateUser(user.id, { active: !user.active });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(error.response?.data || 'Failed to update user status');
    }
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      
      <div className="admin-content">
        <header className="admin-page-header">
          <h1 className="admin-page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            User Management
          </h1>
          <p className="admin-page-description">
            Manage staff accounts for The Joshua Center admin portal. Add, edit or deactivate users who can access the system.
          </p>
        </header>
        
        <div className="admin-header-actions">
          <button onClick={openAddModal} className="button primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New User
          </button>
        </div>
        
        {isLoading ? (
          <div className="data-table-wrapper" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
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
                <div className="alert-title">No Users Found</div>
                <p>No users have been added yet. Click the "Add New User" button to get started.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <div className="data-table-header">
              <h3 className="data-table-title">Staff Users</h3>
              <div className="data-table-actions">
                <span>{users.length} total users</span>
              </div>
            </div>
            
            <div className="user-management-table-container">
              <div className="user-management-table">
                <div className="user-table-header">
                  <div className="user-table-cell name-cell">Name</div>
                  <div className="user-table-cell email-cell">Email</div>
                  <div className="user-table-cell status-cell">Status</div>
                  <div className="user-table-cell actions-cell">Actions</div>
                </div>
                
                {users.map(user => (
                  <div className="user-table-row" key={user.id}>
                    <div className="user-table-cell name-cell">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="user-table-cell email-cell" title={user.email}>
                      {user.email}
                    </div>
                    <div className="user-table-cell status-cell">
                      <button 
                        onClick={() => toggleUserStatus(user)} 
                        className={`status-toggle ${user.active ? 'status-active' : 'status-inactive'}`}
                        title={user.active ? 'Click to Deactivate User' : 'Click to Activate User'}
                      >
                        <span className="status-icon">{user.active ? '✓' : '⦻'}</span>
                        <span className="status-text">{user.active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>
                    <div className="user-table-cell actions-cell">
                      <div className="user-actions">
                        <button 
                          onClick={() => openEditModal(user)} 
                          className="user-action-button edit"
                          title="Edit User"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          className="user-action-button delete"
                          title="Delete User"
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
        
        {/* Modal for adding/editing users */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h3>
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
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      disabled={modalMode === 'edit'}
                      className={errors.email ? "input-error" : ""}
                      style={{ opacity: modalMode === 'edit' ? 0.7 : 1 }}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    {errors.email && <div className="error-message">{errors.email.message}</div>}
                  </div>
                </div>
                
                <div className="form-section grid-2">
                  <div className="form-field">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      className={errors.firstName ? "input-error" : ""}
                      {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName.message}</div>}
                  </div>
                  
                  <div className="form-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      className={errors.lastName ? "input-error" : ""}
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName.message}</div>}
                  </div>
                </div>
                
                {modalMode === 'edit' && (
                  <div className="form-section checkbox-section">
                    <div className="form-field checkbox">
                      <label>
                        <input 
                          type="checkbox" 
                          id="active" 
                          {...register('active')}
                        />
                        <span>Active Account</span>
                      </label>
                      <div className="checkbox-helper-text">When inactive, the user cannot log in to the system</div>
                    </div>
                  </div>
                )}
                
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
                    {modalMode === 'add' ? 'Add User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <style jsx="true">{`
          /* New User Management Table Styles */
          .user-management-table-container {
            background-color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            margin-bottom: var(--space-4);
            width: 100%;
          }
          
          .user-management-table {
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          
          .user-table-header {
            display: flex;
            background-color: var(--gray-50);
            font-weight: 600;
            border-bottom: 2px solid var(--gray-200);
          }
          
          .user-table-row {
            display: flex;
            border-bottom: 1px solid var(--gray-100);
            transition: background-color 0.2s ease;
          }
          
          .user-table-row:last-child {
            border-bottom: none;
          }
          
          .user-table-row:hover {
            background-color: var(--gray-50);
          }
          
          .user-table-cell {
            padding: var(--space-4);
            display: flex;
            align-items: center;
          }
          
          .name-cell {
            flex: 0 0 25%;
            word-break: break-all;
            overflow-wrap: break-word;
            padding-right: var(--space-2);
          }
          
          .email-cell {
            flex: 0 0 30%;
            word-break: break-all;
            overflow-wrap: break-word;
            white-space: normal;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .status-cell {
            flex: 0 0 20%;
            justify-content: center;
            min-width: 100px;
          }
          
          .actions-cell {
            flex: 0 0 25%;
            justify-content: flex-start;
            padding-top: var(--space-2);
            padding-bottom: var(--space-2);
            padding-left: 0;
          }
          
          .status-toggle {
            display: inline-flex;
            align-items: center;
            gap: var(--space-1);
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-full);
            font-size: var(--font-size-xs);
            font-weight: 600;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all var(--transition-fast);
            white-space: nowrap;
          }
          
          .status-icon {
            font-size: 13px;
          }
          
          .status-toggle.status-active {
            background-color: rgba(16, 185, 129, 0.1);
            border-color: rgba(16, 185, 129, 0.3);
            color: rgb(16, 185, 129);
          }
          
          .status-toggle.status-inactive {
            background-color: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: var(--danger);
          }
          
          .status-toggle:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-sm);
            border-color: currentColor;
          }
          
          .user-actions {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: var(--space-2);
          }
          
          .user-action-button {
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
          
          
          .user-action-button:hover {
            background-color: var(--gray-100);
            transform: translateY(-1px);
            box-shadow: var(--shadow-sm);
          }
          
          .user-action-button.edit {
            border-color: var(--primary);
            color: var(--primary);
          }
          
          .user-action-button.edit:hover {
            background-color: var(--primary-focus);
          }
          
          .user-action-button.delete {
            border-color: var(--danger);
            color: var(--danger);
          }
          
          .user-action-button.delete:hover {
            background-color: rgba(239, 68, 68, 0.1);
          }
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
          
          .email-column {
            width: 45%;
            min-width: 400px;
          }
          
          .name-column {
            width: 20%;
            padding-left: 30px !important;
          }
          
          .status-column {
            width: 15%;
            text-align: center;
          }
          
          .status-container {
            display: flex;
            justify-content: center;
            width: 100%;
          }
          
          .actions-column {
            width: 15%;
            text-align: center;
          }
          
          .user-email {
            display: flex;
            align-items: center;
          }
          
          .email-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            max-width: 100%;
          }
          
          /* Apply tooltip styles only when email is long enough to be truncated */
          .email-text.truncated {
            cursor: help;
            text-decoration: underline dotted;
            text-decoration-color: #aaa;
            text-underline-offset: 3px;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-2);
            padding: var(--space-1) var(--space-3);
            border-radius: var(--radius-full);
            font-size: var(--font-size-xs);
            font-weight: 600;
            margin: 0 auto;
            text-transform: capitalize;
          }
          
          .status-badge::before {
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: currentColor;
          }
          
          .status-active {
            background-color: rgba(16, 185, 129, 0.1);
            color: rgb(16, 185, 129);
          }
          
          .status-inactive {
            background-color: var(--gray-100);
            color: var(--gray-600);
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
          
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-6);
            align-items: start;
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
          
          .form-field input[type="text"],
          .form-field input[type="email"] {
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
          
          .checkbox-section {
            background-color: var(--gray-50);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            border: 1px solid var(--gray-200);
          }
          
          .checkbox {
            display: flex;
            flex-direction: column;
            padding: 0;
          }
          
          .checkbox label {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            margin-bottom: var(--space-2);
            cursor: pointer;
            font-weight: 500;
            color: var(--gray-700);
          }
          
          .checkbox-helper-text {
            color: var(--gray-600);
            font-size: 0.85rem;
            margin-left: 31px;
          }
          
          .checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: var(--primary);
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

export default UserManagement;