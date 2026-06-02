import { useState } from "react";

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError("Bejelentkezés sikertelen");
                setLoading(false);
                return;
            }

            // Token mentése
            localStorage.setItem("authToken", data.token);
            onLoginSuccess(data);
        } catch (err) {
            setError("Hibás email cím vagy jelszó");
            setLoading(false);
        }
    };

    return (
        <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
            <div style={{ maxWidth: "400px", margin: "50px auto" }}>
                <h1>Admin Bejelentkezés</h1>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.5rem",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="password">Jelszó:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.5rem",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                color: "red",
                                marginBottom: "1rem",
                                padding: "0.5rem",
                                backgroundColor: "#ffe0e0",
                                borderRadius: "4px",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#0066cc",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? "Bejelentkezés..." : "Bejelentkezés"}
                    </button>
                </form>

                <p
                    style={{
                        marginTop: "2rem",
                        fontSize: "0.9rem",
                        color: "#666",
                    }}
                >
                    Teszt adat: admin@example.com / password
                </p>
            </div>
        </main>
    );
}

export default Login;
