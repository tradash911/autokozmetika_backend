import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

const emptyForm = {
    id: null,
    title: "",
    body: "",
    img_url: "",
};

const Form = styled.form`
    display: grid;
    gap: 1rem;
    background-color: #fff;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 2rem;
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
    min-height: 180px;
    padding: 0.55rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: vertical;
`;

const ButtonRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: ${(props) => (props.$danger ? "#cc0000" : props.$secondary ? "#666" : "#0066cc")};
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

const Preview = styled.img`
    width: 160px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #ddd;
`;

const TableWrap = styled.div`
    overflow-x: auto;
`;

async function uploadBlogImage(file) {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/blog-images", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Hiba a kép feltöltése során");
    }

    return res.json();
}

export default function BlogManager() {
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const queryClient = useQueryClient();

    const {
        data: blogs = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const res = await fetch("/api/blogs");
            if (!res.ok) throw new Error("Hiba a blogok lekérése során");
            const json = await res.json();
            return json.data || json;
        },
    });

    const saveMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("authToken");
            let imgUrl = form.img_url;

            if (imageFile) {
                const uploaded = await uploadBlogImage(imageFile);
                imgUrl = uploaded.img_url;
            }

            const payload = {
                title: form.title,
                body: form.body,
                img_url: imgUrl || null,
            };

            const url = form.id ? `/api/blogs/${form.id}` : "/api/blogs";
            const method = form.id ? "PUT" : "POST";

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
                throw new Error(data.message || "Hiba a blog mentése során");
            }

            return res.json();
        },
        onSuccess: () => {
            setForm(emptyForm);
            setImageFile(null);
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`/api/blogs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Hiba a blog törlése során");
        },
        onSuccess: () => {
            setForm(emptyForm);
            setImageFile(null);
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    const handleChange = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate();
    };

    const handleEdit = (blog) => {
        setForm({
            id: blog.id,
            title: blog.title || "",
            body: blog.body || "",
            img_url: blog.img_url || "",
        });
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Biztosan törlöd ezt a blogbejegyzést?")) return;
        deleteMutation.mutate(id);
    };

    return (
        <div>
            <h2>Blog</h2>

            {error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {error.message}
                </Alert>
            )}

            {saveMutation.isSuccess && (
                <Alert style={{ color: "green", backgroundColor: "#e0ffe0" }}>
                    Blogbejegyzés mentve.
                </Alert>
            )}

            {saveMutation.error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {saveMutation.error.message}
                </Alert>
            )}

            {deleteMutation.error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {deleteMutation.error.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <h3>{form.id ? "Blogbejegyzés szerkesztése" : "Új blogbejegyzés"}</h3>

                <Field>
                    <label htmlFor="blog-title">Cím</label>
                    <Input
                        id="blog-title"
                        type="text"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        required
                    />
                </Field>

                <Field>
                    <label htmlFor="blog-body">Szöveg</label>
                    <Textarea
                        id="blog-body"
                        value={form.body}
                        onChange={(e) => handleChange("body", e.target.value)}
                        required
                    />
                </Field>

                <Field>
                    <label htmlFor="blog-image">Kép feltöltése</label>
                    <Input
                        id="blog-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                </Field>

                {form.img_url && <Preview src={form.img_url} alt="" />}

                <ButtonRow>
                    <Button type="submit" disabled={saveMutation.isPending}>
                        {saveMutation.isPending ? "Mentés..." : "Mentés"}
                    </Button>
                    {form.id && (
                        <Button
                            type="button"
                            $secondary
                            onClick={() => {
                                setForm(emptyForm);
                                setImageFile(null);
                            }}
                        >
                            Mégse
                        </Button>
                    )}
                </ButtonRow>
            </Form>

            <h3>Blogbejegyzések</h3>
            <TableWrap>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Kép</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Cím</th>
                            <th style={{ padding: "0.75rem", textAlign: "left" }}>Létrehozva</th>
                            <th style={{ padding: "0.75rem", textAlign: "center" }}>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" style={{ padding: "1rem", textAlign: "center" }}>
                                    Betöltés...
                                </td>
                            </tr>
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    style={{ padding: "1rem", textAlign: "center", color: "#999" }}
                                >
                                    Nincsenek blogbejegyzések
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <tr key={blog.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "0.75rem" }}>
                                        {blog.img_url ? <Preview src={blog.img_url} alt="" /> : "-"}
                                    </td>
                                    <td style={{ padding: "0.75rem" }}>{blog.title}</td>
                                    <td style={{ padding: "0.75rem" }}>
                                        {blog.created_at
                                            ? new Date(blog.created_at).toLocaleDateString("hu-HU")
                                            : "-"}
                                    </td>
                                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                                        <ButtonRow style={{ justifyContent: "center" }}>
                                            <Button type="button" $secondary onClick={() => handleEdit(blog)}>
                                                Szerkesztés
                                            </Button>
                                            <Button
                                                type="button"
                                                $danger
                                                disabled={deleteMutation.isPending}
                                                onClick={() => handleDelete(blog.id)}
                                            >
                                                Törlés
                                            </Button>
                                        </ButtonRow>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </TableWrap>
        </div>
    );
}
