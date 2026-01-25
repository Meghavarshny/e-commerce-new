import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow text-center text-black">
        Login required.
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-5 text-center text-black">Profile</h2>
        <div className="space-y-2 text-black">
          <div><span className="font-semibold">Name:</span> {user.name}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">Role:</span> {user.role}</div>
        </div>
      </div>
    </div>
  );
}
