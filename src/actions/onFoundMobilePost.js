import utils from '../utils'

export default function onFoundMobilePost(mobilePostEl, botList) {
  const wiHeadLink = mobilePostEl.querySelector('.wi_head a')

  if (!wiHeadLink) {
    return
  }

  const userID = wiHeadLink.className.substr(4);
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const postHeaderEl = mobilePostEl.querySelector('.wi_head');

  postHeaderEl.style.background = bot.background
  postHeaderEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  postHeaderEl.style.paddingLeft = "3px"

  postHeaderEl.append(
    utils.createLayoutFromString(`
      <i>
        <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
          Комментарии
        </a>
        <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
          Карточка
        </a>
      </i>"
    `)
  );
}