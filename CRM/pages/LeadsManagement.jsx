import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with custom config
const api = axios.create({
  baseURL: 'https://ourcrm-o8vx.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [formData, setFormData] = useState({
    apolloId: '',
    fullName: '',
    linkedinUrl: '',
    firstName: '',
    lastName: '',
    email: '',
    emailStatus: '',
    jobTitle: '',
    companyName: '',
    companyWebsite: '',
    city: '',
    state: '',
    country: '',
    industry: '',
    keywords: '',
    employees: 0,
    companyCity: '',
    companyState: '',
    companyCountry: '',
    companyLinkedinUrl: '',
    companyTwitterUrl: '',
    companyFacebookUrl: '',
    companyPhoneNumbers: '',
    twitterUrl: '',
    facebookUrl: ''
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // First try localhost
      try {
        const localResponse = await axios.get('http://localhost:5000/api/leads', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (localResponse.data) {
          setLeads(localResponse.data);
          setError(null);
          setLoading(false);
          return;
        }
      } catch (localError) {
        console.log('Local server not available, trying production...');
      }

      // If localhost fails, try production server
      const response = await api.get('/leads', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLeads(response.data);
      setError(null);
    } catch (error) {
      console.error('Fetch leads error:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Server is taking longer than usual. Please try again.');
      } else if (error.response) {
        setError(error.response.data?.message || 'Failed to fetch leads');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First try localhost
      try {
        const url = currentLead 
          ? `http://localhost:5000/api/leads/${currentLead._id}`
          : 'http://localhost:5000/api/leads';
        
        const localResponse = await axios({
          method: currentLead ? 'PUT' : 'POST',
          url,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: formData
        });
        
        if (localResponse.data) {
          setModalVisible(false);
          fetchLeads();
          resetForm();
          return;
        }
      } catch (localError) {
        console.log('Local server not available, trying production...');
      }

      // If localhost fails, try production server
      const url = currentLead 
        ? `/leads/${currentLead._id}`
        : '/leads';
      
      const response = await api({
        method: currentLead ? 'PUT' : 'POST',
        url,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: formData
      });

      if (response.data) {
        setModalVisible(false);
        fetchLeads();
        resetForm();
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || 'Failed to save lead');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      // First try localhost
      try {
        const localResponse = await axios.delete(`http://localhost:5000/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (localResponse.data) {
          fetchLeads();
          return;
        }
      } catch (localError) {
        console.log('Local server not available, trying production...');
      }

      // If localhost fails, try production server
      await api.delete(`/leads/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchLeads();
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || 'Failed to delete lead');
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      apolloId: '',
      fullName: '',
      linkedinUrl: '',
      firstName: '',
      lastName: '',
      email: '',
      emailStatus: '',
      jobTitle: '',
      companyName: '',
      companyWebsite: '',
      city: '',
      state: '',
      country: '',
      industry: '',
      keywords: '',
      employees: 0,
      companyCity: '',
      companyState: '',
      companyCountry: '',
      companyLinkedinUrl: '',
      companyTwitterUrl: '',
      companyFacebookUrl: '',
      companyPhoneNumbers: '',
      twitterUrl: '',
      facebookUrl: ''
    });
    setCurrentLead(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads Management</h1>
        <button
          onClick={() => { setModalVisible(true); resetForm(); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Add Lead
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{lead.fullName}</div>
                    {lead.linkedinUrl && (
                      <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-indigo-600 hover:text-indigo-900">LinkedIn</a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-xs text-gray-500">{lead.emailStatus}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.jobTitle}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{lead.companyName}</div>
                    {lead.companyWebsite && (
                      <a href={lead.companyWebsite} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-indigo-600 hover:text-indigo-900">Website</a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.industry}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {[lead.city, lead.state, lead.country].filter(Boolean).join(', ')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => { setModalVisible(true); setCurrentLead(lead); setFormData(lead); }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLead(lead._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{currentLead ? 'Edit Lead' : 'Add Lead'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apollo ID</label>
                <input
                  type="text"
                  value={formData.apolloId}
                  onChange={(e) => setFormData({ ...formData, apolloId: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => { setModalVisible(false); resetForm(); }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  {currentLead ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;