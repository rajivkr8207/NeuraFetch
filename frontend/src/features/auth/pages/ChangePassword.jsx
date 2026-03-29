import { useState } from "react";
import useAuth from "../hooks/useauth";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const { handleChangePassword } = useAuth();
    const navigate = useNavigate();
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
        setPasswordError("");
    };

    const validatePassword = () => {
        if (!passwordData.currentPassword) {
            setPasswordError("Current password is required");
            return false;
        }
        if (!passwordData.newPassword) {
            setPasswordError("New password is required");
            return false;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters");
            return false;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }
        return true;
    };


    const onSubmitPasswordUpdate = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setIsUpdatingPassword(true);
        try {
            const response = await handleChangePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response?.success) {
                setPasswordSuccess("Password updated successfully!");
                setTimeout(() => {
                    setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    });
                    setPasswordSuccess("");
                }, 2000);
            } else {
                setPasswordError(response?.message || "Failed to update password");
            }
        } catch (err) {
            console.error(err);
            setPasswordError("An error occurred. Please try again.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };
    return (
        <div className=" z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Update Password
                            </h3>

                        </div>

                        <form onSubmit={onSubmitPasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter new password (min. 8 characters)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {passwordError && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                    <p className="text-sm text-green-600 dark:text-green-400">{passwordSuccess}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => navigate('/')}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isUpdatingPassword}
                                    type="submit"
                                >
                                    {isUpdatingPassword ? "Updating..." : "Update Password"}

                                </Button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword