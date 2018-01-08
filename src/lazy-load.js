import Emitter from 'component-emitter';

// Including polyfill for old browser support.
require('intersection-observer');

const DEFAULT_OPTIONS = {
	// The root to use for intersection.
	// If not provided, use the top-level document’s viewport.
	root: null,
	// Same as margin, can be 1, 2, 3 or 4 components, possibly negative lengths.
	// If an explicit root element is specified, components may be percentages of the
	// root element size. If no explicit root element is specified, using a percentage
	// is an error.
	rootMargin: '5%',
	// Threshold(s) at which to trigger callback, specified as a ratio, or list of
	// ratios, of (visible area / total area) of the observed element (hence all
	// entries must be in the range [0, 1]).  Callback will be invoked when the visible
	// ratio of the observed element crosses a threshold in the list.
	threshold: 0
};

export default class LazyLoad extends Emitter {
	constructor(options = {}) {
		super();

		this.options = Object.assign({}, DEFAULT_OPTIONS, options);

		// Function binding
		this._callback = this._callback.bind(this);

		// Instanciate an IntersectionObserver
		this.observer = new IntersectionObserver(this._callback, this.options);

		this.run();
	}

	// Observe elements mathcing the `.js-lazy-load` selector
	run() {
		const els = [ ...document.querySelectorAll('.js-lazy-load:not(.is-loaded)') ];
		els.forEach((el) => this.observer.observe(el));
	}

	// Disconnect entire IntersectionObserver
	destroy() {
		this.observer.disconnect();
	}

	// Reset running IntersectionObserver
	reset() {
		this.destroy();
		this.run();
	}

	_callback(entries) {
		entries.forEach((entry) => {
			if (entry.intersectionRatio > 0 || entry.isIntersecting) {
				const el = entry.target;
				const nodeName = el.nodeName.toLowerCase();

				// Stop observing the current target
				this.observer.unobserve(entry.target);

				// Copy of el in el._lazy for futur needs
				el._lazy = el;

				// el is a <picture>
				if (nodeName === 'picture') {
					el._lazy = el.querySelector('img');
				}

				// el is a <video> or a <audio>
				if ([ 'video', 'audio' ].includes(nodeName)) {
					el._isMedia = true;
				}

				// Add `is-loading` class
				el.classList.add('is-loading');

				// `onload` event handler
				el._onLoadHandler = () => {
					// Toogle `is-loading`/`is-loaded` classes
					this._toggleClasses(el);
					// Set `background-image` if needed
					if (el._isBackgroundImage === true) {
						el.style.backgroundImage = `url("${el._lazy.src}")`;
					}
					// Emit `loaded` event
					this.emit('loaded', el, el._lazy.currentSrc || el._lazy.src);
					// Unbind events listener
					this._unbindEventListeners(el);
				};

				// `onerror` event handler
				el._onErrorHandler = () => {
					// Toggle `is-loading`/`is-error` classes
					this._toggleClasses(el, false);
					// Emit `error` event
					this.emit('error', el, el._lazy.currentSrc || el._lazy.src);
					// Unbind events listener
					this._unbindEventListeners(el);
				};

				const src = el._lazy.dataset.src;
				if (src) {
					// If `el` is not a <img>, a <picture>, a <video>, a <audio> and an <iframe>,
					// we assume that we will set the `data-src` as `background-image`.
					if (![ 'img', 'picture', 'video', 'audio', 'iframe' ].includes(nodeName)) {
						el._lazy = new Image();
						el._isBackgroundImage = true;
					}

					// Bind events listener
					this._bindEventListeners(el);

					// Copy `data-src` content in `src` attribute
					el._lazy.src = src;

					// Copy `data-srcset` content in `srcset` attribute
					if (el._lazy.dataset.srcset) {
						el._lazy.srcset = el._lazy.dataset.srcset;
					}

					// If has <source> child
					[ ...el.getElementsByTagName('source') ].forEach((source) => {
						if (source.dataset.srcset) {
							source.srcset = source.dataset.srcset;
							source.removeAttribute('data-srcset');
						}
					});

					// Remove `data-src` and `data-srcset` attribute
					el._lazy.removeAttribute('data-src');
					el._lazy.removeAttribute('data-srcset');
					el.removeAttribute('data-src'); // el._isBackgroundImage === true
				} else {
					// If `el` is a <video> or a <audio> with <source> element
					if (el._isMedia) {
						// Bind events listener
						this._bindEventListeners(el);

						[ ...el.getElementsByTagName('source') ].forEach((source) => {
							if (source.dataset.src) {
								source.src = source.dataset.src;
								source.removeAttribute('data-src');
							}
						});

						// Load media
						el.load();
					} else {
						// Toogle `is-loading`/`is-error` classes
						this._toggleClasses(el, false);
						// Emit `error` event
						this.emit('error', el, null);
					}
				}
			}
		});
	}

	// Toggle classes helper
	_toggleClasses(el, loaded = true) {
		el.classList.remove('is-loading');
		el.classList.add(loaded ? 'is-loaded' : 'is-error');
	}

	// Add `onload` and `onerror` event listener
	_bindEventListeners(el) {
		el._lazy.addEventListener(el._isMedia ? 'canplay' : 'load', el._onLoadHandler, {
			capture: false,
			passive: true
		});
		el._lazy.addEventListener('error', el._onErrorHandler, { capture: false, passive: true });
	}

	// Remove `onload` and `onerror` event listener
	_unbindEventListeners(el) {
		el._lazy.removeEventListener(el._isMedia ? 'canplay' : 'load', el._onLoadHandler);
		el._lazy.removeEventListener('error', el._onErrorHandler);
	}
}
