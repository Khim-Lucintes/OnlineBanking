export const getUser = () => {
    try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
};

export const hasPermission = (permissionKey) => {
    const user = getUser();
    const permissions = user?.permissions || [];
    return permissions.includes(permissionKey);
};