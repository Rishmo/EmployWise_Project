// Users.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editUser, setEditUser] = useState(null);
    const [updatedData, setUpdatedData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');

        const fetchUsers = async () => {
            try {
                const res = await axios.get(`https://reqres.in/api/users?page=${page}`);
                setUsers(res.data.data);
                setTotalPages(res.data.total_pages);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, [page, navigate]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://reqres.in/api/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user.id);
        setUpdatedData({
            first_name: user.first_name,
            last_name: user.last_name,
        });
    };

    const handleUpdate = async (id) => {
        try {
            const res = await axios.put(`https://reqres.in/api/users/${id}`, updatedData);
            setUsers(
                users.map((user) =>
                    user.id === id ? { ...user, ...updatedData } : user
                )
            );
            setEditUser(null);
            console.log('User updated:', res.data);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="user-card">
                        <img
                            src={user.avatar}
                            alt={user.first_name}
                            className="user-avatar"
                        />
                        {editUser === user.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedData.first_name}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, first_name: e.target.value })
                                    }
                                    className="w-full mb-2"
                                />
                                <input
                                    type="text"
                                    value={updatedData.last_name}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, last_name: e.target.value })
                                    }
                                    className="w-full mb-2"
                                />
                                <button
                                    onClick={() => handleUpdate(user.id)}
                                    className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditUser(null)}
                                    className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p>
                                    {user.first_name} {user.last_name}
                                </p>
                                <div className="edit-delete-buttons">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`pagination-button ${page === i + 1 ? 'active' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Users;