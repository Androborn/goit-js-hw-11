import './sass/main.scss';
import { fetchImages } from './js/fetchImages.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('div.gallery'),
  moreButton: document.querySelector('button.load-more-btn'),
  searchButton: document.querySelector('button.search-btn'),
};

let fullSizeGallery = new SimpleLightbox('.gallery a');

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
    if (fatchedImages.hits <= 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    page += 1;
    refs.moreButton.hidden = false;
    refs.searchButton.blur();

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
  refs.searchForm.style.marginLeft = '17px';

  refs.gallery.innerHTML = fatchedImages.hits
    .map(image => {
      return `<a href="${image.largeImageURL}">
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes</b> ${image.likes}</p>
        <p class="info-item"><b>Views</b> ${image.views}</p>
        <p class="info-item"><b>Comments</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
      </div>
    </div>
  </a>`;
    })
    .join('');

  fullSizeGallery.refresh();

  fullSizeGallery.on(
    'shown.simplelightbox',
    () => (refs.gallery.style.overflow = 'hidden'),
  );
  fullSizeGallery.on(
    'close.simplelightbox',
    () => (refs.gallery.style.overflow = 'auto'),
  );
}

function addMoreCardsMarkup(fatchedImages) {
  const markup = fatchedImages.hits
    .map(image => {
      return `<a href="${image.largeImageURL}">
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes</b> ${image.likes}</p>
        <p class="info-item"><b>Views</b> ${image.views}</p>
        <p class="info-item"><b>Comments</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
      </div>
    </div>
  </a>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  fullSizeGallery.refresh();

  fullSizeGallery.on(
    'shown.simplelightbox',
    () => (refs.gallery.style.overflow = 'hidden'),
  );
  fullSizeGallery.on(
    'close.simplelightbox',
    () => (refs.gallery.style.overflow = 'auto'),
  );

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
