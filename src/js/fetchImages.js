const API_KEY = '24437506-2bd4a91f2d86307f94e472b85';
const URL = `https://pixabay.com/api/`;
// get parameters out of this module = make an object to stringify URLSearchParams
const IMG_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const AGE_FILTER = 'true';
const IMG_PER_PAGE = 40;

const axios = require('axios');

export async function fetchImages(userQuery, page) {
  try {
    axios.defaults.baseURL = 'https://pixabay.com/api';
    const response = await axios.get(
      `?key=${API_KEY}&q=${userQuery}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safesearch=${AGE_FILTER}&per_page=${IMG_PER_PAGE}&page=${page}`,
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
