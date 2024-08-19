import axios from 'axios';
import getAccessToken from '../auth/auth';

export const fetchSpotifyItemDetails = async (id: string) => {
    const token = await getAccessToken();
    const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};