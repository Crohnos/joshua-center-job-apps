import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getApplicants, getUsers, updateApplicant } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';

function ApplicantList() {
  const [filter, setFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch applicants and users with error handling
  const { 
    data: applicants = [], 
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ['applicants'],
    queryFn: getApplicants,
    staleTime: 10000,
    retry: 3,
    onError: (err) => console.error("Failed to fetch applicants:", err)
  });
  
  const { 
    data: users = [],
    isError: usersError,
    error: usersErrorDetails 
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 10000,
    retry: 3,
    onError: (err) => console.error("Failed to fetch users:", err)
  });
  
  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicant(id, { status: newStatus });
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };
  
  // Handle assignment change
  const handleAssignmentChange = async (id, employeeId) => {
    try {
      await updateApplicant(id, { 
        status: 'in review', 
        employeeId: employeeId === 'none' ? null : employeeId 
      });
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Failed to update assignment');
    }
  };
  
  // Filter applicants based on status, assigned user, and search term
  const filteredApplicants = applicants.filter(app => {
    const statusMatch = filter === 'all' || app.application_status === filter;
    const userMatch = 
      userFilter === 'all' || 
      (userFilter === 'unassigned' && !app.assigned_employee_id) ||
      String(app.assigned_employee_id) === userFilter;
    
    const searchMatch = !searchTerm || 
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && userMatch && searchMatch;
  });

  // Find user name by ID
  const getUserNameById = (id) => {
    const user = users.find(user => user.id === parseInt(id));
    return user ? `${user.first_name} ${user.last_name}` : 'Unassigned';
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Not Viewed';
    return status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        <header className="admin-page-header">
          <h1 className="admin-page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Applicant Management
          </h1>
          <p className="admin-page-description">
            Manage and track all job applicants for The Joshua Center. View application details, change status, and assign staff members for review.
          </p>
        </header>
        
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className="stat-label">Total Applicants</span>
            <div className="stat-value">
              <span>{applicants.length}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </div>
            <span className="stat-label">Needing Review</span>
            <div className="stat-value">
              <span>
                {applicants.filter(app => app.application_status === 'not viewed').length}
              </span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <span className="stat-label">Accepted</span>
            <div className="stat-value">
              <span>
                {applicants.filter(app => app.application_status === 'accepted').length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="filter-bar">
          <div className="filter-form">
            <div className="filter-field">
              <label htmlFor="search-term">Search</label>
              <div className="input-with-icon">
                <input 
                  type="text" 
                  id="search-term" 
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            
            <div className="filter-field">
              <label htmlFor="status-filter">Status</label>
              <select 
                id="status-filter" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="not viewed">Not Viewed</option>
                <option value="in review">In Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="filter-field">
              <label htmlFor="user-filter">Assigned To</label>
              <select 
                id="user-filter" 
                value={userFilter} 
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">All Staff</option>
                <option value="unassigned">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="data-table-wrapper custom-width" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div aria-busy="true">Loading applications...</div>
          </div>
        ) : isError ? (
          <div className="data-table-wrapper custom-width" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="alert error">
              <div className="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="alert-content">
                <div className="alert-title">Error Loading Data</div>
                <p>
                  {error?.message || "Failed to load applications. Please refresh to try again."}
                  <button 
                    onClick={() => refetch()} 
                    style={{marginLeft: '10px'}}
                    className="button primary small"
                  >
                    Retry
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="data-table-wrapper custom-width" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="alert info">
              <div className="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div className="alert-content">
                <div className="alert-title">No Results Found</div>
                <p>No applications found matching your selected filters.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="data-table-wrapper custom-width">
            <div className="data-table-header">
              <h3 className="data-table-title">Applicants</h3>
              <div className="data-table-actions">
                <button onClick={() => refetch()} className="button secondary small">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div className="applicant-name">
                          <span className="applicant-avatar">
                            {app.name?.charAt(0) || '?'}
                          </span>
                          <span>{app.name}</span>
                        </div>
                      </td>
                      <td>{app.email}</td>
                      <td>
                        <div className="status-select-wrapper">
                          <div className={`status-badge status-${app.application_status?.replace(' ', '-') || 'not-viewed'}`}>
                            {formatStatus(app.application_status)}
                          </div>
                          <select 
                            value={app.application_status || 'not viewed'} 
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="not viewed">Not Viewed</option>
                            <option value="in review">In Review</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <select 
                          value={app.assigned_employee_id || 'none'} 
                          onChange={(e) => handleAssignmentChange(app.id, e.target.value)}
                          className="assignment-select"
                        >
                          <option value="none">Unassigned</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.first_name} {user.last_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/admin/applicants/${app.id}`} className="view-button" title="View Details">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>View</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="data-table-footer">
              <div>Showing {filteredApplicants.length} of {applicants.length} applicants</div>
            </div>
          </div>
        )}
        
        <style jsx="true">{`
          /* Custom width for larger tables */
          .custom-width {
            max-width: 1300px !important;
            width: 100%;
          }
          
          /* Form and filter styles */
          .input-with-icon {
            position: relative;
          }
          
          .input-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-400);
          }
          
          .filter-field {
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
            min-width: 0;
          }
          
          .filter-field label {
            font-weight: 500;
            margin-bottom: var(--space-1);
          }
          
          .filter-field input,
          .filter-field select {
            width: 100%;
            min-width: 0;
          }
          
          /* Table responsive wrapper */
          .table-responsive {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin-bottom: 0;
            border-radius: var(--radius-lg);
          }
          
          /* Custom table styles for applicant list */
          .data-table {
            width: 100%;
            table-layout: auto;
            border-collapse: separate;
            border-spacing: 0;
          }
          
          .data-table th {
            white-space: nowrap;
            padding: var(--space-4) var(--space-4);
            font-weight: 600;
            text-align: left;
            color: var(--gray-100);
            background-color: var(--gray-700);
            border-bottom: 2px solid var(--gray-600);
          }
          
          .data-table td {
            padding: var(--space-4) var(--space-4);
            border-bottom: 1px solid var(--gray-600);
            vertical-align: middle;
            color: var(--gray-300);
            background-color: var(--gray-800);
          }
          
          /* Column widths */
          .data-table th:nth-child(1),
          .data-table td:nth-child(1) {
            width: 22%;
          }
          
          .data-table th:nth-child(2),
          .data-table td:nth-child(2) {
            width: 22%;
          }
          
          .data-table th:nth-child(3),
          .data-table td:nth-child(3) {
            width: 18%;
            text-align: center;
          }
          
          .data-table th:nth-child(4),
          .data-table td:nth-child(4) {
            width: 25%;
            min-width: 220px;
            text-align: center;
          }
          
          .data-table th:nth-child(5),
          .data-table td:nth-child(5) {
            width: 13%;
            text-align: center;
          }
          
          /* Status indicators */
          .status-select-wrapper {
            position: relative;
            width: 100%;
            max-width: 180px;
            box-sizing: border-box;
            margin: 0 auto;
          }
          
          .status-select {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            box-sizing: border-box;
          }
          
          /* Applicant display */
          .applicant-name {
            display: flex;
            align-items: center;
            gap: var(--space-3);
          }
          
          .applicant-avatar {
            width: 32px;
            height: 32px;
            background-color: var(--primary-focus);
            color: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }
          
          /* Assignment select */
          .assignment-select {
            width: 100%;
            max-width: 220px;
            padding: var(--space-2);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-600);
            background-color: var(--gray-800);
            color: var(--gray-100);
            box-sizing: border-box;
            margin: 0 auto;
            display: block;
            font-size: 0.9rem;
          }
          
          .assignment-select option {
            background-color: var(--gray-800);
            color: var(--gray-100);
          }
          
          /* Action buttons */
          .table-actions {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .view-button {
            display: flex;
            align-items: center;
            gap: var(--space-1);
            padding: var(--space-2) var(--space-3);
            background-color: rgba(67, 97, 238, 0.2);
            color: var(--primary);
            border-radius: var(--radius-md);
            font-size: var(--font-size-sm);
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
            text-decoration: none;
            white-space: nowrap;
            box-shadow: var(--shadow-sm);
            border: 1px solid rgba(67, 97, 238, 0.4);
          }
          
          .view-button:hover {
            background-color: rgba(67, 97, 238, 0.3);
            color: var(--primary);
          }
          
          /* Media queries for responsive design */
          @media (max-width: 768px) {
            .filter-form {
              grid-template-columns: 1fr;
              gap: var(--space-4);
            }
            
            .data-table th,
            .data-table td {
              padding: var(--space-2) var(--space-3);
            }
            
            .admin-page-title {
              font-size: var(--font-size-xl);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ApplicantList;