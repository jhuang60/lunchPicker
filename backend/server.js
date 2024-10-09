const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const axios = require('axios');
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Your RapidAPI key
const YELP_API_KEY = process.env.YELP_API_KEY;

app.get('/api/restaurants', async (req, res) => {
    const { latitude, longitude, radius } = req.query;
    // Validate input
    if (!latitude || !longitude) {
        return res.status(400).json({ message: `Latitude and longitude are required! ${latitude}, ${longitude}`});
    }

    const options = {
        method: 'GET',
        url: 'https://api.yelp.com/v3/businesses/search',
        headers: {
            Authorization: `Bearer ${YELP_API_KEY}`,
        },
        params: {
            latitude: latitude, 
            longitude: longitude,  
            radius: radius,        
            categories: 'restaurants',
            sort_by: 'rating',   
        },
    };

    try {
        const response = await axios.request(options);
        res.json(response.data); // Send the Yelp API response to the frontend
    } catch (error) {
        console.error('Error fetching data from Yelp API:', error);
        res.status(500).json({ message: `Failed to retrieve restaurants. ${latitude}, ${longitude}` });
    }
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});