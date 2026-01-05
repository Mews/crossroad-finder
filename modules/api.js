export async function callApi(payload) {
    const api = 'https://mews.pythonanywhere.com/crossroad-finder/'

    const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const jsonData = await response.json();

    return jsonData;
}
