import { IBotList } from '@/interfaces'
import utils from '@/utils'
import commonActionsTemplate from 'raw-loader!@/layouts/commonActions.html'

export default function onFoundMobileReply(replyEl: HTMLElement, botList: IBotList) : void {
  const userID = replyEl.querySelector('.ReplyItem__action').getAttribute('onclick').match(/(\d+)\)/)[1]

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const replyHeaderEl = replyEl.querySelector<HTMLElement>('.ReplyItem__header')

  replyHeaderEl.style.background = bot.background
  replyHeaderEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)'
  replyHeaderEl.style.paddingLeft = '3px'

  replyHeaderEl.append(
    utils.createLayoutFromString(commonActionsTemplate, { userID }),
  )
}
