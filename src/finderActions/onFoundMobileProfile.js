import utils from '../utils'

export default function onFoundMobileProfile(ownerPanelEl, botList) {
  const reportEl = document.querySelector('.ContextMenu__listItem a[href*=reports]')

  if (!reportEl) {
    return
  }

  const userID = reportEl.getAttribute('href').match(/owner_id=(\d+)/)[1]

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const ppContEl = ownerPanelEl.querySelector('.pp_cont')

  ppContEl.style.background = bot.background
  ppContEl.append(
    utils.createLayoutFromString(`
      <i>
        <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
          Комментарии
        </a>
        <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
          Карточка
        </a>
      </i>
    `)
  );
}