// src/services/spotify.js
import axios from "axios";

const SPOTIFY_API = "https://api.spotify.com/v1";
const AUTH_ENDPOINT = "https://accounts.spotify.com/api/token";

class SpotifyService {
  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpirationTime = 0;
  }

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpirationTime) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        AUTH_ENDPOINT,
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + btoa(`${this.clientId}:${this.clientSecret}`),
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
      return this.accessToken;
    } catch (error) {
      console.error("Error getting Spotify access token:", error);
      throw error;
    }
  }

  async makeApiRequest(endpoint, method = "GET", data = null) {
    try {
      const token = await this.getAccessToken();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const config = {
        method,
        url: `${SPOTIFY_API}${endpoint}`,
        headers,
      };

      if (data && (method === "POST" || method === "PUT")) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Spotify API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // IMPORTANT: Only using endpoints that work with Client Credentials flow
  async getNewReleases(limit = 10, country = "US") {
    try {
      return await this.makeApiRequest(
        `/browse/new-releases?limit=${limit}&country=${country}`
      );
    } catch (error) {
      console.error("Failed to get new releases:", error);
      throw error;
    }
  }

  async getFeaturedPlaylists(limit = 10, country = "US") {
    try {
      return await this.makeApiRequest(
        `/browse/featured-playlists?limit=${limit}&country=${country}`
      );
    } catch (error) {
      console.error("Failed to get featured playlists:", error);
      throw error;
    }
  }

  // This endpoint requires no special permissions
  async getCategories(limit = 10, country = "US") {
    try {
      return await this.makeApiRequest(
        `/browse/categories?limit=${limit}&country=${country}`
      );
    } catch (error) {
      console.error("Failed to get categories:", error);
      throw error;
    }
  }

  // Using search instead of popular tracks - works with client credentials
  async getPopularGenreTracks(genre = "pop", limit = 10) {
    try {
      return await this.makeApiRequest(
        `/search?q=genre:${genre}&type=track&limit=${limit}`
      );
    } catch (error) {
      console.error(`Failed to get ${genre} tracks:`, error);
      throw error;
    }
  }

  async searchTracks(query, limit = 10) {
    try {
      return await this.makeApiRequest(
        `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`
      );
    } catch (error) {
      console.error("Failed to search tracks:", error);
      throw error;
    }
  }

  async getTrack(trackId) {
    try {
      return await this.makeApiRequest(`/tracks/${trackId}`);
    } catch (error) {
      console.error(`Failed to get track ${trackId}:`, error);
      throw error;
    }
  }

  async getAlbum(albumId) {
    try {
      return await this.makeApiRequest(`/albums/${albumId}`);
    } catch (error) {
      console.error(`Failed to get album ${albumId}:`, error);
      throw error;
    }
  }
}

const spotifyService = new SpotifyService();
export default spotifyService;
