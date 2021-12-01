const axios = require('axios');
const BASE_URL = 'https://pixabay.com';
const API_KEY = '24437506-2bd4a91f2d86307f94e472b85';
const IMG_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const AGE_FILTER = 'true';
export const IMG_PER_PAGE = 40;

export class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  // change to async/await
  fetchImages() {
    axios.defaults.baseURL = BASE_URL;
    return axios
      .get('api/', {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: IMG_TYPE,
          orientation: ORIENTATION,
          safesearch: AGE_FILTER,
          per_page: IMG_PER_PAGE,
          page: this.page,
        },
      })
      .then(({ data }) => {
        this.incrementPage();
        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
}

// store array of fetched data

// new above==================================================================

// const axios = require('axios');

// export async function fetchImages(
//   userQuery,
//   page,
//   { API_KEY, IMG_TYPE, ORIENTATION, AGE_FILTER, IMG_PER_PAGE },
// ) {
//   try {
//     axios.defaults.baseURL = 'https://pixabay.com/api';
//     const response = await axios.get(
//       `?key=${API_KEY}&q=${userQuery}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safesearch=${AGE_FILTER}&per_page=${IMG_PER_PAGE}&page=${page}`,
//     );
//     return await response.data;
//   } catch (error) {
//     return error;
//   }
// }
