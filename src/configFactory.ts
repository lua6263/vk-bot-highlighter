import utils from './utils'
import { CONFIG_URL } from './constants'
import {
  IBotMark, IConfig, IConfigState, IGradientDirection, IRawConfig,
} from './interfaces'

export default function configFactory() : IConfig {
  let config = {
    botListVersion: '',
    marks: [],
  } as IConfigState

  function processRawConfig(rawConfig: IRawConfig) {
    const marksFromRawTypes: IBotMark[] = rawConfig.types.map((rawTypeItem) => ({
      id: String(rawTypeItem.id),
      name: rawTypeItem.n,
      color: rawTypeItem.color,
      gradientDirection: null,
    }))

    const marksFromRawMarks: IBotMark[] = rawConfig.mark.map((rawMarkItem) => {
      const directionFromMarkId = rawMarkItem.id.split('_')[0] as 'd' | 'g'

      return {
        id: rawMarkItem.id,
        name: rawMarkItem.n,
        color: rawMarkItem.color,
        gradientDirection: {
          d: 'vertical',
          g: 'horizontal',
        }[directionFromMarkId] as IGradientDirection,
      }
    })

    return {
      botListVersion: String(rawConfig.timestamp),
      marks: [
        ...marksFromRawTypes,
        ...marksFromRawMarks,
      ],
    }
  }

  function fetchConfig() {
    return new Promise<void>((resolve) => {
      utils.http({
        method: 'GET',
        url: CONFIG_URL,
        async onload(response: any) {
          config = processRawConfig(JSON.parse(response.responseText))
          resolve()
        },
      })
    })
  }

  function getConfig() {
    return config
  }

  return {
    fetchConfig,
    getConfig,
  }
}
