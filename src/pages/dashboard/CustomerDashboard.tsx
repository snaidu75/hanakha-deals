import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMLM } from '../../contexts/MLMContext';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award,
  Eye,
  UserPlus,
  BarChart3,
  Calendar
} from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserPosition, getDownline, getUpline } = useMLM();
  const [activeTab, setActiveTab] = useState('overview');

  const userPosition = getUserPosition(user?.id || '');
  const downline = getDownline(userPosition?.id || '');
  const upline = getUpline(userPosition?.id || '');

  // Mock statistics for demonstration
  const mockStats = {
    referrals: 24
  };

  const stats = [
    {
      title: 'Total Referrals',
      value: downline.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Monthly Earnings',
      value: '$2,450',
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Current Level',
      value: userPosition?.level || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: 'Level up!'
    },
    {
      title: 'Achievement Points',
      value: '1,250',
      icon: Award,
      color: 'bg-yellow-500',
      change: '+15%'
    }
  ];

  const recentActivities = [
    {
      type: 'referral',
      message: 'New referral joined your network',
      time: '2 hours ago',
      icon: UserPlus
    },
    {
      type: 'earning',
      message: 'Commission earned: $125',
      time: '1 day ago',
      icon: DollarSign
    },
    {
      type: 'level',
      message: 'Congratulations! Level 3 achieved',
      time: '3 days ago',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Sponsorship Number: <span className="font-semibold text-indigo-600">{user?.sponsorshipNumber}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'network', label: 'My Network', icon: Users },
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
                { id: 'genealogy', label: 'Genealogy', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <activity.icon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Invite New Members
                    </button>
                    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                      View Earnings Report
                    </button>
                    <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Direct Referrals</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">8</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900">Total Network</h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">{mockStats.referrals}</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900">Active Members</h4>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{Math.floor(mockStats.referrals * 0.8)}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Summary</h3>
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold">Total Earnings</h4>
                  <p className="text-3xl font-bold mt-2">$12,450.00</p>
                  <p className="text-green-100 mt-1">+15% from last month</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900">This Month</h5>
                    <p className="text-xl font-bold text-gray-700 mt-1">$2,450.00</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Commission Rate</h5>
                    <p className="text-xl font-bold text-gray-700 mt-1">12%</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'genealogy' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Binary Tree Structure</h3>
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <div className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg mb-4">
                    You ({user?.sponsorshipNumber})
                  </div>
                  <div className="grid grid-cols-2 gap-8 mt-8">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-700 mb-2">Left Side</h4>
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500">4 Members</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-700 mb-2">Right Side</h4>
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500">8 Members</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;