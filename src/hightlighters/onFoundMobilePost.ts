import { IBotList } from '@/interfaces'
import utils from '@/utils'
import commonActionsTemplate from 'raw-loader!@/layouts/commonActions.html'

export default function onFoundMobilePost(mobilePostEl: HTMLElement, botList: IBotList) : void {
  const wiHeadLink = mobilePostEl.querySelector('.wi_head a')

  if (!wiHeadLink) {
    return
  }

  const userID = wiHeadLink.className.substr(4)
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const postHeaderEl = mobilePostEl.querySelector<HTMLElement>('.wi_head')

  postHeaderEl.style.background = bot.background
  postHeaderEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)'
  postHeaderEl.style.paddingLeft = '3px'

  postHeaderEl.append(
    utils.createLayoutFromString(commonActionsTemplate, { userID }),
  )
}
