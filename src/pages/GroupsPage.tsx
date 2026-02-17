import { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Star, Plus, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import type { Group } from '../types';

export default function GroupsPage() {
  useAuth();
  const { groups } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0]);
    }
  }, [groups, selectedGroup]);

  const handleCreateGroup = () => {
    // In a real app, this would open a modal or navigate to a form
    alert('Group creation feature coming soon!');
  };

  const handleJoinGroup = (groupId: string) => {
    // In a real app, this would handle joining a group
    alert(`Joining group ${groupId}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Users className="h-6 w-6 text-teal-600 mr-2" />
              Travel Groups
            </h1>
            <p className="text-gray-600">
              Join or create travel groups for shared experiences and safety.
            </p>
          </div>
          <button
            onClick={handleCreateGroup}
            className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Groups Available</h3>
          <p className="text-gray-600 mb-6">
            Groups will be suggested based on your matches and travel preferences.
          </p>
          <button
            onClick={handleCreateGroup}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Suggested Groups</h2>
            {groups.map((group) => (
              <div
                key={group.groupId}
                onClick={() => setSelectedGroup(group)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedGroup?.groupId === group.groupId
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{group.destination}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {group.members.length}/{group.maxMembers}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(group.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    group.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : group.status === 'Planning'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {group.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Group Details */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedGroup.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedGroup.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Settings className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Group Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{selectedGroup.destination}</p>
                    <p className="text-xs text-gray-500">Destination</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">
                      {selectedGroup.members.length}/{selectedGroup.maxMembers}
                    </p>
                    <p className="text-xs text-gray-500">Members</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedGroup.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">Start Date</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Star className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{selectedGroup.groupType}</p>
                    <p className="text-xs text-gray-500">Group Type</p>
                  </div>
                </div>

                {/* Members */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGroup.members.map((member) => (
                      <div key={member.userId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">
                            {member.profile.travelStyle} • {member.currentCity}
                          </p>
                        </div>
                        {member.verificationStatus === 'Verified' && (
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Verified
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleJoinGroup(selectedGroup.groupId)}
                    className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                  >
                    Join Group
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Group</h3>
                <p className="text-gray-600">
                  Choose a group from the list to view details and join.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
