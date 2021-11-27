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
const { searchForm, gallery, moreButton, searchButton } = refs;
const urlSearchParams = {
  API_KEY: '24437506-2bd4a91f2d86307f94e472b85',
  IMG_TYPE: 'photo',
  ORIENTATION: 'horizontal',
  AGE_FILTER: 'true',
  IMG_PER_PAGE: 40,
};
const { API_KEY, IMG_TYPE, ORIENTATION, AGE_FILTER, IMG_PER_PAGE } =
  urlSearchParams;
let page = 0;
let searchQuery = '';
let fullSizeGallery = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', getImages);
moreButton.addEventListener('click', getMoreImages);

moreButton.hidden = true;

fullSizeGallery.on(
  'shown.simplelightbox',
  () => (gallery.style.overflow = 'hidden'),
);
fullSizeGallery.on(
  'close.simplelightbox',
  () => (gallery.style.overflow = 'auto'),
);

async function getImages(e) {
  e.preventDefault();

  page += 1;
  searchButton.blur();
  recordUserQuery();

  if (gallery.children !== 0) {
    scrollToPageStart();
    gallery.innerHTML = '';
  }

  await processFetchedData();
}

async function getMoreImages() {
  page += 1;

  await processFetchedData();

  scrollToNewCards();
}

function processFetchedData() {
  return fetchImages(searchQuery, page, urlSearchParams)
    .then(fatchedImages => {
      toggleMoreBtnVisibility(fatchedImages);

      if (fatchedImages.hits <= 0) {
        return notifySearchUnSuccess();
      }

      if (gallery.children !== 0) {
        notifySearchSuccess(fatchedImages);
      }

      if (page > Math.ceil(fatchedImages.totalHits / IMG_PER_PAGE)) {
        notifySearchEnd();
      }

      return addCardsMarkup(fatchedImages);
    })
    .catch(error => {
      console.log(error);
    });
}

function recordUserQuery() {
  searchQuery = searchForm.searchQuery.value;
}

function notifySearchUnSuccess() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function notifySearchSuccess(fatchedImages) {
  Notiflix.Notify.success(
    `Hooray! We found ${fatchedImages.totalHits} images.`,
  );
}

function notifySearchEnd() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results.",
  );
}

function toggleMoreBtnVisibility(fatchedImages) {
  if (moreButton.hidden === true && fatchedImages.hits <= 0) {
    return (moreButton.hidden = true);
  }

  moreButton.hidden = false;
}

function scrollToPageStart() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToNewCards() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function addCardsMarkup(fatchedImages) {
  searchForm.style.marginLeft = '17px';

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

  if (gallery.children === 0) {
    return (gallery.innerHTML = markup);
  }
  gallery.insertAdjacentHTML('beforeend', markup);

  fullSizeGallery.refresh();
}
