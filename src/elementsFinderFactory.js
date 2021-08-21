export default function elementsFinderFactory(botList) {
  let mapSelectorHandlers = {}
  let alreadyFoundElements = []

  setInterval(() => {
    Object.entries(mapSelectorHandlers).forEach(([selector, handlers]) => {
      const newFoundElements = [...document.querySelectorAll(selector)]
        .filter(element => !alreadyFoundElements.includes(element))

      newFoundElements.forEach(element => {
        handlers.forEach(handler => {
          handler(element, botList)
        })
      })

      alreadyFoundElements = [
        ...alreadyFoundElements,
        ...newFoundElements
      ]
    })
  }, 300)

  function on(selector, foundHandler) {
    if (!mapSelectorHandlers[selector]) {
      mapSelectorHandlers[selector] = []
    }

    mapSelectorHandlers[selector].push(foundHandler)
  }

  return {
    on
  }
}