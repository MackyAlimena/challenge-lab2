import axios from 'axios';
import getAccessToken from '../auth/auth';

export const fetchSpotifyItems = async (page: number) => {
    const token = await getAccessToken();
    const response = await axios.get(
        `https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks`,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: 10,
                offset: (page - 1) * 10,
            },
        }
    );
    return response.data.items.map((item: any) => ({
        ...item.track,
        popularity: item.track.popularity // Ensure popularity is included
    }));
};