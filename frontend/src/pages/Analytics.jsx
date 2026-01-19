import { useState, useEffect } from 'react';

function Analytics() {
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [stats, setStats] = useState({
    totalTickets: 127,
    resolvedTickets: 98,
    avgResponseTime: 2.4, // hours
    avgResolutionTime: 18.3, // hours
    satisfactionScore: 4.6,
    activeTickets: 29
  });

  const [ticketsByCategory, setTicketsByCategory] = useState([
    { name: 'Hardware', count: 45, percentage: 35 },
    { name: 'Software', count: 38, percentage: 30 },
    { name: 'Account', count: 28, percentage: 22 },
    { name: 'Network', count: 16, percentage: 13 }
  ]);

  const [ticketsByPriority, setTicketsByPriority] = useState([
    { name: 'High', count: 15, percentage: 12 },
    { name: 'Medium', count: 67, percentage: 53 },
    { name: 'Low', count: 45, percentage: 35 }
  ]);

  const [weeklyTrend, setWeeklyTrend] = useState([
    { day: 'Mon', tickets: 18 },
    { day: 'Tue', tickets: 22 },
    { day: 'Wed', tickets: 25 },
    { day: 'Thu', tickets: 20 },
    { day: 'Fri', tickets: 28 },
    { day: 'Sat', tickets: 8 },
    { day: 'Sun', tickets: 6 }
  ]);

  const [topIssues, setTopIssues] = useState([
    { issue: 'Password Reset', count: 34 },
    { issue: 'Computer Won\'t Start', count: 28 },
    { issue: 'Printer Issues', count: 22 },
    { issue: 'Software Installation', count: 18 },
    { issue: 'Network Connectivity', count: 15 }
  ]);

  return (
    <div className="bg-gradient-to-br from-crystal-light to-white min-h-screen pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-crystal-dark flex items-center gap-3">
              <span className="text-4xl">📊</span>
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Performance Metrics & Insights</p>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-md">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-crystal-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Tickets</h3>
              <span className="text-2xl">🎫</span>
            </div>
            <p className="text-4xl font-bold text-crystal-dark mb-2">{stats.totalTickets}</p>
            <div className="flex items-center text-green-600 text-sm">
              <span>↗</span>
              <span className="ml-1">+12% from last {timeRange}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Resolution Rate</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-crystal-dark mb-2">
              {Math.round((stats.resolvedTickets / stats.totalTickets) * 100)}%
            </p>
            <div className="flex items-center text-green-600 text-sm">
              <span>↗</span>
              <span className="ml-1">{stats.resolvedTickets} resolved</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Avg Response Time</h3>
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="text-4xl font-bold text-crystal-dark mb-2">{stats.avgResponseTime}h</p>
            <div className="flex items-center text-green-600 text-sm">
              <span>↘</span>
              <span className="ml-1">-15% faster</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Trend */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-crystal-dark mb-4">Ticket Volume Trend</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {weeklyTrend.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-crystal-blue rounded-t-lg hover:bg-blue-700 transition-colors cursor-pointer relative group"
                       style={{ height: `${(day.tickets / 30) * 100}%` }}>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.tickets} tickets
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{day.day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tickets by Category */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-crystal-dark mb-4">Tickets by Category</h3>
            <div className="space-y-4">
              {ticketsByCategory.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-bold text-gray-900">{category.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-crystal-blue h-3 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-crystal-dark mb-4">Priority Distribution</h3>
            <div className="space-y-4">
              {ticketsByPriority.map((priority, index) => {
                const colors = {
                  'High': 'bg-red-500',
                  'Medium': 'bg-yellow-500',
                  'Low': 'bg-green-500'
                };
                return (
                  <div key={index} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{priority.name}</span>
                        <span className="text-sm font-bold text-gray-900">{priority.count} ({priority.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${colors[priority.name]} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${priority.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Issues */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-crystal-dark mb-4">Top 5 Issues</h3>
            <div className="space-y-3">
              {topIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-crystal-blue text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{issue.issue}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{issue.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export/Print Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Report</span>
          </button>
          <button className="px-6 py-3 bg-crystal-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;