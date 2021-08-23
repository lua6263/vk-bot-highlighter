import { IBotList } from '@/interfaces'
import utils from '@/utils'
import commonActionsTemplate from 'raw-loader!@/layouts/commonActions.html'

export default function onProfileFound(_: HTMLElement, botList: IBotList) : void {
  const abuseActionEl = document.querySelector('.PageActionCell[data-task-click="ProfileAction/abuse"]')

  if (!abuseActionEl) {
    return
  }

  const userID = abuseActionEl.getAttribute('data-user_id')
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const pagePhotoEl = document.querySelector<HTMLElement>('.page_photo')
  pagePhotoEl.style.background = bot.background

  const pageNameEl = document.querySelector<HTMLElement>('.page_name')

  pageNameEl.insertAdjacentElement('afterend', utils.createLayoutFromString(commonActionsTemplate, { userID }))
}
