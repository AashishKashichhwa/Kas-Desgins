import React, { useEffect, useState } from 'react';
import {  deleteUser, get } from '../services/ApiEndpoint';
import  { toast } from 'react-hot-toast';
import '../assets/styles/AdminHome.css'; // Import the CSS
export default function Admin() {
  const [users, setUsers] = useState([]);
    const [userDeleted, setUserDeleted] = useState(false);


  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await get('/api/admin/getuser');
        const response = request.data;
        if (request.status === 200) {
          setUsers(response.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetUsers();
  }, [userDeleted]);

  const handleDelete = async (id) => {
    try {
      const request = await deleteUser(`/api/admin/deleteuser/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
          setUserDeleted(!userDeleted)
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div className="admin-container">
        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
             {users &&
              users.map((elem) => (
                <tr key={elem._id}>
                  <td>{elem.name}</td>
                  <td>{elem.email}</td>
                  <td>
                    <button onClick={() => handleDelete(elem._id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}