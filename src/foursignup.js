import React, { useState } from 'react';
import './foursignup.css'; 

const FourSignupPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="signup-container">
      <h1 className="title">Signup Page</h1>
      <div className="role-selection">
        <div className={`role-option ${selectedRole === 'TA' ? 'selected' : ''}`} onClick={() => handleRoleSelection('TA')}>
          Signup as TA Applicant
        </div>
        <div className={`role-option ${selectedRole === 'Administrator' ? 'selected' : ''}`} onClick={() => handleRoleSelection('Administrator')}>
          Signup as Administrator
        </div>
        <div className={`role-option ${selectedRole === 'CommitteeMember' ? 'selected' : ''}`} onClick={() => handleRoleSelection('CommitteeMember')}>
          Signup as Committee Member
        </div>
        <div className={`role-option ${selectedRole === 'Instructor' ? 'selected' : ''}`} onClick={() => handleRoleSelection('Instructor')}>
          Signup as Instructor
        </div>
      </div>
      {selectedRole && (
        <div className="signup-form">
          <h2 className="form-title">Signup Form for {selectedRole}</h2>
          {/* Add form fields for signup */}
        </div>
      )}
    </div>
  );
};

export default FourSignupPage;
