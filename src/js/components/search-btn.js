export default class SearchBtn {
  constructor({ selector, name, hidden = false, loading = false }) {
    this.refs = this.getRefs(selector);
    this.name = name;
    this.refs.text.textContent = this.name;

    hidden && this.hideBtn();
    loading && this.disableLoadState();
  }

  getRefs(selector) {
    const refs = {};
    refs.btn = document.querySelector(selector);
    refs.loader = document.querySelector(
      `${selector} > span.search-btn_loader`,
    );
    refs.text = document.querySelector(`${selector} > span.search-btn_text`);

    return refs;
  }

  showBtn() {
    this.refs.btn.classList.remove('visually-hidden');
  }
  hideBtn() {
    this.refs.btn.classList.add('visually-hidden');
  }

  enableBtn() {
    this.refs.btn.disabled = false;
  }
  disableBtn() {
    this.refs.btn.disabled = true;
    this.refs.btn.blur();
    // add event poiter none to search
  }

  enableLoadState() {
    this.refs.btn.disabled = true;
    this.refs.text.textContent = 'Loading...';
    this.refs.loader.classList.remove('visually-hidden');
  }
  disableLoadState() {
    this.refs.btn.disabled = false;
    this.refs.text.textContent = this.name;
    this.refs.loader.classList.add('visually-hidden');
  }
}
