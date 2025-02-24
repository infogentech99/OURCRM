import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [importData, setImportData] = useState([]);
  const [importMode, setImportMode] = useState(false);
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

  // Create API configuration
  const api = {
    baseURL: 'https://ourcrm-o8vx.onrender.com/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}/leads`, {
        headers: api.headers
      });
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch leads: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleFileUpload = async (event) => {
    try {
      setLoading(true);
      setError(null);
      const file = event.target.files[0];
      
      if (!file) return;
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {
        cellDates: true,
        cellStyles: true,
        cellNF: true
      });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setImportData(jsonData);
      setImportMode(true);
    } catch (err) {
      setError('Error processing file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

// BULK INSERT: POST /api/leads/bulk (Import Multiple Leads)
router.post('/bulk', async (req, res) => {
  try {
    const { leads } = req.body; // Extract leads array from request body

    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ message: 'Invalid leads data' });
    }

    // Validate required fields for each lead
    for (let lead of leads) {
      if (!lead.apolloId || !lead.fullName) {
        return res.status(400).json({ message: 'Apollo ID and Full Name are required for all leads' });
      }
    }

    // Log incoming leads
    console.log("Incoming Leads Data:", leads);

    const insertedLeads = await Lead.insertMany(leads);
    res.status(201).json({ message: 'Leads imported successfully', insertedLeads });
  } catch (error) {
    console.error('Error importing leads:', error); // Log the actual error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentLead 
        ? `${api.baseURL}/leads/${currentLead._id}`
        : `${api.baseURL}/leads`;
      
      const response = await fetch(url, {
        method: currentLead ? 'PUT' : 'POST',
        headers: api.headers,
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save lead');
      
      setModalVisible(false);
      fetchLeads();
      resetForm();
    } catch (error) {
      setError('Failed to save lead: ' + error.message);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const response = await fetch(`${api.baseURL}/leads/${id}`, {
        method: 'DELETE',
        headers: api.headers
      });

      if (!response.ok) throw new Error('Failed to delete lead');
      
      await fetchLeads();
    } catch (error) {
      setError('Failed to delete lead: ' + error.message);
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
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Leads Management</h1>
          <p className="text-gray-600 mb-6">Manage your leads and import data from Excel</p>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => { setModalVisible(true); resetForm(); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Lead
              </button>
              <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
              <div className="flex">
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
          ) : importMode ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(importData[0] || {}).map((header) => (
                        <th 
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cell?.toString() || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {importData.length > 5 && (
                <p className="text-sm text-gray-500">
                  Showing first 5 of {importData.length} records
                </p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => { setImportMode(false); setImportData([]); }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Import {importData.length} Leads
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.fullName}</div>
                        {lead.linkedinUrl && (
                          <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                             className="text-xs text-indigo-600 hover:text-indigo-900">
                            LinkedIn
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-xs text-gray-500">{lead.emailStatus}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.jobTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.companyName}</div>
                        {lead.companyWebsite && (
                          <a href={lead.companyWebsite} target="_blank" rel="noopener noreferrer" 
                             className="text-xs text-indigo-600 hover:text-indigo-900">
                            Website
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.industry}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {[lead.city, lead.state, lead.country].filter(Boolean).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
        </div>
      </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full p-2 border rounded"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                <input
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Separate keywords with commas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company City</label>
                <input
                  type="text"
                  value={formData.companyCity}
                  onChange={(e) => setFormData({ ...formData, companyCity: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company State</label>
                <input
                  type="text"
                  value={formData.companyState}
                  onChange={(e) => setFormData({ ...formData, companyState: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Country</label>
                <input
                  type="text"
                  value={formData.companyCountry}
                  onChange={(e) => setFormData({ ...formData, companyCountry: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.companyLinkedinUrl}
                  onChange={(e) => setFormData({ ...formData, companyLinkedinUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Twitter URL</label>
                <input
                  type="url"
                  value={formData.companyTwitterUrl}
                  onChange={(e) => setFormData({ ...formData, companyTwitterUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Facebook URL</label>
                <input
                  type="url"
                  value={formData.companyFacebookUrl}
                  onChange={(e) => setFormData({ ...formData, companyFacebookUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone Numbers</label>
                <input
                  type="text"
                  value={formData.companyPhoneNumbers}
                  onChange={(e) => setFormData({ ...formData, companyPhoneNumbers: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Separate multiple numbers with commas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Twitter URL</label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
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