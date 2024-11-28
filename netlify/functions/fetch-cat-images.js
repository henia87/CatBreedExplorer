exports.handler = async function(event, context) {
    const api_key = process.env.API_KEY;
    
    try {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=20&size=full&api_key=${api_key}`);
        const data = await response.json();
    
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    }
    catch(error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};