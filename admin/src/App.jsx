import { useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Token ellenőrzése induláskor
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            // Később itt lehet az adatok lekérése
            setIsLoggedIn(true);
            // Teszt: az email-t az App memóriájában tároljuk
            const userData = localStorage.getItem("userData");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = (data) => {
        setUser(data);
        setIsLoggedIn(true);
        // Felhasználói adatok mentése
        localStorage.setItem("userData", JSON.stringify(data));
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        setUser(null);
    };

    if (loading) {
        return <div style={{ padding: "2rem" }}>Betöltés...</div>;
    }

    return isLoggedIn && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
    ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
    );
}

export default App;
