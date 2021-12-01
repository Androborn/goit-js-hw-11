// // import './sass/main.scss';
// import { fetchImages } from './http-services/fetchImages.js';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const refs = {
//   searchForm: document.querySelector('#search-form'),
//   gallery: document.querySelector('div.gallery'),
//   moreButton: document.querySelector('button.load-more-btn'),
//   searchButton: document.querySelector('button.search-btn'),
// };
// const { searchForm, gallery, moreButton, searchButton } = refs;
// const urlSearchParams = {
//   API_KEY: '24437506-2bd4a91f2d86307f94e472b85',
//   IMG_TYPE: 'photo',
//   ORIENTATION: 'horizontal',
//   AGE_FILTER: 'true',
//   IMG_PER_PAGE: 40,
// };
// const { API_KEY, IMG_TYPE, ORIENTATION, AGE_FILTER, IMG_PER_PAGE } =
//   urlSearchParams;
// let page = 0;
// let searchQuery = '';
// let fullSizeGallery = new SimpleLightbox('.gallery a');

// searchForm.addEventListener('submit', getImages);
// moreButton.addEventListener('click', getMoreImages);
// searchForm.addEventListener('input', enableSearch);

// // togle button as class method (via class?)
// moreButton.hidden = true;

// async function getImages(e) {
//   e.preventDefault();

//   // reset page as class method
//   page = 1;
//   searchButton.blur();
//   // togle button as class method
//   searchButton.disabled = true;
//   recordUserQuery();

//   if (gallery.children !== 0) {
//     scrollToPageStart();
//     // put injection type into the class method of markup generation plugin
//     gallery.innerHTML = '';
//   }

//   await processFetchedData();
// }

// async function getMoreImages() {
//   // imcrease page as class method
//   page += 1;

//   await processFetchedData();

//   scrollToNewCards();
// }

// // togle button as class method
// function enableSearch() {
//   searchButton.disabled = false;
// }

// async function processFetchedData() {
//   const data = await fetchImages(searchQuery, page, urlSearchParams);

//   // toggle on class method for button
//   toggleMoreBtnVisibility(data);

//   console.dir(data);

//   if (data.name === 'Error') {
//     return notifySearchError(data);
//   }
//   if (data.hits <= 0) {
//     return notifySearchUnSuccess();
//   }
//   if (page === 1) {
//     notifySearchSuccess(data);
//   }
//   if (page > Math.ceil(data.totalHits / IMG_PER_PAGE)) {
//     notifySearchEnd();
//   }

//   addCardsMarkup(data);
// }

// function recordUserQuery() {
//   searchQuery = searchForm.searchQuery.value.trim();
// }

// function notifySearchUnSuccess() {
//   Notiflix.Notify.failure(
//     'Sorry, there are no images matching your search query. Please try again.',
//   );
// }

// function notifySearchSuccess(data) {
//   Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
// }

// function notifySearchEnd() {
//   Notiflix.Notify.info(
//     "We're sorry, but you've reached the end of search results.",
//   );
// }

// function notifySearchError(error) {
//   Notiflix.Notify.failure(
//     `Error in running search. Please retry. If error repeat contact admin: ${error}`,
//   );
// }

// // toggle on class method for button
// function toggleMoreBtnVisibility(data) {
//   if (moreButton.hidden === true && data.hits <= 0) {
//     return (moreButton.hidden = true);
//   }

//   moreButton.hidden = false;
// }

// function scrollToPageStart() {
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// }

// function scrollToNewCards() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// function addCardsMarkup(data) {
//   searchForm.style.marginLeft = '17px';

//   const markup = data.hits
//     .map(image => {
//       return `<a class="photo-card" href="${image.largeImageURL}">
//       <img class="thumb-img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
//       <div class="info">
//         <p class="info-item"><b>Likes</b> ${image.likes}</p>
//         <p class="info-item"><b>Views</b> ${image.views}</p>
//         <p class="info-item"><b>Comments</b> ${image.comments}</p>
//         <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
//       </div>
//   </a>`;
//     })
//     .join('');

//   if (gallery.children === 0) {
//     return (gallery.innerHTML = markup);
//   }
//   gallery.insertAdjacentHTML('beforeend', markup);

//   fullSizeGallery.refresh();
// }
