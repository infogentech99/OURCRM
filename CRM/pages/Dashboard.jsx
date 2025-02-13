import React, { useState } from 'react';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis,Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LeadsManagement from './LeadsManagement';

// Enhanced sample data
const salesData = [
  { month: 'Jan', mrr: 45000, newMrr: 5000, churnMrr: 2000 },
  { month: 'Feb', mrr: 48000, newMrr: 6000, churnMrr: 3000 },
  { month: 'Mar', mrr: 51000, newMrr: 5500, churnMrr: 2500 },
  { month: 'Apr', mrr: 54000, newMrr: 7000, churnMrr: 4000 },
  { month: 'May', mrr: 57000, newMrr: 6500, churnMrr: 3500 },
  { month: 'Jun', mrr: 60000, newMrr: 8000, churnMrr: 5000 },
];

const pipelineData = {
  discovery: { count: 45, value: 450000 },
  demo: { count: 30, value: 300000 },
  evaluation: { count: 25, value: 250000 },
  negotiation: { count: 15, value: 150000 },
  closedWon: { count: 10, value: 100000 }
};

const customerHealthData = {
  healthy: 65,
  neutral: 25,
  atrisk: 10
};

const productMetrics = {
  activeUsers: 2500,
  avgDailyUsage: '2.5 hours',
  featureAdoption: '78%',
  userSatisfaction: 4.2,
  supportTickets: 125,
  avgResponseTime: '2.4 hours'
};

// Stat Card Component (keep existing implementation)
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

// Pipeline Card Component
const PipelineCard = ({ data }) => {
  const totalValue = Object.values(data).reduce((acc, curr) => acc + curr.value, 0);
  const totalCount = Object.values(data).reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-4">Deal Pipeline</h3>
      <div className="space-y-4">
        {Object.entries(data).map(([stage, { count, value }]) => (
          <div key={stage} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{stage}</span>
              <span className="font-medium">{count} deals (${(value / 1000).toFixed(1)}k)</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${(value / totalValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm font-medium">
          <span>Total Pipeline Value</span>
          <span>${(totalValue / 1000).toFixed(1)}k</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {totalCount} active deals
        </div>
      </div>
    </div>
  );
};

// Product Metrics Card
const ProductMetricsCard = ({ metrics }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-gray-600 text-sm font-medium mb-4">Product Metrics</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Active Users</div>
          <div className="text-xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Avg. Daily Usage</div>
          <div className="text-xl font-bold">{metrics.avgDailyUsage}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Feature Adoption</div>
          <div className="text-xl font-bold">{metrics.featureAdoption}</div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">User Satisfaction</div>
          <div className="text-xl font-bold">{metrics.userSatisfaction}/5.0</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Support Tickets</div>
          <div className="text-xl font-bold">{metrics.supportTickets}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Avg. Response Time</div>
          <div className="text-xl font-bold">{metrics.avgResponseTime}</div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  // Calculate current month's performance
  const currentMonth = salesData[salesData.length - 1];
  const previousMonth = salesData[salesData.length - 2];
  const mrrGrowth = ((currentMonth.mrr - previousMonth.mrr) / previousMonth.mrr) * 100;
  const netMrr = currentMonth.newMrr - currentMonth.churnMrr;

  const renderDashboard = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Monthly Recurring Revenue" 
          value={`$${currentMonth.mrr.toLocaleString()}`}
          change={mrrGrowth}
          changeType={mrrGrowth >= 0 ? 'positive' : 'negative'}
          subtitle={`Net New: $${netMrr.toLocaleString()}`}
        />
        <StatCard 
          title="Active Customers" 
          value={productMetrics.activeUsers}
          subtitle="Daily active users"
        />
        <StatCard 
          title="Feature Adoption" 
          value={productMetrics.featureAdoption}
          subtitle="Across all features"
        />
        <StatCard 
          title="Customer Satisfaction" 
          value={`${productMetrics.userSatisfaction}/5.0`}
          subtitle="User satisfaction score"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* MRR Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-6">MRR Growth</h3>
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
                  dataKey="mrr" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="MRR"
                />
                <Line 
                  type="monotone" 
                  dataKey="newMrr" 
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ stroke: '#22c55e', strokeWidth: 2, r: 4 }}
                  name="New MRR"
                />
                <Line 
                  type="monotone" 
                  dataKey="churnMrr" 
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4 }}
                  name="Churn MRR"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Health Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-6">Customer Health</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Healthy', value: customerHealthData.healthy, color: '#22c55e' },
                    { name: 'Neutral', value: customerHealthData.neutral, color: '#eab308' },
                    { name: 'At Risk', value: customerHealthData.atrisk, color: '#ef4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Healthy', color: '#22c55e' },
                    { name: 'Neutral', color: '#eab308' },
                    { name: 'At Risk', color: '#ef4444' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PipelineCard data={pipelineData} />
        <ProductMetricsCard metrics={productMetrics} />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Keep existing navigation */}
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
                <button 
                  onClick={() => setCurrentView('leads')}
                  className={`${
                    currentView === 'leads' 
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Leads
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-600">
                <span className="sr-only">View notifications</span>
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
          <h1 className="text-2xl font-bold text-gray-900">
            {currentView === 'dashboard' ? 'Dashboard Overview' : 'Leads Management'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {currentView === 'dashboard' 
              ? 'Track your software company metrics and performance.'
              : 'Manage and track your software leads in one place.'}
          </p>
        </div>

        {/* Dynamic Content */}
        {currentView === 'dashboard' ? renderDashboard() : <LeadsManagement />}
      </main>
    </div>
  );
};

export default Dashboard;