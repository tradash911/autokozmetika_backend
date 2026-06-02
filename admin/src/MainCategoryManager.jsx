import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

const Container = styled.div``;
const Row = styled.div`
    display: flex;
    gap: 0.5rem;
`;
const Input = styled.input`
    flex: 1;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
`;
const Button = styled.button`
    padding: 0.5rem 1.5rem;
    background-color: ${(props) => (props.danger ? "#cc0000" : "#00aa00")};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;
const Alert = styled.div`
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;

export default function MainCategoryManager() {
    const [name, setName] = useState("");
    const queryClient = useQueryClient();

    const {
        data: mainCategories = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["mainCategories"],
        queryFn: async () => {
            const res = await fetch("/api/main-categories");
            if (!res.ok) throw new Error("Hiba a lekérés során");
            const json = await res.json();
            return json.data || json;
        },
    });

    const addMutation = useMutation({
        mutationFn: async (name) => {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/main-categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Hiba a hozzáadás során");
            }
            return res.json();
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["mainCategories"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`/api/main-categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Hiba a törlés során");
            return res.json();
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["mainCategories"] }),
    });

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addMutation.mutate(name, { onSuccess: () => setName("") });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Biztosan törlöd ezt a kategóriát?")) return;
        deleteMutation.mutate(id);
    };

    return (
        <Container>
            <h2>Fő Kategóriák Kezelése</h2>

            {error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {error.message}
                </Alert>
            )}
            {addMutation.isSuccess && (
                <Alert style={{ color: "green", backgroundColor: "#e0ffe0" }}>
                    Fő kategória sikeresen hozzáadva!
                </Alert>
            )}

            <form onSubmit={handleAdd} style={{ marginBottom: "2rem" }}>
                <Row>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Új fő kategória neve..."
                    />
                    <Button type="submit" disabled={addMutation.isLoading}>
                        {addMutation.isLoading ? "Hozzáadás..." : "Hozzáadás"}
                    </Button>
                </Row>
            </form>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                        <th
                            style={{
                                padding: "0.75rem",
                                textAlign: "left",
                                borderBottom: "2px solid #ccc",
                            }}
                        >
                            ID
                        </th>
                        <th
                            style={{
                                padding: "0.75rem",
                                textAlign: "left",
                                borderBottom: "2px solid #ccc",
                            }}
                        >
                            Név
                        </th>
                        <th
                            style={{
                                padding: "0.75rem",
                                textAlign: "center",
                                borderBottom: "2px solid #ccc",
                            }}
                        >
                            Műveletek
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan="3"
                                style={{ padding: "1rem", textAlign: "center" }}
                            >
                                Betöltés...
                            </td>
                        </tr>
                    ) : mainCategories.length === 0 ? (
                        <tr>
                            <td
                                colSpan="3"
                                style={{
                                    padding: "1rem",
                                    textAlign: "center",
                                    color: "#999",
                                }}
                            >
                                Nincsenek fő kategóriák
                            </td>
                        </tr>
                    ) : (
                        mainCategories.map((cat) => (
                            <tr
                                key={cat.id}
                                style={{ borderBottom: "1px solid #eee" }}
                            >
                                <td style={{ padding: "0.75rem" }}>{cat.id}</td>
                                <td style={{ padding: "0.75rem" }}>
                                    {cat.name}
                                </td>
                                <td
                                    style={{
                                        padding: "0.75rem",
                                        textAlign: "center",
                                    }}
                                >
                                    <Button
                                        danger
                                        onClick={() => handleDelete(cat.id)}
                                        disabled={deleteMutation.isLoading}
                                    >
                                        Törlés
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </Container>
    );
}
