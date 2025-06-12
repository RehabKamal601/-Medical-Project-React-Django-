const BASE_URL = "http://127.0.0.1:8000/api"; // Django API base

export const getWithAuth = async (endpoint, token) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
};

export const postWithAuth = async (endpoint, data, token, method = "POST") => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deleteWithAuth = async (endpoint, token) => {
    return fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
