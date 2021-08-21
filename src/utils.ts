declare const GM: any
declare const unsafeWindow: any
/* eslint-disable @typescript-eslint/naming-convention */
declare function GM_xmlhttpRequest(...args: any): any
declare function GM_setValue(...args: any): any
declare function GM_getValue(...args: any): any
/* eslint-enable @typescript-eslint/naming-convention */

const http = GM_xmlhttpRequest || (GM && GM.xmlHttpRequest)

if (!http) {
  throw new Error('Unable to get supported cross-origin XMLHttpRequest function.')
}

export default {
  http,
  unsafeWindow,
  setStorageValue: GM_setValue,
  getStorageValue: GM_getValue,

  allParents(element: Element): Element[] {
    const parents = [element]
    while (parents[parents.length - 1].parentElement) {
      parents.push(parents[parents.length - 1].parentElement)
    }
    return parents.slice(1)
  },

  createLayoutFromString(template: string, vars: { [key: string]: string } = {}): Element {
    const html = Object.entries(vars)
      .reduce((acc, [key, value]) => acc.replace(`{{${key}}}`, value), template)

    const div = document.createElement('div')
    div.innerHTML = html

    return div.children[0]
  },
}
