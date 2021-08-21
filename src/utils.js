export default {
  http: GM_xmlhttpRequest || (GM && GM.xmlHttpRequest),
  setStorageValue: GM_setValue,
  getStorageValue: GM_getValue,

  allParents(element) {
    const parents = [element]
    while (parents[parents.length - 1].parentElement) {
      parents.push(parents[parents.length - 1].parentElement)
    }
    return parents.slice(1)
  },

  createLayoutFromString(string) {
    const div = document.createElement('div')
    div.innerHTML = string

    return div.children[0]
  },
}