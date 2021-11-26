const axios = require('axios');

export async function fetchImages(
  userQuery,
  page,
  { API_KEY, IMG_TYPE, ORIENTATION, AGE_FILTER, IMG_PER_PAGE },
) {
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
