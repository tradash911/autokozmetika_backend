import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

const Container = styled.div``;
const Form = styled.form`
    margin-bottom: 2rem;
    background-color: #fff;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
`;
const Alert = styled.div`
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;
const Grid3 = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
`;

function CategoryManager() {
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priceNormal, setPriceNormal] = useState("");
    const [priceMedium, setPriceMedium] = useState("");
    const [priceLarge, setPriceLarge] = useState("");

    const queryClient = useQueryClient();

    const { data: mainCategories = [] } = useQuery({
        queryKey: ["mainCategories"],
        queryFn: async () => {
            const res = await fetch("/api/main-categories");
            if (!res.ok) throw new Error("Hiba a lekérés során");
            const json = await res.json();
            return json.data || json;
        },
    });

    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories", selectedMainCategoryId],
        queryFn: async () => {
            if (!selectedMainCategoryId) return [];
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Hiba a lekérés során");
            const json = await res.json();
            return (json.data || json).filter(
                (cat) =>
                    cat.main_category_id === parseInt(selectedMainCategoryId),
            );
        },
        enabled: !!selectedMainCategoryId,
    });

    const addMutation = useMutation({
        mutationFn: async (payload) => {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Hiba a hozzáadás során");
            }
            return res.json();
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Hiba a törlés során");
            return res.json();
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("A név megadása kötelező");
        if (!selectedMainCategoryId) return alert("Válassz egy fő kategóriát");

        addMutation.mutate(
            {
                name,
                description,
                price_normal: priceNormal ? parseFloat(priceNormal) : 0,
                price_medium: priceMedium ? parseFloat(priceMedium) : 0,
                price_large: priceLarge ? parseFloat(priceLarge) : 0,
                main_category_id: parseInt(selectedMainCategoryId),
            },
            {
                onSuccess: () => {
                    setName("");
                    setDescription("");
                    setPriceNormal("");
                    setPriceMedium("");
                    setPriceLarge("");
                },
            },
        );
    };

    const handleDelete = (id) => {
        if (!window.confirm("Biztosan törlöd ezt a kategóriát?")) return;
        deleteMutation.mutate(id);
    };

    return (
        <div>
            <h2>Kategóriák Kezelése</h2>

            {addMutation.error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {addMutation.error.message}
                </Alert>
            )}
            {deleteMutation.error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {deleteMutation.error.message}
                </Alert>
            )}
            {addMutation.isSuccess && (
                <Alert style={{ color: "green", backgroundColor: "#e0ffe0" }}>
                    Kategória sikeresen hozzáadva!
                </Alert>
            )}
            {deleteMutation.isSuccess && (
                <Alert style={{ color: "green", backgroundColor: "#e0ffe0" }}>
                    Kategória sikeresen törölve!
                </Alert>
            )}

            <div style={{ marginBottom: "2rem" }}>
                <label
                    htmlFor="main-category"
                    style={{ display: "block", marginBottom: "0.5rem" }}
                >
                    Válassz fő kategóriát:
                </label>
                <select
                    id="main-category"
                    value={selectedMainCategoryId}
                    onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        maxWidth: "300px",
                    }}
                >
                    <option value="">-- Válassz --</option>
                    {mainCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedMainCategoryId && (
                <>
                    <form
                        onSubmit={handleAddCategory}
                        style={{
                            marginBottom: "2rem",
                            backgroundColor: "#fff",
                            padding: "1rem",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    >
                        <h3>Új Kategória Hozzáadása</h3>

                        <div style={{ marginBottom: "1rem" }}>
                            <label
                                htmlFor="name"
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                Név:
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Kategória neve..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label
                                htmlFor="description"
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                Leírás:
                            </label>
                            <textarea
                                id="description"
                                placeholder="Kategória leírása..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    boxSizing: "border-box",
                                    minHeight: "80px",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "0.75rem",
                                marginBottom: "1rem",
                            }}
                        >
                            <div>
                                <label
                                    htmlFor="priceNormal"
                                    style={{
                                        display: "block",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Normál ár:
                                </label>
                                <input
                                    id="priceNormal"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={priceNormal}
                                    onChange={(e) =>
                                        setPriceNormal(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="priceMedium"
                                    style={{
                                        display: "block",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Közepes ár:
                                </label>
                                <input
                                    id="priceMedium"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={priceMedium}
                                    onChange={(e) =>
                                        setPriceMedium(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="priceLarge"
                                    style={{
                                        display: "block",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Nagy ár:
                                </label>
                                <input
                                    id="priceLarge"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={priceLarge}
                                    onChange={(e) =>
                                        setPriceLarge(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={addMutation.isLoading}
                            style={{
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#00aa00",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: addMutation.isLoading
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: addMutation.isLoading ? 0.6 : 1,
                            }}
                        >
                            {addMutation.isLoading
                                ? "Hozzáadás..."
                                : "Hozzáadás"}
                        </button>
                    </form>

                    <h3>Kategóriák Listája</h3>
                    <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                    >
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
                                        textAlign: "left",
                                        borderBottom: "2px solid #ccc",
                                    }}
                                >
                                    Leírás
                                </th>
                                <th
                                    style={{
                                        padding: "0.75rem",
                                        textAlign: "left",
                                        borderBottom: "2px solid #ccc",
                                    }}
                                >
                                    Normál
                                </th>
                                <th
                                    style={{
                                        padding: "0.75rem",
                                        textAlign: "left",
                                        borderBottom: "2px solid #ccc",
                                    }}
                                >
                                    Közepes
                                </th>
                                <th
                                    style={{
                                        padding: "0.75rem",
                                        textAlign: "left",
                                        borderBottom: "2px solid #ccc",
                                    }}
                                >
                                    Nagy
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
                            {categoriesLoading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            padding: "1rem",
                                            textAlign: "center",
                                        }}
                                    >
                                        Betöltés...
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            padding: "1rem",
                                            textAlign: "center",
                                            color: "#999",
                                        }}
                                    >
                                        Nincsenek kategóriák ebben a fő
                                        kategóriában
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr
                                        key={cat.id}
                                        style={{
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        <td style={{ padding: "0.75rem" }}>
                                            {cat.id}
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            {cat.name}
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            {cat.description || "-"}
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            {cat.price_normal
                                                ? cat.price_normal + " Ft"
                                                : "-"}
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            {cat.price_medium
                                                ? cat.price_medium + " Ft"
                                                : "-"}
                                        </td>
                                        <td style={{ padding: "0.75rem" }}>
                                            {cat.price_large
                                                ? cat.price_large + " Ft"
                                                : "-"}
                                        </td>
                                        <td
                                            style={{
                                                padding: "0.75rem",
                                                textAlign: "center",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    handleDelete(cat.id)
                                                }
                                                style={{
                                                    padding: "0.4rem 0.8rem",
                                                    backgroundColor: "#cc0000",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Törlés
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default CategoryManager;
