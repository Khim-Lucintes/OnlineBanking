import React from "react";
import "../../../../../../css/SuperAdmin/components/SuperAdminSummaryCards.css";

function SuperAdminSummaryCards({
    totalAdmins,
    activeAdmins,
    activeAlerts,
    systemHealth,
    systemUptime,
    onManageAdmins,
}) {
    return (
        <section className="sa-summary-row">
            <div className="sa-summary-box">
                <div className="sa-summary-head">
                    <div className="sa-summary-title-wrap">
                        <span className="sa-summary-icon">👥</span>
                        <span className="sa-summary-title">Admins</span>
                    </div>
                    <button type="button" className="sa-summary-more">•••</button>
                </div>

                <div className="sa-summary-body">
                    <h3>{totalAdmins}</h3>
                    <span className="sa-summary-trend sa-positive-trend">
                        {activeAdmins} active
                    </span>
                </div>

                <p className="sa-summary-subtext">System administrators</p>
            </div>

            <div className="sa-summary-box">
                <div className="sa-summary-head">
                    <div className="sa-summary-title-wrap">
                        <span className="sa-summary-icon">🚨</span>
                        <span className="sa-summary-title">Alerts</span>
                    </div>
                    <button type="button" className="sa-summary-more">•••</button>
                </div>

                <div className="sa-summary-body">
                    <h3>{activeAlerts}</h3>
                    <span
                        className={`sa-summary-trend ${activeAlerts > 0 ? "sa-warning-trend" : "sa-positive-trend"
                            }`}
                    >
                        {activeAlerts > 0 ? "Review needed" : "Stable"}
                    </span>
                </div>

                <p className="sa-summary-subtext">Security and ops alerts</p>
            </div>

            <div className="sa-summary-box">
                <div className="sa-summary-head">
                    <div className="sa-summary-title-wrap">
                        <span className="sa-summary-icon">🛡️</span>
                        <span className="sa-summary-title">Health</span>
                    </div>
                    <button type="button" className="sa-summary-more">•••</button>
                </div>

                <div className="sa-summary-body">
                    <h3>{systemHealth}</h3>
                    <span className="sa-summary-trend sa-positive-trend">
                        {systemUptime}
                    </span>
                </div>

                <p className="sa-summary-subtext">Service status</p>
            </div>

            <div
                className="sa-summary-box sa-summary-action-box"
                onClick={onManageAdmins}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onManageAdmins?.();
                    }
                }}
            >
                <div className="sa-summary-head">
                    <div className="sa-summary-title-wrap">
                        <span className="sa-summary-icon">⚙️</span>
                        <span className="sa-summary-title">Manage</span>
                    </div>
                    <button type="button" className="sa-summary-more">→</button>
                </div>

                <div className="sa-summary-body">
                    <h3>Admins</h3>
                    <span className="sa-summary-trend sa-positive-trend">
                        Open panel
                    </span>
                </div>

                <p className="sa-summary-subtext">Admin tools</p>
            </div>
        </section>
    );
}

export default SuperAdminSummaryCards;