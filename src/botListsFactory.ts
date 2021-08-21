import utils from './utils'
import { VK_BOT_LIST_URL } from './constants'
import {
  IBot, IBotParsed, IConfig, IRawBot, IBotList,
} from './interfaces'

export default function botListsFactory(config: IConfig) : IBotList {
  let botList: IBot[] = []

  function processRawBotList(rawBotList: IRawBot[]) : IBotParsed[] {
    return rawBotList
      .map((rawBotItem) => ({
        id: Number(rawBotItem.i),
        nickname: rawBotItem.n,
        marksIds: [
          rawBotItem.t,
          ...(rawBotItem.m ? [rawBotItem.m] : []),
        ],
      }))
  }

  function fetchBotList(): Promise<IBotParsed[]> {
    return new Promise((resolve, reject) => {
      utils.http({
        method: 'GET',
        url: VK_BOT_LIST_URL,
        onload(response: any) {
          if (response.status !== 200) {
            reject()
            return
          }

          resolve(
            processRawBotList(JSON.parse(response.responseText)),
          )
        },
      })
    })
  }

  function findBot(idOrNickname: number | string) {
    const matchId = String(idOrNickname).match(/^(id)?(\d{6,})$/)
    const id = matchId && Number(matchId[2])

    // TODO искать только по включенным в настройках
    let foundBot = null
    if (!id) {
      foundBot = botList.find((bot) => bot.nickname === idOrNickname)
    } else {
      foundBot = botList.find((bot) => bot.id === id)
    }

    return foundBot
  }

  async function fillLists() {
    const configData = config.getConfig()
    const localBotListVersion = utils.getStorageValue('botHighlighterBotListVersion1') || 0

    let newBotLists = [] as IBotParsed[]

    if (configData.botListVersion === localBotListVersion) {
      newBotLists = JSON.parse(utils.getStorageValue('botHighlighterSavedBotList') || '[]')
    } else {
      newBotLists = await fetchBotList()
      utils.setStorageValue('botHighlighterSavedBotList', JSON.stringify(newBotLists))
      utils.setStorageValue('botHighlighterBotListVersion1', configData.botListVersion)
    }

    const bots: IBot[] = newBotLists.map((bot) => {
      const marks = bot.marksIds
        .map(
          (botMarkItemId) => configData.marks.find(
            (markItem) => markItem.id === botMarkItemId,
          ),
        )
        .filter(Boolean)

      const background = (() => {
        if (marks.length === 1) {
          return marks[0].color
        }

        const percentShare = Math.round(100 / marks.length)
        const gradientPointsString = marks.reduce((accStr, markItem, i) => {
          const itemPercent = (i === marks.length - 1) ? 100 : percentShare * i
          return `${accStr}, ${markItem.color} ${itemPercent}%`
        }, '')

        const gradientDirection = (() => marks
          .find((markItem) => markItem.gradientDirection)
          .gradientDirection)()

        const gradientAngle = {
          vertical: '0deg',
          horizontal: '90deg',
        }[gradientDirection]

        return `linear-gradient(${gradientAngle}${gradientPointsString})`
      })()

      return {
        id: bot.id,
        nickname: bot.nickname,
        marks,
        background,
      }
    })

    botList = bots
  }

  return {
    fillLists,
    findBot,
  }
}
