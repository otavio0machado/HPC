
const key = "AIzaSyDyp56-0B2iszL7Exe7LVlzEBYhwLgGvdA";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        if (response.ok) {
            console.log("Models found:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("Error listing models:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

listModels();
