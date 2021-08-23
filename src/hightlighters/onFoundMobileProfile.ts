import { IBotList } from '@/interfaces'
import utils from '@/utils'
import commonActionsTemplate from 'raw-loader!@/layouts/commonActions.html'

export default function onFoundMobileProfile(ownerPanelEl: HTMLElement, botList: IBotList) : void {
  const reportEl = document.querySelector('.ContextMenu__listItem a[href*=reports]')

  if (!reportEl) {
    return
  }

  const userID = reportEl.getAttribute('href').match(/owner_id=(\d+)/)[1]

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const ppContEl = ownerPanelEl.querySelector<HTMLElement>('.pp_cont')

  ppContEl.style.background = bot.background
  ppContEl.append(
    utils.createLayoutFromString(commonActionsTemplate, { userID }),
  )
}
