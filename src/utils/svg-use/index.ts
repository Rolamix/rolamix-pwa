// This function loads a polyfill for SVG's to use the <svg use="" /> syntax.
// I found this problematic on a variety of browsers so I will not be doing that
// for now and an instead dynamically loading SVG's used on the page.
// But, this is stored here for reference.
// This is intended to be called from global/index.ts:
// declare var Context: any;
// declare var resourcesUrl: string;
// initSvg4everybody(Context, resourcesUrl)
export function initSvg4everybody(Context: any, resourcesUrl: string) {
  const newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
  const webkitUA = /\bAppleWebKit\/(\d+)\b/;
  const olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
  const edgeUA = /\bEdge\/.(\d+)\b/;
  const inIframe = window.top !== window.self;
  const svgPolyfillRequired = !Context.isServer
    && (newerIEUA.test(navigator.userAgent)
      || (navigator.userAgent.match(olderEdgeUA) || [])[1] < (10547 as any)
      || (navigator.userAgent.match(webkitUA) || [])[1] < (537 as any)
      || edgeUA.test(navigator.userAgent) && inIframe);

  if (svgPolyfillRequired) { //  || (true && !Context.isServer)
    const scr = document.createElement('script');
    scr.noModule = true;
    scr.crossOrigin = 'cors';
    scr.onload = function () { console.log('svg4everybody'); (window as any).svg4everybody({ polyfill: true }); };
    scr.onerror = function (oError) {
      console.warn('The script ' + (oError.target as any).src + ' didn\'t load correctly.');
    };
    document.head.appendChild(scr);
    scr.src = `${resourcesUrl}svg4everybody.min.js`;
  }
}
