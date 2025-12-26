
const key = "AIzaSyDyp56-0B2iszL7Exe7LVlzEBYhwLgGvdA";
// Using a model found in the list
const model = "gemini-2.0-flash";

async function testParam(modelName) {
    console.log(`Testing model: ${modelName}`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

    const payload = {
        contents: [{
            parts: [{ text: "Hello, reply with OK" }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(`Status: ${response.status}`);
        if (response.ok) {
            console.log("Success!");
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.error("Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

await testParam(model);
