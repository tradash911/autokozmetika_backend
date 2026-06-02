import { useState } from "react";
import BlogManager from "./BlogManager";
import CategoryManager from "./CategoryManager";
import MainCategoryManager from "./MainCategoryManager";
import OpeningHoursManager from "./OpeningHoursManager";
import SettingsManager from "./SettingsManager";

function Dashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState("overview");

    const tabStyle = (tab) => ({
        padding: "0.75rem 1.5rem",
        backgroundColor: activeTab === tab ? "#0066cc" : "#e0e0e0",
        color: activeTab === tab ? "white" : "black",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    });

    return (
        <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                    gap: "1rem",
                    flexWrap: "wrap",
                }}
            >
                <h1>Admin Dashboard</h1>
                <div>
                    <span style={{ marginRight: "1rem" }}>
                        Bejelentkezve: <strong>{user.email}</strong>
                    </span>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#cc0000",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Kijelentkezés
                    </button>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "2rem",
                    flexWrap: "wrap",
                }}
            >
                <button onClick={() => setActiveTab("overview")} style={tabStyle("overview")}>
                    Áttekintés
                </button>
                <button onClick={() => setActiveTab("blog")} style={tabStyle("blog")}>
                    Blog
                </button>
                <button
                    onClick={() => setActiveTab("main-categories")}
                    style={tabStyle("main-categories")}
                >
                    Fő kategóriák
                </button>
                <button onClick={() => setActiveTab("categories")} style={tabStyle("categories")}>
                    Kategóriák
                </button>
                <button onClick={() => setActiveTab("settings")} style={tabStyle("settings")}>
                    Beállítások
                </button>
                <button
                    onClick={() => setActiveTab("opening-hours")}
                    style={tabStyle("opening-hours")}
                >
                    Nyitvatartás
                </button>
            </div>

            <div
                style={{
                    padding: "1rem",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                }}
            >
                {activeTab === "overview" && (
                    <div>
                        <h2>Áttekintés</h2>
                        <p>Üdv az admin felületen! {user.email}</p>
                        <p>
                            Kezelhető adatok: blog, kategóriák, beállítások és
                            nyitvatartás.
                        </p>
                    </div>
                )}

                {activeTab === "blog" && <BlogManager />}

                {activeTab === "main-categories" && <MainCategoryManager />}

                {activeTab === "categories" && <CategoryManager />}

                {activeTab === "settings" && <SettingsManager />}

                {activeTab === "opening-hours" && <OpeningHoursManager />}
            </div>
        </main>
    );
}

export default Dashboard;
