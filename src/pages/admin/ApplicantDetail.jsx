import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApplicant, getUsers, updateApplicant } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';

function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusUpdate, setStatusUpdate] = useState('');
  const [assigneeUpdate, setAssigneeUpdate] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  
  // Fetch applicant details and users
  const { data: applicant, isLoading: isLoadingApplicant } = useQuery({
    queryKey: ['applicant', id],
    queryFn: () => getApplicant(id)
  });
  
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
  
  // Initialize form values when data is loaded
  useEffect(() => {
    if (applicant) {
      setStatusUpdate(applicant.application_status);
      setAssigneeUpdate(applicant.assigned_employee_id || '');
    }
  }, [applicant]);
  
  // Handle status and assignment update
  const handleUpdate = async () => {
    try {
      await updateApplicant(id, {
        status: statusUpdate, 
        employeeId: assigneeUpdate || null
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['applicant', id] });
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
      
      alert('Application updated successfully');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    }
  };
  
  if (isLoadingApplicant) {
    return (
      <div className="admin-layout">
        <AdminNavbar />
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading applicant details...</p>
          </div>
          
          <style jsx="true">{`
            .loading-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 50vh;
              gap: var(--space-4);
            }
            
            .loading-spinner {
              width: 40px;
              height: 40px;
              border: 4px solid var(--gray-700);
              border-top: 4px solid var(--primary);
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }
  
  if (!applicant) {
    return (
      <div className="admin-layout">
        <AdminNavbar />
        <div className="admin-content">
          <div className="error-container">
            <div className="error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2>Applicant Not Found</h2>
            <p>The applicant you're looking for does not exist or has been removed.</p>
            <button onClick={() => navigate('/admin/applicants')} className="button primary">
              Back to Applicant List
            </button>
          </div>
          
          <style jsx="true">{`
            .error-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 50vh;
              gap: var(--space-4);
              text-align: center;
              max-width: 400px;
              margin: 0 auto;
            }
            
            .error-icon {
              color: var(--warning);
              margin-bottom: var(--space-4);
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      
      <div className="admin-content">
        <header className="admin-page-header">
          <h1 className="admin-page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            Applicant Details
          </h1>
          <p className="admin-page-description">
            Reviewing application for {applicant.name}
          </p>
        </header>
        
        <div className="data-table-wrapper">
          <div className="applicant-header">
            <div className="applicant-title">
              <div className="applicant-avatar large">
                {applicant.name?.charAt(0) || '?'}
              </div>
              <div>
                <h2 style={{ color: 'var(--gray-100)' }}>{applicant.name}</h2>
                <div className="applicant-contact">
                  <div><strong>Email:</strong> {applicant.email}</div>
                  <div><strong>Phone:</strong> {applicant.phone}</div>
                </div>
              </div>
            </div>
            
            <div className="application-status-card">
              <h3>Application Status</h3>
              <div className="status-form">
                <div className="form-field">
                  <label htmlFor="status-update">Status</label>
                  <select 
                    id="status-update" 
                    value={statusUpdate} 
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className={`status-select-${statusUpdate?.replace(' ', '-') || 'not-viewed'}`}
                  >
                    <option value="not viewed">Not Viewed</option>
                    <option value="in review">In Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="form-field">
                  <label htmlFor="assignee-update">Assigned To</label>
                  <select 
                    id="assignee-update" 
                    value={assigneeUpdate} 
                    onChange={(e) => setAssigneeUpdate(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-actions">
                  <button onClick={handleUpdate} className="button primary">Update Status</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="applicant-details-container">
            <div className="applicant-details-tabs">
              <button 
                className={`detail-tab ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                Personal Info
              </button>
              <button 
                className={`detail-tab ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Education
              </button>
              <button 
                className={`detail-tab ${activeTab === 'employment' ? 'active' : ''}`}
                onClick={() => setActiveTab('employment')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Employment
              </button>
              <button 
                className={`detail-tab ${activeTab === 'resume' ? 'active' : ''}`}
                onClick={() => setActiveTab('resume')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Resume
              </button>
            </div>
            
            <div className="applicant-details-content">
              {activeTab === 'personal' && (
                <div className="applicant-details-section">
                  <div className="detail-card">
                    <h3 className="detail-card-title">Contact Information</h3>
                    <div className="detail-card-content">
                      <p><strong>Address:</strong> {applicant.address}, {applicant.city}, {applicant.state} {applicant.zip}</p>
                      <p><strong>US Citizen/Work Authorized:</strong> {applicant.us_citizen ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">Demographics</h3>
                    <div className="detail-card-content">
                      <p><strong>Languages:</strong> {applicant.languages}</p>
                      <p><strong>Gender:</strong> {applicant.gender}</p>
                      <p><strong>Race/Ethnicity:</strong> {applicant.race_ethnicity}</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">Qualification Flags</h3>
                    <div className="detail-card-content">
                      <p>
                        <strong>Felony Conviction:</strong> 
                        <span className={applicant.felony_conviction ? 'flag warning' : 'flag success'}>
                          {applicant.felony_conviction ? 'Yes' : 'No'}
                        </span>
                        
                        {applicant.felony_conviction && applicant.felony_explanation && (
                          <div className="explanation-box">
                            <p>Explanation: {applicant.felony_explanation}</p>
                          </div>
                        )}
                      </p>
                      <p>
                        <strong>Dual Relationships:</strong> 
                        <span className={applicant.dual_relationships === 'yes' ? 'flag warning' : 
                                        applicant.dual_relationships === 'unsure' ? 'flag caution' : 'flag success'}>
                          {applicant.dual_relationships}
                        </span>
                        
                        {(applicant.dual_relationships === 'yes' || applicant.dual_relationships === 'unsure') && 
                          applicant.dual_relationships_explanation && (
                          <div className="explanation-box">
                            <p>Explanation: {applicant.dual_relationships_explanation}</p>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">Locations Applied For</h3>
                    <div className="detail-card-content">
                      <ul className="tag-list">
                        {applicant.locations?.map(location => (
                          <li key={location.id} className="location-tag">{location.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">Populations Interested In</h3>
                    <div className="detail-card-content">
                      <ul className="tag-list">
                        {applicant.populations?.map((population, index) => (
                          <li key={index} className="population-tag">{population}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">References</h3>
                    <div className="detail-card-content">
                      <div className="references-list">
                        {applicant.references?.map(ref => (
                          <div key={ref.id} className="reference-card">
                            <h4>{ref.name}</h4>
                            <p className="reference-type">{ref.type}</p>
                            <p><strong>Relationship:</strong> {ref.relationship}</p>
                            <p><strong>Email:</strong> {ref.email}</p>
                            <p><strong>Phone:</strong> {ref.phone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'education' && (
                <div className="applicant-details-section">
                  <div className="detail-card">
                    <h3 className="detail-card-title">Education & Credentials</h3>
                    <div className="detail-card-content">
                      <pre className="education-content">{applicant.education}</pre>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">Professional Interests</h3>
                    <div className="detail-card-content">
                      <p>{applicant.interests}</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">Why the Joshua Center?</h3>
                    <div className="detail-card-content">
                      <p>{applicant.why_joshua_center}</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <h3 className="detail-card-title">Ethical Framework Thoughts</h3>
                    <div className="detail-card-content">
                      <p>{applicant.ethical_framework_thoughts}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'employment' && (
                <div className="applicant-details-section">
                  <div className="detail-card">
                    <h3 className="detail-card-title">Employment History</h3>
                    <div className="detail-card-content">
                      <div className="employment-card">
                        <h4>{applicant.previous_employer}</h4>
                        <p><strong>Title:</strong> {applicant.previous_employer_title}</p>
                        <p><strong>Duration:</strong> {applicant.previous_employer_length}</p>
                        <p><strong>Reason for Leaving:</strong> {applicant.previous_employer_reason_leaving}</p>
                      </div>
                      
                      {applicant.other_employment && (
                        <div className="employment-card">
                          <h4>Other Employment</h4>
                          <p>{applicant.other_employment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'resume' && (
                <div className="applicant-details-section">
                  <div className="detail-card">
                    <h3 className="detail-card-title">Resume</h3>
                    <div className="detail-card-content resume-container">
                      {applicant.resume_path && (
                        <a href={`${import.meta.env.VITE_API_URL || ''}${applicant.resume_path}`} target="_blank" rel="noopener noreferrer" className="resume-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                          View Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="back-button-container">
            <button className="button outline" onClick={() => navigate('/admin/applicants')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to List
            </button>
          </div>
        </div>
        
        <style jsx="true">{`
          .applicant-header {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-6);
            padding: var(--space-6);
            border-bottom: 1px solid var(--gray-700);
            max-width: 1100px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
          }
          
          .applicant-title {
            flex: 1;
            min-width: 300px;
            display: flex;
            gap: var(--space-4);
            align-items: center;
          }
          
          .applicant-avatar.large {
            width: 64px;
            height: 64px;
            font-size: var(--font-size-xl);
          }
          
          .applicant-contact {
            margin-top: var(--space-2);
            color: var(--gray-300);
          }
          
          .application-status-card {
            flex: 1;
            min-width: 300px;
            background-color: var(--gray-800);
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            border: 1px solid var(--gray-700);
            box-shadow: var(--shadow-sm);
          }
          
          .application-status-card h3 {
            color: var(--gray-100);
            margin-top: 0;
          }
          
          .status-form {
            display: flex;
            flex-direction: column;
            gap: var(--space-4);
          }
          
          .form-actions {
            margin-top: var(--space-2);
          }
          
          .status-form select {
            background-color: var(--gray-800);
            color: var(--gray-100);
            border: 1px solid var(--gray-600);
            border-radius: var(--radius-md);
            padding: var(--space-2) var(--space-3);
            width: 100%;
            appearance: revert; /* Override any global appearance settings */
          }
          
          .status-form select:focus {
            border-color: var(--primary);
            outline: none;
            box-shadow: 0 0 0 2px var(--primary-focus);
          }
          
          .status-form select option {
            background-color: var(--gray-800);
            color: var(--gray-100);
          }
          
          /* New layout styles */
          .applicant-details-container {
            max-width: 1100px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
          }
          
          .applicant-details-tabs {
            display: flex;
            gap: var(--space-2);
            border-bottom: 1px solid var(--gray-700);
            padding: 0 var(--space-6);
          }
          
          .detail-tab {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-3) var(--space-4);
            background: transparent;
            border: none;
            font-weight: 500;
            color: var(--gray-400);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all var(--transition-fast);
          }
          
          .detail-tab.active {
            color: var(--primary);
            border-bottom: 2px solid var(--primary);
          }
          
          .detail-tab:hover {
            color: var(--primary);
          }
          
          .applicant-details-content {
            padding: var(--space-6);
          }
          
          .applicant-details-section {
            display: flex;
            flex-direction: column;
            gap: var(--space-4);
          }
          
          .detail-card {
            background-color: var(--gray-800);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            overflow: hidden;
            width: 100%;
            border: 1px solid var(--gray-700);
          }
          
          .detail-card.flex-1 {
            flex: 1;
          }
          
          .detail-card-title {
            background-color: var(--gray-700);
            padding: var(--space-3) var(--space-4);
            margin: 0;
            font-size: var(--font-size-base);
            font-weight: 600;
            border-bottom: 1px solid var(--gray-600);
            color: var(--gray-100);
          }
          
          .detail-card-content {
            padding: var(--space-4);
            color: var(--gray-300);
          }
          
          .detail-card-content strong {
            color: var(--gray-100);
          }
          
          .resume-container {
            display: flex;
            justify-content: center;
            padding: var(--space-8);
          }
          
          .detail-card-content p:first-child {
            margin-top: 0;
          }
          
          .detail-card-content p:last-child {
            margin-bottom: 0;
          }
          
          .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-2);
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .location-tag, .population-tag {
            background-color: var(--primary-focus);
            color: var(--primary);
            font-size: var(--font-size-sm);
            font-weight: 500;
            padding: var(--space-1) var(--space-3);
            border-radius: var(--radius-full);
          }
          
          .population-tag {
            background-color: rgba(16, 185, 129, 0.1);
            color: rgb(16, 185, 129);
          }
          
          .flag {
            display: inline-block;
            margin-left: var(--space-2);
            font-size: var(--font-size-sm);
            font-weight: 600;
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-md);
          }
          
          .flag.success {
            background-color: rgba(16, 185, 129, 0.1);
            color: rgb(16, 185, 129);
          }
          
          .flag.warning {
            background-color: rgba(245, 158, 11, 0.1);
            color: rgb(245, 158, 11);
          }
          
          .flag.caution {
            background-color: rgba(231, 70, 70, 0.1);
            color: rgb(231, 70, 70);
          }
          
          .explanation-box {
            background-color: var(--gray-700);
            border-radius: var(--radius-md);
            padding: var(--space-3);
            margin-top: var(--space-2);
            font-size: var(--font-size-sm);
            border: 1px solid var(--gray-600);
          }
          
          .explanation-box p {
            color: var(--gray-300);
            margin: 0;
          }
          
          .education-content {
            white-space: pre-wrap;
            font-family: var(--font-sans);
            font-size: var(--font-size-sm);
            background: none;
            padding: 0;
            margin: 0;
            color: var(--gray-300);
          }
          
          .employment-card {
            margin-bottom: var(--space-4);
            padding-bottom: var(--space-4);
            border-bottom: 1px solid var(--gray-600);
          }
          
          .employment-card:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }
          
          .employment-card h4 {
            margin-top: 0;
            margin-bottom: var(--space-2);
            color: var(--gray-100);
          }
          
          .references-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-4);
          }
          
          .reference-card {
            background-color: var(--gray-700);
            padding: var(--space-4);
            border-radius: var(--radius-md);
            border: 1px solid var(--gray-600);
          }
          
          .reference-card h4 {
            margin-top: 0;
            margin-bottom: var(--space-1);
            color: var(--gray-100);
          }
          
          .reference-type {
            font-size: var(--font-size-sm);
            color: var(--primary);
            margin-bottom: var(--space-3);
          }
          
          .resume-link {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-2) var(--space-4);
            background-color: var(--primary-focus);
            color: var(--primary);
            border-radius: var(--radius-md);
            font-weight: 500;
            text-decoration: none;
            transition: all var(--transition-fast);
          }
          
          .resume-link:hover {
            background-color: rgba(96, 165, 250, 0.2);
          }
          
          .status-select-not-viewed {
            border-left: 4px solid var(--gray-400);
          }
          
          .status-select-in-review {
            border-left: 4px solid var(--primary);
          }
          
          .status-select-accepted {
            border-left: 4px solid var(--success);
          }
          
          .status-select-rejected {
            border-left: 4px solid var(--danger);
          }
          
          .back-button-container {
            padding: var(--space-6);
            border-top: 1px solid var(--gray-700);
            max-width: 1100px;
            margin: 0 auto;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            box-sizing: border-box;
          }
          
          @media (max-width: 768px) {
            .applicant-header {
              flex-direction: column;
            }
            
            .applicant-details-tabs {
              overflow-x: auto;
              padding-bottom: var(--space-2);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ApplicantDetail;