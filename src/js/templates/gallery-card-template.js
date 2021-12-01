export default function createImgCards(data) {
  return data.hits
    .map(hit => {
      return `<a class="photo-card" href="${hit.largeImageURL}">
      <img class="thumb-img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes</b> ${hit.likes}</p>
        <p class="info-item"><b>Views</b> ${hit.views}</p>
        <p class="info-item"><b>Comments</b> ${hit.comments}</p>
        <p class="info-item"><b>Downloads</b> ${hit.downloads}</p>
      </div>
  </a>`;
    })
    .join('');
}
