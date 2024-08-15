import axios from 'axios';

// Function to encode in Base64
const encodeBase64 = (value: string): string => {
    return btoa(value); // `btoa` converts strings to Base64 in the browser
};

const getAccessToken = async (): Promise<string> => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const auth = encodeBase64(`${clientId}:${clientSecret}`);

    try {
        const response = await axios.post<{ access_token: string }>(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

export default getAccessToken;