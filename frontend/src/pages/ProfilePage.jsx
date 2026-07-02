import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow text-center text-gray-800">
        Login required.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow w-full">
        <h2 className="text-xl font-semibold mb-5 text-center text-gray-900">Profile</h2>
        <div className="space-y-2 text-gray-800">
          <div><span className="font-semibold">Name:</span> {user.name}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">Role:</span> {user.role}</div>
        </div>
      </div>
    </div>
  );
}
