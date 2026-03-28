export const getErrorMessage = (error) => {
    if (error?.response) {
        return (
            error.response.data?.message ||
            error.response.data?.error ||
            "Server error"
        );
    }
    if (error?.request) {
        return "Network error. Please try again.";
    }
    return error.message || "Something went wrong";
};