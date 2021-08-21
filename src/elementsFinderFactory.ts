import { IElementsFinder, IElementFoundHandler } from './interfaces'

export default function elementsFinderFactory() : IElementsFinder {
  const mapSelectorHandlers = {} as { [key: string]: IElementFoundHandler[] }
  let alreadyFoundElements = [] as Element[]

  setInterval(() => {
    Object.entries(mapSelectorHandlers).forEach(([selector, handlers]) => {
      const newFoundElements = [...document.querySelectorAll<HTMLElement>(selector)]
        .filter((element) => !alreadyFoundElements.includes(element))

      newFoundElements.forEach((element) => {
        handlers.forEach((handler) => {
          handler(element)
        })
      })

      alreadyFoundElements = [
        ...alreadyFoundElements,
        ...newFoundElements,
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
    on,
  }
}
