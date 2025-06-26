import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    adminService.getAllUsers().then(response => {
      setUsers(response.data);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    adminService.updateUserRole(userId, newRole).then(() => {
      fetchUsers();
    });
  };

  const handleDeleteUser = (userId) => {
    adminService.deleteUser(userId).then(() => {
      fetchUsers();
    });
  };

  return (
    <div>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList; 