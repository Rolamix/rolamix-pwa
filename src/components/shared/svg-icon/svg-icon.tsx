import { Component, Element, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'svg-icon',
  assetsDir: 'svg',
  styleUrl: 'svg-icon.scss',
  // shadow: true
})
export class Icon {
  @Element() el: HTMLElement;

  @State() private svgContent: string = null;
  @State() private isVisible: boolean;

  @Prop({ context: 'isServer' }) isServer: boolean;
  @Prop({ context: 'resourcesUrl' }) resourcesUrl: string;
  @Prop({ context: 'document' }) doc: Document;
  @Prop({ context: 'window' }) win: any;

  @Prop() color: string;

  /**
   * Specifies the label to use for accessibility. Defaults to the icon name.
   */
  @Prop({mutable: true, reflectToAttr: true}) ariaLabel = '';

  /**
   * Specifies which icon to use from the built-in set of icons.
   */
  @Prop() name = '';

  /**
   * Specifies the exact `src` of an SVG file to use.
   */
  @Prop() src = '';

  /**
   * A combination of both `name` and `src`. If a `src` url is detected
   * it will set the `src` property. Otherwise it assumes it's a built-in named
   * SVG and set the `name` property.
   */
  @Prop() icon = '';

  /**
   * The size of the icon.
   * Available options are: `"small"`, `"medium"` and `"large"`.
   */
  @Prop() size: string = 'small';


  componentWillLoad() {
    // purposely do not return the promise here because loading
    // the svg file should not hold up loading the app
    // only load the svg if it's visible
    this.waitUntilVisible(this.el, '50px', () => {
      this.isVisible = true;
      this.loadIcon();
    });
  }


  waitUntilVisible(el: HTMLElement, rootMargin: string, cb: Function) {
    if (this.win.IntersectionObserver) {
      const io = new this.win.IntersectionObserver((data: IntersectionObserverEntry[]) => {
        if (data[0].isIntersecting) {
          io.disconnect();
          cb();
        }
      }, { rootMargin, threshold: 0 }) as IntersectionObserver;

      io.observe(el);

    } else {
      // browser doesn't support IntersectionObserver
      // so just fallback to always show it
      cb();
    }
  }


  @Watch('name')
  @Watch('src')
  @Watch('icon')
  loadIcon() {
    if (!this.isServer && this.isVisible) {
      const url = this.getUrl();

      if (url) {
        getSvgContent(url).then(svgContent => {
          this.svgContent = validateContent(this.doc, svgContent);
        });
      }
    }

    if (!this.ariaLabel) {
      const name = getName(this.name);
      // user did not provide a label
      // come up with the label based on the icon name
      if (name) {
        this.ariaLabel = this.name
          .replace('ios-', '')
          .replace('md-', '')
          .replace(/\-/g, ' ');
      }
    }
  }


  getUrl() {
    let url = getSrc(this.src);
    if (url) {
      return url;
    }

    url = getName(this.name);
    if (url) {
      return this.getNamedUrl(url);
    }

    url = getSrc(this.icon);
    if (url) {
      return url;
    }

    url = getName(this.icon);
    if (url) {
      return this.getNamedUrl(url);
    }

    return null;
  }

  getNamedUrl(name: string) {
    return `${this.resourcesUrl}svg/${name}.svg`;
  }

  hostData() {
    return {
      'role': 'img',
      class: {
        ...createColorClasses(this.color),
        [`icon-${this.size}`]: !!this.size,
      }
    };
  }


  render() {
    if (!this.isServer && this.svgContent) {
      // we've already loaded up this svg at one point
      // and the svg content we've loaded and assigned checks out
      // render this svg!!
      return <div class="icon-inner" innerHTML={this.svgContent} />;
    }

    // actively requesting the svg
    // or it's an SSR render
    // so let's just render an empty div for now
    return <div class="icon-inner" />;
  }
}


const requests = new Map<string, Promise<string>>();

function getSvgContent(url: string) {
  // see if we already have a request for this url
  let req = requests.get(url);

  if (!req) {
    // we don't already have a request
    req = fetch(url, { cache: 'force-cache' }).then(rsp => {
      if (rsp.ok) {
        return rsp.text();
      }
      return Promise.resolve(null);
    });

    // cache for the same requests
    requests.set(url, req);
  }

  return req;
}


export function getName(name: string) {
  if (typeof name !== 'string' || name.trim() === '') {
    return null;
  }

  // only allow alpha characters and dash
  const invalidChars = name.replace(/[a-z]|-|\d/gi, '');
  if (invalidChars !== '') {
    return null;
  }

  return name;
}


export function getSrc(src: string) {
  if (typeof src === 'string') {
    src = src.trim();
    if (src.length > 0 && /(\/|\.)/.test(src)) {
      return src;
    }
  }
  return null;
}


function validateContent(document: Document, svgContent: string) {
  if (svgContent) {
    const frag = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = svgContent;
    frag.appendChild(div);

    // setup this way to ensure it works on our buddy IE
    for (let i = div.childNodes.length - 1; i >= 0; i--) {
      if (div.childNodes[i].nodeName.toLowerCase() !== 'svg') {
        div.removeChild(div.childNodes[i]);
      }
    }

    // must only have 1 root element
    const svgElm = div.firstElementChild;
    if (svgElm && svgElm.nodeName.toLowerCase() === 'svg') {
      // root element must be an svg
      // lets double check we've got valid elements
      // do not allow scripts
      if (isValid(svgElm as any)) {
        return div.innerHTML;
      }
    }
  }
  return '';
}


export function isValid(elm: HTMLElement) {
  if (elm.nodeType === 1) {
    if (elm.nodeName.toLowerCase() === 'script') {
      return false;
    }

    for (let i = 0; i < elm.attributes.length; i++) {
      const val = elm.attributes[i].value;
      if (typeof val === 'string' && val.toLowerCase().indexOf('on') === 0) {
        return false;
      }
    }

    for (let i = 0; i < elm.childNodes.length; i++) {
      if (!isValid(elm.childNodes[i] as any)) {
        return false;
      }
    }
  }
  return true;
}

function createColorClasses(color: string | undefined) {
  return (color) ? {
    'rmx-color': true,
    [`rmx-color-${color}`]: true
  } : null;
}
