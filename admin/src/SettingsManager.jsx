import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

const Form = styled.form`
    display: grid;
    gap: 1rem;
    background-color: #fff;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Field = styled.div`
    display: grid;
    gap: 0.4rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.55rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
`;

const Textarea = styled.textarea`
    width: 100%;
    min-height: 90px;
    padding: 0.55rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: vertical;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const Alert = styled.div`
    padding: 0.75rem;
    border-radius: 4px;
`;

const Button = styled.button`
    justify-self: start;
    padding: 0.75rem 1.5rem;
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const emptyForm = {
    address: "",
    phone_number: "",
    email_address: "",
    tik_tok_url: "",
    facebook_url: "",
    instagram_url: "",
    x_url: "",
    youtube_url: "",
};

const fields = [
    ["phone_number", "Telefonszám", "tel"],
    ["email_address", "Email cím", "email"],
    ["tik_tok_url", "TikTok URL", "url"],
    ["facebook_url", "Facebook URL", "url"],
    ["instagram_url", "Instagram URL", "url"],
    ["x_url", "X URL", "url"],
    ["youtube_url", "YouTube URL", "url"],
];

export default function SettingsManager() {
    const [form, setForm] = useState(emptyForm);
    const queryClient = useQueryClient();

    const {
        data: setting,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await fetch("/api/settings");
            if (!res.ok) throw new Error("Hiba a beállítások lekérése során");
            const json = await res.json();
            return (json.data || json)[0] || null;
        },
    });

    useEffect(() => {
        if (!setting) return;

        setForm({
            address: setting.address || "",
            phone_number: setting.phone_number || "",
            email_address: setting.email_address || "",
            tik_tok_url: setting.tik_tok_url || "",
            facebook_url: setting.facebook_url || "",
            instagram_url: setting.instagram_url || "",
            x_url: setting.x_url || "",
            youtube_url: setting.youtube_url || "",
        });
    }, [setting]);

    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            const token = localStorage.getItem("authToken");
            const url = setting ? `/api/settings/${setting.id}` : "/api/settings";
            const method = setting ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Hiba a mentés során");
            }

            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
    });

    const handleChange = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(form);
    };

    if (isLoading) {
        return <p>Betöltés...</p>;
    }

    return (
        <div>
            <h2>Beállítások</h2>

            {error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {error.message}
                </Alert>
            )}

            {saveMutation.isSuccess && (
                <Alert style={{ color: "green", backgroundColor: "#e0ffe0" }}>
                    Beállítások mentve.
                </Alert>
            )}

            {saveMutation.error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {saveMutation.error.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Field>
                    <label htmlFor="address">Cím</label>
                    <Textarea
                        id="address"
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </Field>

                <Grid>
                    {fields.map(([key, label, type]) => (
                        <Field key={key}>
                            <label htmlFor={key}>{label}</label>
                            <Input
                                id={key}
                                type={type}
                                value={form[key]}
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                        </Field>
                    ))}
                </Grid>

                <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Mentés..." : "Mentés"}
                </Button>
            </Form>
        </div>
    );
}
