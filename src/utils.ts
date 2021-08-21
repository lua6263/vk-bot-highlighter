declare var GM: any;
declare function GM_xmlhttpRequest(...args: any): any;
declare function GM_setValue(...args: any): any;
declare function GM_getValue(...args: any): any;

const http = GM_xmlhttpRequest || (GM && GM.xmlHttpRequest)

if (!http) {
  throw new Error("Unable to get supported cross-origin XMLHttpRequest function.")
}

export default {
  http,
  setStorageValue: GM_setValue,
  getStorageValue: GM_getValue,

  allParents(element: Element) {
    const parents = [element]
    while (parents[parents.length - 1].parentElement) {
      parents.push(parents[parents.length - 1].parentElement)
    }
    return parents.slice(1)
  },

  createLayoutFromString(string: string) {
    const div = document.createElement('div')
    div.innerHTML = string

    return div.children[0]
  },
}