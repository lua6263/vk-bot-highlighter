import utils from './utils'
import { CONFIG_URL } from './constants'

export default function configFactory() {
  let config = {
    botListVersion: null,
    marks: [],
  }

  function processRawConfig(rawConfig) {
    const marksFromTypes = rawConfig.types.map((rawTypeItem) => ({
      id: rawTypeItem.id,
      name: rawTypeItem.name,
      color: rawTypeItem.color,
      gradientDirection: null
    }))

    const marksFromMark = rawConfig.mark.map((rawMarkItem) => ({
      id: rawMarkItem.id,
      name: rawMarkItem.name,
      color: rawMarkItem.color,
      gradientDirection: {
        d: 'vertical',
        g: 'horizontal'
      }[rawMarkItem.id.split('_')[0]] || 'vertical'
    }))

    return {
      botListVersion: rawConfig.timestamp,
      marks: [
        ...marksFromTypes,
        ...marksFromMark,
      ]
    }
  }

  function fetchConfig() {
    if (!utils.http) {
      return Promise.reject("Unable to get supported cross-origin XMLHttpRequest function.")
    }

    return new Promise((resolve) => {
      utils.http({
        method: "GET",
        url: CONFIG_URL,
        async onload(response) {
          config = processRawConfig(JSON.parse(response.responseText))
          resolve()
        }
      })
    })
  }

  function getConfig() {
    return config
  }

  return {
    fetchConfig,
    getConfig
  }
}