import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiService from './http-services/pixabay-api-service.js';
import createImgCards from './templates/gallery-card-template.js';
import SearchBtn from './components/search-btn.js';

const fullSizeGallery = new SimpleLightbox('.gallery a');
const pixabayApiService = new PixabayApiService();

const searchBtn = new SearchBtn({
  selector: 'form > button.search-btn',
  name: 'Search',
  loading: true,
});
const loadMoreBtn = new SearchBtn({
  selector: 'body > button.search-btn',
  name: 'Load more',
  hidden: true,
});

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('div.gallery'),
};
const { searchForm, gallery } = refs;

searchForm.addEventListener('submit', getImages);
// delegates included button click to form
searchBtn.refs.btn.addEventListener('click', () => searchForm.requestSubmit());
loadMoreBtn.refs.btn.addEventListener('click', getMoreImages);
// blur doesnt work
searchForm.addEventListener('input', () => searchBtn.enableBtn());

function getImages(e) {
  e.preventDefault();

  searchBtn.enableLoadState();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value;

  pixabayApiService.resetPage();
  scrollToPageStart();

  pixabayApiService.fetchImages().then(data => {
    validateQueryStatus(data);
    clearGallery();
    addCardsMarkup(data);

    searchBtn.disableLoadState();
    searchBtn.disableBtn();
    loadMoreBtn.showBtn();
    loadMoreBtn.disableLoadState();
    searchForm.elements.searchQuery.blur();
  });
}

function getMoreImages() {
  loadMoreBtn.enableLoadState();

  pixabayApiService.fetchImages().then(data => {
    validateQueryStatus(data);
    addCardsMarkup(data);
    scrollToNewCards();

    loadMoreBtn.disableLoadState();
  });
}

function addCardsMarkup(data) {
  searchForm.classList.remove('scroll-padding');

  gallery.insertAdjacentHTML('beforeend', createImgCards(data));
  fullSizeGallery.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
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

function validateQueryStatus(data) {
  if (data.name === 'Error') {
    return notifySearchError(data);
  }
  if (data.hits.length === 0) {
    loadMoreBtn.hideBtn();
    return notifySearchUnSuccess();
  }
  if (data.hits.length !== 0 && gallery.childElementCount === 0) {
    notifySearchSuccess(data);
  }
  if (pixabayApiService.page > Math.ceil(data.totalHits / data.hits.length)) {
    notifySearchEnd();
    loadMoreBtn.hideBtn();
  }
}

function notifySearchUnSuccess() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function notifySearchSuccess(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function notifySearchEnd() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results.",
  );
}

function notifySearchError(error) {
  Notiflix.Notify.failure(
    `Error in running search. Please retry. If error repeat contact admin: ${error}`,
  );
}