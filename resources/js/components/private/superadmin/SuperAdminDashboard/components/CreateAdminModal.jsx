import React from "react";

function CreateAdminModal({
    show,
    onClose,
    formData,
    onChange,
    onSubmit,
    loading,
}) {
    if (!show) return null;

    return (
        <div className="manage-admins-modal-overlay">
            <div className="manage-admins-create-modal">
                <div className="manage-admins-create-header">
                    <div>
                        <h3>Create Admin</h3>
                        <p>Add a new administrator account</p>
                    </div>

                    <button
                        type="button"
                        className="manage-admins-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={onSubmit} className="manage-admins-form">
                    <div className="manage-admins-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={onChange}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="manage-admins-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div className="manage-admins-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="manage-admins-form-actions">
                        <button
                            type="button"
                            className="manage-admins-clear-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="manage-admins-create-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAdminModal;