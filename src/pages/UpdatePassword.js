import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function UpdatePassword() {
  let { user } = useContext(UserContext); 
  let [oldPassword, setOldPassword] = useState('');
  let [newPassword, setNewPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [errorMessage, setErrorMessage] = useState('');
  let [successMessage, setSuccessMessage] = useState('');
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; 

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Redirect after success
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setErrorMessage(data.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Update password error:', error);
      setErrorMessage(error.message || 'An error occurred while updating the password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="profile-page mt-5 col-6">
      <h1 className="text-center">Update Your Password</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="oldPassword" className='mb-3'>
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="newPassword" className='mb-3'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className='mb-3'>
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Button variant="primary" type="submit" disabled={isLoading} className="w-100 mt-3">
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Update Password'}
        </Button>
      </Form>
    </Container>
  );
}
