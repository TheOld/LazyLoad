# Lazy load

Small library to lazy load images, pictures, video, iframe and audio on scroll using IntersectionObserver


## Features

Use `data-src` attribute to load resource when `<img>`, `<picture>`, `<video>`, `<audio>`, `<picture>` or `<iframe>` elements enter the screen (use polyfilled IntersectionObserver).

## Classes states

During the loading process the targeted element is updated using different classes:
- `is-loading`: well, you get than one (media is being downloaded)
- `is-loaded`: media has been loaded successfully
- `is-error`: an error occurred during media download

Using these helper classes you will be able to add usefull information in the UI during the entire loading process (you can/should also add nice reveal animation).

## Install

### **NPM / Yarn**

Install the package:

`npm install @heyday/lazy-load`

or

`yarn add @heyday/lazy-load`

### **Usage**

Import the module in your project:
```js
import LazyLoad from '@heyday/lazy-load';
```

Instanciate module:
```js
new LazyLoad(options);
```

Use the following HTML syntax to add the lazy load behaviour:
```html
<img class="js-lazy-load" data-src="PATH/TO/IMAGE.jpg">
```

Compatible with:
- `<img>` element:
```html
<img class="js-lazy-load" data-src="PATH/TO/IMAGE.jpg">
```

- Background image:
```html
<div class="js-lazy-load" data-src="PATH/TO/IMAGE.jpg"></div>
```

- `<picture>` element:
```html
<picture class="js-lazy-load">
	<source data-srcset="PATH/TO/IMAGE_300.jpg" media="(max-width: 480px)" />
	<source data-srcset="PATH/TO/IMAGE_600.jpg" media="(max-width: 900px)" />
	<img data-src="PATH/TO/IMAGE.jpg" />
</picture>
```

- `<iframe>` element:
```html
<iframe width="100%" height="520" data-src="https://www.google.com/" class="js-lazy-load"></iframe>
```

- `<video>` element:
```html
<video class="js-lazy-load" data-srcset="PATH/TO/VIDEO.webm"></video>
```


### **Options**

You can customize the IntersectionObserver behaviour by simply passing on an options object in parameter when instanciating the `LazyLoad` class like so:

```js
new LazyLoad({root: null, rootMargin: '10%', threshold: 1});
```

![](https://media.giphy.com/media/K7QDQeUgrIyFW/giphy.gif)

Option breakdown:

**root**

| Default | Description |
| --- | --- | --- |
| `null` | The element that is used as the viewport for checking visiblity of the target. |

**rootMargin**

| Default | Description |
| --- | --- | --- |
| `5%` | Margin around the root (can have values similar to the CSS margin property) |


**threshold**

| Default | Description |
| --- | --- | --- |
| `0` | Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed.This value should be contained between `0` and `1`. A value of `0` means that the callback will be run as soon as even one pixel is visible where a value of `1` means that nothing happened until every pixel is visible. |

**Note:**
*These options macthes the Intersection Observer API, you can have a complete description here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API*


## Todo
- [x] Add demo
- [x] Add documentation
- [x] Don't be a moron, add test
