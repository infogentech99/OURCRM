import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/leads', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentLead 
        ? `http://localhost:5000/api/leads/${currentLead._id}`
        : 'http://localhost:5000/api/leads';
      
      const response = await fetch(url, {
        method: currentLead ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save lead');
      setModalVisible(false);
      fetchLeads();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to delete lead');
      fetchLeads();
    } catch (err) {
      setError(err.message);
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
        <div className="bg-red-50 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
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