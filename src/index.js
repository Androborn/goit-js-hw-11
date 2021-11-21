import './sass/main.scss';
import { fetchImages } from './js/fetchImages.js';
import Notiflix from 'notiflix';

const axios = require('axios');

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('div.gallery'),
  moreButton: document.querySelector('button.load-more'),
};

let page = 1;
let searchQuery = '';
// remove after refactoring HTTP module URLSearchParams
const IMG_PER_PAGE = 40;

refs.searchForm.addEventListener('submit', getImages);
refs.moreButton.addEventListener('click', getMoreImages);

refs.moreButton.hidden = true;

function getImages(e) {
  e.preventDefault();

  searchQuery = refs.searchForm.searchQuery.value;

  fetchImages(searchQuery, page).then(fatchedImages => {
    console.log(fatchedImages);

    if (fatchedImages.hits <= 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    page += 1;
    refs.moreButton.hidden = false;

    Notiflix.Notify.success(
      `Hooray! We found ${fatchedImages.totalHits} images.`,
    );

    return addCardsMarkup(fatchedImages);
  });
}

function getMoreImages() {
  fetchImages(searchQuery, page)
    .then(fatchedImages => {
      page += 1;

      if (page > parseInt(fatchedImages.totalHits / IMG_PER_PAGE) + 1) {
        return Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results.",
          (refs.moreButton.hidden = true),
        );
      }

      return addMoreCardsMarkup(fatchedImages);
    })
    .catch(error => {
      console.log(error);
    });
}

function addCardsMarkup(fatchedImages) {
  refs.gallery.innerHTML = fatchedImages.hits
    .map(image => {
      return `<div class="photo-card">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"><b>Likes</b> ${image.likes}</p>
      <p class="info-item"><b>Views</b> ${image.views}</p>
      <p class="info-item"><b>Comments</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
    </div>
  </div>`;
    })
    .join('');
}

function addMoreCardsMarkup(fatchedImages) {
  const markup = fatchedImages.hits
    .map(image => {
      return `<div class="photo-card">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"><b>Likes</b> ${image.likes}</p>
      <p class="info-item"><b>Views</b> ${image.views}</p>
      <p class="info-item"><b>Comments</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
    </div>
  </div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
