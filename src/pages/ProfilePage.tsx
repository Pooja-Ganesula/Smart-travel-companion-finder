import { useMemo, useState } from 'react';
import { Globe, MapPin, Save, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { TravelProfile, User } from '../types';

const INTEREST_OPTIONS = [
  'Adventure',
  'Food',
  'Culture',
  'Nature',
  'History',
  'Photography',
  'Nightlife',
  'Relaxation',
  'Shopping',
  'Hiking',
  'Art',
  'Music',
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'travel' | 'interests'>('basic');
  const [savedMessage, setSavedMessage] = useState('');

  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name,
    age: user?.age,
    bio: user?.bio,
    gender: user?.gender,
    homeCountry: user?.homeCountry,
    currentCity: user?.currentCity,
    profile: {
      ...(user?.profile as TravelProfile),
    },
  });

  const selectedInterests = formData.profile?.interests ?? [];

  const completion = useMemo(() => {
    const points = [
      Boolean(formData.name),
      Boolean(formData.age),
      Boolean(formData.currentCity),
      Boolean(formData.homeCountry),
      Boolean(formData.profile?.budget),
      Boolean(formData.profile?.travelStyle),
      selectedInterests.length >= 3,
      Boolean(formData.bio && formData.bio.length >= 20),
    ].filter(Boolean).length;

    return Math.round((points / 8) * 100);
  }, [formData, selectedInterests.length]);

  if (!user) return <div className="text-center py-20">Please login to edit profile.</div>;

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'age' ? Number(value) : value }));
  };

  const handleProfileChange = <K extends keyof TravelProfile>(field: K, value: TravelProfile[K]) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...(prev.profile as TravelProfile),
        [field]: value,
      },
    }));
  };

  const toggleInterest = (interest: string) => {
    const nextInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((item) => item !== interest)
      : [...selectedInterests, interest];

    handleProfileChange('interests', nextInterests);
  };

  const handleSave = () => {
    updateProfile(formData);
    setSavedMessage('Profile updated successfully');
    window.setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-5 text-white flex items-center justify-between">
        <h1 className="text-xl font-semibold inline-flex items-center">
          <UserIcon className="mr-2 h-5 w-5" /> Profile Setup
        </h1>
        <p className="text-sm text-teal-100">Profile completeness: {completion}%</p>
      </div>

      <div className="px-6 pt-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <div className="border-b border-gray-200 mt-4 flex">
        {[
          { id: 'basic', label: 'Basic Info' },
          { id: 'travel', label: 'Travel Preferences' },
          { id: 'interests', label: 'Interests' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'basic' | 'travel' | 'interests')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <input name="name" value={formData.name ?? ''} onChange={handleBasicChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Age</label>
                <input name="age" type="number" min={18} value={formData.age ?? 18} onChange={handleBasicChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" value={formData.gender ?? 'Other'} onChange={handleBasicChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Personality</label>
                <select
                  value={formData.profile?.personality ?? 'Ambivert'}
                  onChange={(e) => handleProfileChange('personality', e.target.value as TravelProfile['personality'])}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="Introvert">Introvert</option>
                  <option value="Extrovert">Extrovert</option>
                  <option value="Ambivert">Ambivert</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 inline-flex items-center"><Globe className="h-4 w-4 mr-1" /> Home Country</label>
                <input name="homeCountry" value={formData.homeCountry ?? ''} onChange={handleBasicChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 inline-flex items-center"><MapPin className="h-4 w-4 mr-1" /> Current City</label>
                <input name="currentCity" value={formData.currentCity ?? ''} onChange={handleBasicChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea name="bio" rows={4} value={formData.bio ?? ''} onChange={handleBasicChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        {activeTab === 'travel' && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Budget Range</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Low', 'Medium', 'High'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleProfileChange('budget', option)}
                    className={`rounded-md px-3 py-2 text-sm border ${formData.profile?.budget === option ? 'bg-teal-50 border-teal-400 text-teal-700' : 'border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Travel Style</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Backpacking', 'Standard', 'Luxury', 'Adventure'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleProfileChange('travelStyle', option)}
                    className={`rounded-md px-3 py-2 text-sm border ${formData.profile?.travelStyle === option ? 'bg-teal-50 border-teal-400 text-teal-700' : 'border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Language Preference</label>
              <input
                value={formData.profile?.languagePreference ?? ''}
                onChange={(e) => handleProfileChange('languagePreference', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="English, Hindi, Spanish..."
              />
            </div>
          </div>
        )}

        {activeTab === 'interests' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose at least 3 interests for better matching</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${selected ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-white border-gray-300 text-gray-600'}`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-green-600">{savedMessage}</span>
          <button onClick={handleSave} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
            <Save className="h-4 w-4 mr-2" /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
