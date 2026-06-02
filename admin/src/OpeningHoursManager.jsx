import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

const Form = styled.form`
    display: grid;
    gap: 1rem;
`;

const Row = styled.div`
    display: grid;
    grid-template-columns: minmax(120px, 1fr) 140px 140px 110px;
    gap: 0.75rem;
    align-items: center;
    background-color: #fff;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const TimeTextInput = styled.input`
    width: 100%;
    padding: 0.55rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
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

const Alert = styled.div`
    padding: 0.75rem;
    border-radius: 4px;
`;

const days = [
    ["monday", "Hétfő"],
    ["tuesday", "Kedd"],
    ["wednesday", "Szerda"],
    ["thursday", "Csütörtök"],
    ["friday", "Péntek"],
    ["saturday", "Szombat"],
    ["sunday", "Vasárnap"],
];

const emptyHours = Object.fromEntries(
    days.map(([key]) => [key, { open_at: "", close_at: "", closed: false }]),
);

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function normalizeTime(value) {
    if (!value) return "";
    return value.slice(0, 5);
}

function validateHours(hours) {
    for (const [day, label] of days) {
        const item = hours[day];

        if (item.closed) continue;

        if (!item.open_at && !item.close_at) continue;

        if (!timePattern.test(item.open_at) || !timePattern.test(item.close_at)) {
            return `${label}: az időpontokat HH:MM formátumban add meg, például 08:00 vagy 16:00.`;
        }
    }

    return "";
}

export default function OpeningHoursManager() {
    const [hours, setHours] = useState(emptyHours);
    const [validationError, setValidationError] = useState("");
    const queryClient = useQueryClient();

    const { data: setting } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await fetch("/api/settings");
            if (!res.ok) throw new Error("Hiba a beállítások lekérése során");
            const json = await res.json();
            return (json.data || json)[0] || null;
        },
    });

    const {
        data: openingHours = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["openingHours"],
        queryFn: async () => {
            const res = await fetch("/api/opening-hours");
            if (!res.ok) throw new Error("Hiba a nyitvatartás lekérése során");
            const json = await res.json();
            return json.data || json;
        },
    });

    useEffect(() => {
        const nextHours = structuredClone(emptyHours);

        openingHours.forEach((item) => {
            if (setting && item.setting_id !== setting.id) return;
            if (!nextHours[item.day]) return;

            nextHours[item.day] = {
                id: item.id,
                open_at: normalizeTime(item.open_at),
                close_at: normalizeTime(item.close_at),
                closed: !item.open_at && !item.close_at,
            };
        });

        setHours(nextHours);
    }, [openingHours, setting]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("authToken");
            let activeSetting = setting;

            if (!activeSetting) {
                const settingRes = await fetch("/api/settings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({}),
                });

                if (!settingRes.ok) {
                    const data = await settingRes.json();
                    throw new Error(data.message || "Hiba a beállítás létrehozása során");
                }

                const json = await settingRes.json();
                activeSetting = json.data || json;
            }

            await Promise.all(
                days.map(async ([day]) => {
                    const item = hours[day];
                    const payload = {
                        setting_id: activeSetting.id,
                        day,
                        open_at: item.closed ? null : item.open_at || null,
                        close_at: item.closed ? null : item.close_at || null,
                    };

                    const url = item.id ? `/api/opening-hours/${item.id}` : "/api/opening-hours";
                    const method = item.id ? "PUT" : "POST";

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
                        throw new Error(data.message || "Hiba a nyitvatartás mentése során");
                    }

                    return res.json();
                }),
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            queryClient.invalidateQueries({ queryKey: ["openingHours"] });
        },
    });

    const updateDay = (day, patch) => {
        setValidationError("");
        setHours((current) => ({
            ...current,
            [day]: { ...current[day], ...patch },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errorMessage = validateHours(hours);
        if (errorMessage) {
            setValidationError(errorMessage);
            return;
        }

        saveMutation.mutate();
    };

    if (isLoading) {
        return <p>Betöltés...</p>;
    }

    return (
        <div>
            <h2>Nyitvatartás</h2>

            {error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {error.message}
                </Alert>
            )}

            {validationError && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {validationError}
                </Alert>
            )}

            {saveMutation.isSuccess && (
                <Alert style={{ color: "green", backgroundColor: "#e0ffe0" }}>
                    Nyitvatartás mentve.
                </Alert>
            )}

            {saveMutation.error && (
                <Alert style={{ color: "red", backgroundColor: "#ffe0e0" }}>
                    {saveMutation.error.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {days.map(([day, label]) => (
                    <Row key={day}>
                        <strong>{label}</strong>
                        <label>
                            Nyitás
                            <TimeTextInput
                                type="text"
                                inputMode="numeric"
                                placeholder="08:00"
                                value={hours[day].open_at}
                                disabled={hours[day].closed}
                                onChange={(e) => updateDay(day, { open_at: e.target.value })}
                            />
                        </label>
                        <label>
                            Zárás
                            <TimeTextInput
                                type="text"
                                inputMode="numeric"
                                placeholder="16:00"
                                value={hours[day].close_at}
                                disabled={hours[day].closed}
                                onChange={(e) => updateDay(day, { close_at: e.target.value })}
                            />
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={hours[day].closed}
                                onChange={(e) => updateDay(day, { closed: e.target.checked })}
                            />{" "}
                            Zárva
                        </label>
                    </Row>
                ))}

                <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Mentés..." : "Mentés"}
                </Button>
            </Form>
        </div>
    );
}
