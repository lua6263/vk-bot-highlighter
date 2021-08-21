import utils from './utils'
import { VK_BOT_LIST_URL } from './constants'

export default function botListsFactory(config) {
  let botList = []

  function processRawBotList(rawBotList) {
    return rawBotList
      .map(rawBotItem => ({
        id: Number(rawBotItem.i),
        nickname: rawBotItem.n,
        marksIds: [
          rawBotItem.t,
          ...(rawBotItem.m ? [rawBotItem.m] : [])
        ]
      }))
  }

  function fetchBotList() {
    if (!http) {
      return Promise.reject("Unable to get supported cross-origin XMLHttpRequest function.")
    }

    return new Promise((resolve, reject) => {
      http({
        method: "GET",
        url: VK_BOT_LIST_URL,
        onload(response) {
          if (response.status !== 200) {
            reject()
            return;
          }

          const botList = processRawBotList(JSON.parse(response.responseText))
          resolve(botList)
        }
      })
    })
  }

  function findBot(idOrNickname) {
    const matchId = String(idOrNickname).match(/^(id)?(\d{6,})$/)
    const id = matchId && Number(matchId[2])

    // TODO искать только по включенным в настройках
    let foundBot = null
    if (!id) {
      foundBot = botList.find(bot => {
        return bot.nickname === idOrNickname
      })
    } else {
      foundBot = botList.find(bot => {
        return bot.id === id
      })
    }

    return foundBot
  }

  async function fillLists() {
    const configData = config.getConfig();
    const localBotListVersion = utils.getStorageValue('botHighlighterBotListVersion1') || 0

    let newBotLists = []

    if (configData.botListVersion === localBotListVersion) {
      newBotLists = JSON.parse(utils.getStorageValue('botHighlighterSavedBotList') || '[]')
    } else {
      newBotLists = await fetchBotList()
      utils.setStorageValue('botHighlighterSavedBotList', JSON.stringify(newBotLists))
      utils.setStorageValue('botHighlighterBotListVersion1', configData.botListVersion)
    }

    newBotLists = newBotLists.map(bot => {
      const marks = bot.marksIds
        .map(
          botMarkItemId => configData.marks.find(
            markItem => markItem.id === botMarkItemId
          ),
        )
        .filter(Boolean)

      const background = (() => {
        if (marks.length === 1) {
          return marks[0].color
        }

        const percentShare = Math.round(100 / marks.length)
        const gradientPointsString = marks.reduce((accStr, markItem, i) => {
          let itemPercent = (i === marks.length - 1) ? 100 : percentShare * i
          return accStr + `, ${markItem.color} ${itemPercent}`
        }, '')

        const gradientAngle = {
          'vertical': '0deg',
          'horizontal': '90deg',
        }[bot.gradientDirection]

        return `linear-gradient(${gradientAngle}, ${gradientPointsString})`
      })()

      return {
        ...bot,
        marks,
        background,
      }
    })

    botList = newBotLists
  }

  return {
    fillLists,
    findBot
  }
}