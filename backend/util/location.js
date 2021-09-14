const axios = require('axios')

const API_KEY = 'pk.eyJ1IjoibW9oYW1lZDMzMSIsImEiOiJjazBzZ3NnczgwMmh1M2pwN2Fvd3Nmdmh3In0.Qx3Ex0yWDq9_nGhtlhErUw'

async function getCordsforAddress(address) {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${API_KEY}`);

    const data = response.data
        
    if (!data || data.status === 'Zero-results') {
        console.log('error occured bitch');
    }

    const coordinates = data.features[0].geometry.coordinates
    return coordinates
}

module.exports = getCordsforAddress


