import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useauth";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const { handleFetchProfile, handleLogout, } = useAuth();

  const fetchProfile = async () => {
    const res = await handleFetchProfile();
    if (res?.data) {
      setUser(res.data);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);



  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Cover Photo / Header */}
            <div className="h-32 bg-gradient-to-r from-orange-500 to-red-600"></div>

            {/* Profile Content */}
            <div className="relative px-6 pb-8">
              {/* Avatar */}
              <div className="absolute -top-12 left-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-red-600 p-1">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">
                      {user?.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="flex justify-end pt-4">
                <button className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Edit Profile
                </button>
              </div>

              {/* User Info */}
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.fullName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>

                {/* Bio placeholder */}
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {user?.bio || "No bio added yet"}
                </p>
              </div>

              {/* Detailed Info */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">
                      {user?.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/change/password')}
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Update Password
                </button>

                <button
                  onClick={onLogout}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}