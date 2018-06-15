/*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
// Modified from
// https://github.com/jonathantneal/svg4everybody to turn into an esnext import.

const LEGACY_SUPPORT = false;

function embed(parent: Node, svg: Node & HTMLElement, target: Node & HTMLElement) {
  // if the target exists
  if (target) {
    // create a document fragment to hold the contents of the target
    const fragment = document.createDocumentFragment();

    // cache the closest matching viewBox
    const viewBox = !svg.hasAttribute('viewBox') && target.getAttribute('viewBox');

    // conditionally set the viewBox on the svg
    if (viewBox) {
      svg.setAttribute('viewBox', viewBox);
    }

    // clone the target
    // const clone = target.cloneNode(true);
    // https://github.com/jonathantneal/svg4everybody/pull/113
    const clone = document.importNode ? document.importNode(target, true) : target.cloneNode(true);

    // copy the contents of the clone into the fragment
    while (clone.childNodes.length) {
      fragment.appendChild(clone.firstChild);
    }

    // append the fragment into the svg
    parent.appendChild(fragment);
  }
}

function loadreadystatechange(xhr: any) {
  const onReadyStateChange = function () {
    // if the request is ready
    if (xhr.readyState === 4) {
      // get the cached html document
      let cachedDocument = xhr._cachedDocument;

      // ensure the cached html document based on the xhr response
      if (!cachedDocument) {
        cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument('');

        cachedDocument.body.innerHTML = xhr.responseText;

        // ensure domains are the same, otherwise we'll have issues appending the
        // element in IE 11
        cachedDocument.domain = document.domain;

        xhr._cachedTarget = {};
      }

      // clear the xhr embeds list and embed each item
      xhr._embeds.splice(0).map(function (item: { parent: Node; svg: any; id: string }) {
        // get the cached target
        let target = xhr._cachedTarget[item.id];

        // ensure the cached target
        if (!target) {
          target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id);
        }

        // embed the target into the svg
        embed(item.parent, item.svg, target);
      });
    }
  };

  // listen to changes in the request
  xhr.onreadystatechange = onReadyStateChange;

  // test the ready state change immediately
  onReadyStateChange();
}

function getSVGAncestor(node: Node): any {
  let svg = node;
  while (svg.nodeName.toLowerCase() !== 'svg') {
    svg = svg.parentNode;
    if (!svg) {
      break;
    }
  }
  return svg;
}

declare type FallbackFunc = (src: string, svg: any, use: SVGUseElement) => string;
export interface Svg4EverybodyOpts {
  nosvg?: boolean;
  polyfill?: boolean;
  fallback?: FallbackFunc;
  validate?: FallbackFunc;
  attributeName?: string;
}

const defaultOpts: Svg4EverybodyOpts = {};
export function svg4everybody(rawopts = defaultOpts) {
  const opts = { ...Object(rawopts) } as Svg4EverybodyOpts;

  // create legacy support variables
  let nosvg: boolean;
  let fallback: FallbackFunc;

  // if running with legacy support
  if (LEGACY_SUPPORT) {
    // configure the fallback method
    fallback = opts.fallback || function (src: string) {
      return src.replace(/\?[^#]+/, '').replace('#', '.').replace(/^\./, '') + '.png' + (/\?[^#]+/.exec(src) || [''])[0];
    };

    // set whether to shiv <svg> and <use> elements and use image fallbacks
    nosvg = 'nosvg' in opts ? opts.nosvg : /\bMSIE [1-8]\b/.test(navigator.userAgent);

    // conditionally shiv <svg> and <use>
    if (nosvg) {
      document.createElement('svg');
      document.createElement('use');
    }
  }

  // set whether the polyfill will be activated or not
  let polyfill: boolean;
  const olderIEUA = /\bMSIE [1-8]\.0\b/;
  const newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
  const webkitUA = /\bAppleWebKit\/(\d+)\b/;
  const olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
  const edgeUA = /\bEdge\/.(\d+)\b/;
  // Checks whether iframed
  const inIframe = window.top !== window.self;

  if ('polyfill' in opts) {
    polyfill = opts.polyfill;
  } else if (LEGACY_SUPPORT) {
    polyfill = olderIEUA.test(navigator.userAgent) || newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < (10547 as any) || (navigator.userAgent.match(webkitUA) || [])[1] < (537 as any) || edgeUA.test(navigator.userAgent) && inIframe;
  } else {
    polyfill = newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < (10547 as any) || (navigator.userAgent.match(webkitUA) || [])[1] < (537 as any) || edgeUA.test(navigator.userAgent) && inIframe;
  }

  // create xhr requests object
  const requests: { [url: string]: XMLHttpRequest } = {};

  // use request animation frame or a timeout to search the dom for svgs
  const rAF = window.requestAnimationFrame; // || setTimeout;
  const requestAnimationFrame = (cb: () => void, d: number) => rAF ? rAF(cb) : setTimeout(cb, d);

  // get a live collection of use elements on the page
  const uses = document.getElementsByTagName('use');
  let numberOfSvgUseElementsToBypass = 0;

  function oninterval() {
    // get the cached <use> index
    let index = 0;

    // while the index exists in the live <use> collection
    while (index < uses.length) {
      // get the current <use>
      const use = uses[index];

      // get the current <svg>
      const parent = use.parentNode;
      const svg = getSVGAncestor(parent);
      let src = use.getAttribute('xlink:href') || use.getAttribute('href');

      if (!src && opts.attributeName) {
        src = use.getAttribute(opts.attributeName);
      }

      if (svg && src) {

        // if running with legacy support
        if (LEGACY_SUPPORT && nosvg) {
          // create a new fallback image
          const img = document.createElement('img');

          // force display in older IE
          img.style.cssText = 'display:inline-block;height:100%;width:100%';

          // set the fallback size using the svg size
          img.setAttribute('width', svg.getAttribute('width') || svg.clientWidth);
          img.setAttribute('height', svg.getAttribute('height') || svg.clientHeight);

          // set the fallback src
          img.src = fallback(src, svg, use);

          // replace the <use> with the fallback image
          parent.replaceChild(img, use);
        } else if (polyfill) {
          if (!opts.validate || opts.validate(src, svg, use)) {
            // // remove the <use> element
            // parent.removeChild(use);

            // parse the src and get the url and id
            const srcSplit = src.split('#');
            const url = srcSplit.shift();
            const id = srcSplit.join('#');

            // if the link is external
            if (url.length) {
              // remove the <use> element, only if it is actually external.
              // https://github.com/lagmedia/svg4everybody/commit/974dbcbe0d7327f8584dcaf5c325c4e9d9535de3
              parent.removeChild(use);
              // get the cached xhr request
              let xhr = requests[url];

              // ensure the xhr request exists
              if (!xhr) {
                xhr = requests[url] = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.send();
                (xhr as any)._embeds = [];
              }

              // add the svg and id as an item to the xhr embeds list
              (xhr as any)._embeds.push({
                parent: parent,
                svg: svg,
                id: id
              });

              // prepare the xhr ready state change event
              loadreadystatechange(xhr);
            } else {
              // embed the local id into the svg
              embed(parent, svg, document.getElementById(id));
              // increase the index since we are keeping the <use> element
              ++index;
              ++numberOfSvgUseElementsToBypass;
            }
          } else {
            // increase the index when the previous value was not "valid"
            ++index;
            ++numberOfSvgUseElementsToBypass;
          }
        }
      } else {
        // increase the index when the previous value was not "valid"
        ++index;
      }
    }

    // continue the interval
    if (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) {
      requestAnimationFrame(oninterval, 67);
    }
  }

  // conditionally start the interval if the polyfill is active
  if (polyfill) {
    oninterval();
  }
}
