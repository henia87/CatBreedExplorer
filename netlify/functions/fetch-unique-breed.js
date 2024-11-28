exports.handler = async function(event, context) {
    const api_key = process.env.API_KEY;
    console.log('API Key:', api_key);
    const breedId = event.queryStringParameters.breed;

    if(!breedId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing breed ID" })
        };
    }

    try {
        const breedResponse = await fetch(`https://api.thecatapi.com/v1/breeds/${breedId}?api_key=${api_key}`);
        const breedData = await breedResponse.json();

        const imageUrl = breedData.reference_image_id ? `https://api.thecatapi.com/v1/images/${breedData.reference_image_id}?api_key=${api_key}` : "./images/cat-line-icon.jpg";

        const imageResponse = breedData.reference_image_id ? await fetch(imageUrl) : null;
        const imageData = imageResponse ? await imageResponse.json() : { url: imageUrl };

        return {
            statusCode: 200,
            body: JSON.stringify({
                breed: breedData,
                imageUrl: imageData.url || "./images/cat-line-icon.jpg"
            })
        };
    }
    catch(error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};