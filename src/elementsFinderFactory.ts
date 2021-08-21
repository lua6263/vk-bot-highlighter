import { IBotList, IElementsFinder, IElementFoundHandler } from "./interfaces"

export default function elementsFinderFactory(botList: IBotList) : IElementsFinder {
  let mapSelectorHandlers = {} as { [key: string]: IElementFoundHandler[] }
  let alreadyFoundElements = [] as Element[]

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

  function on(selector: string, foundHandler: IElementFoundHandler) {
    if (!mapSelectorHandlers[selector]) {
      mapSelectorHandlers[selector] = []
    }

    mapSelectorHandlers[selector].push(foundHandler)
  }

  return {
    on
  }
}