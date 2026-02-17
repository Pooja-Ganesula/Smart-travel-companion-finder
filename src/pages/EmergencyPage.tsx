import EmergencySOS from '../components/EmergencySOS';
import { useAuth } from '../context/AuthContext';

export default function EmergencyPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Safety Center</h1>
        <p className="text-gray-600">
          Your safety is our priority. Access emergency assistance and safety features here.
        </p>
      </div>
      
      <EmergencySOS userId={user.userId} />
    </div>
  );
}
