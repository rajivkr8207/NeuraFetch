import { useEffect, useState } from "react";
import useAuth from "../hooks/useauth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const {handleFetchProfile, isError, isLoading} = useAuth()

  // 🔥 Fetch profile
  const fetchProfile = async () => {
    const res = await handleFetchProfile()
    setUser(res)
  };

  // 🔥 Logout
  const handleLogout = async () => {
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Your Profile
        </h2>

        {isError && (
          <p className="text-center text-red-500 mb-4">{isError}</p>
        )}

        {user && (
          <div className="space-y-4">

            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="text-center">
              <h3 className="text-xl font-semibold">{user.fullName}</h3>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition mt-4"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}