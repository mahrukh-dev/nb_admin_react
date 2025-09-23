import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

 const API_BASE_URL = 'https://nbbackend-production.up.railway.app/api';


  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add/edit form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      setLoading(true);

      if (editingCategory) {
        // Update category: send only 'name' (backend requires only this)
        await axios.put(`${API_BASE_URL}/categories/${editingCategory._id}`, {
          name: formData.name.trim(),
        });
        alert('Category updated successfully!');
      } else {
        // Add new category
        await axios.post(`${API_BASE_URL}/categories`, {
          name: formData.name.trim(),
        });
        alert('Category added successfully!');
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      const message = error.response?.data?.message || 'Failed to save category';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
      alert('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      const message = error.response?.data?.message || 'Failed to delete category';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white rounded-t-lg bg-gradient-to-r from-indigo-600 to-purple-600">
          <div>
            <h1 className="text-2xl font-bold">Category Management</h1>
            <p className="text-indigo-200">Manage your product categories</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 font-medium text-indigo-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
          >
            {showForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        <div className="p-6">
          {/* Add/Edit Form */}
          {showForm && (
            <div className="p-6 mb-8 border rounded-lg bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter category description"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingCategory ? 'Update' : 'Add'} Category
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 text-gray-700 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Categories ({categories.length})</h2>

            {loading && (
              <div className="py-8 text-center">
                <div className="inline-block w-8 h-8 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading categories...</p>
              </div>
            )}

            {!loading && categories.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p>No categories found. Add your first category!</p>
              </div>
            )}

            {!loading && categories.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-4 font-medium text-left text-gray-700">Name</th>
                      <th className="p-4 font-medium text-left text-gray-700">Description</th>
                      <th className="p-4 font-medium text-left text-gray-700">Created</th>
                      <th className="p-4 font-medium text-center text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{category.name}</td>
                        <td className="p-4 text-gray-600">{category.description || 'No description'}</td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="px-3 py-1 text-sm text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="px-3 py-1 text-sm text-white transition-colors bg-red-500 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
