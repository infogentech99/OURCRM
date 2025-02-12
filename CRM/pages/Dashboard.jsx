import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data
const salesData = [
  { month: 'Jan', revenue: 45000, target: 40000 },
  { month: 'Feb', revenue: 52000, target: 42000 },
  { month: 'Mar', revenue: 48000, target: 44000 },
  { month: 'Apr', revenue: 61000, target: 46000 },
  { month: 'May', revenue: 55000, target: 48000 },
  { month: 'Jun', revenue: 67000, target: 50000 },
];

const leadData = {
  new: 45,
  followUp: 30,
  won: 25,
  lost: 15
};

const quotationData = {
  sent: 38,
  accepted: 22,
  rejected: 8
};

// Stat Card Component
const StatCard = ({ title, value, change, changeType, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      {change && (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {changeType === 'positive' ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="mt-2">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  </div>
);

// Status Card Component
const StatusCard = ({ title, data, colorClasses }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
    <h3 className="text-gray-600 text-sm font-medium mb-4">{title}</h3>
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-gray-600">{key}</span>
          <div className="flex items-center">
            <div className="w-32 h-2 rounded-full bg-gray-100 mr-3">
              <div 
                className={`h-2 rounded-full ${colorClasses[key]}`} 
                style={{ width: `${(value / Object.values(data).reduce((a, b) => a + b, 0)) * 100}%` }}
              />
            </div>
            <span className="text-gray-900 font-medium">{value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const totalLeads = Object.values(leadData).reduce((a, b) => a + b, 0);
  const totalQuotations = Object.values(quotationData).reduce((a, b) => a + b, 0);

  // Calculate current month's performance
  const currentMonth = salesData[salesData.length - 1];
  const previousMonth = salesData[salesData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

  const leadColorClasses = {
    new: 'bg-blue-500',
    followUp: 'bg-yellow-500',
    won: 'bg-green-500',
    lost: 'bg-red-500'
  };

  const quotationColorClasses = {
    sent: 'bg-blue-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">CRM System</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`${
                    currentView === 'dashboard' 
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                {/* Add more navigation items here */}
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-600">
                <span className="sr-only">View notifications</span>
                {/* Bell icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-600">Track your sales performance and manage leads effectively.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Monthly Revenue" 
            value={`$${currentMonth.revenue.toLocaleString()}`}
            change={revenueGrowth}
            changeType={revenueGrowth >= 0 ? 'positive' : 'negative'}
            subtitle={`Target: $${currentMonth.target.toLocaleString()}`}
          />
          <StatCard 
            title="Total Leads" 
            value={totalLeads}
            subtitle="Across all stages"
          />
          <StatCard 
            title="Lead Conversion Rate" 
            value={`${((leadData.won / totalLeads) * 100).toFixed(1)}%`}
            subtitle={`${leadData.won} won leads`}
          />
          <StatCard 
            title="Quotation Success Rate" 
            value={`${((quotationData.accepted / totalQuotations) * 100).toFixed(1)}%`}
            subtitle={`${quotationData.accepted} accepted`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-6">Revenue vs Target</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#9ca3af" 
                    strokeDasharray="5 5"
                    dot={{ stroke: '#9ca3af', strokeWidth: 2, r: 4 }}
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-6">Lead Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { status: 'New', value: leadData.new },
                  { status: 'Follow-up', value: leadData.followUp },
                  { status: 'Won', value: leadData.won },
                  { status: 'Lost', value: leadData.lost },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="status" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatusCard 
            title="Lead Status Breakdown"
            data={leadData}
            colorClasses={leadColorClasses}
          />
          <StatusCard 
            title="Quotation Status"
            data={quotationData}
            colorClasses={quotationColorClasses}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;