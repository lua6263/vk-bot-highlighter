import utils from '../utils'

export default function onProfileFound(_, botList) {
  const abuseActionEl = document.querySelector('.PageActionCell[data-task-click="ProfileAction/abuse"]')

  if (!abuseActionEl) {
    return
  }

  const userID = abuseActionEl.getAttribute('data-user_id')
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const pagePhotoEl = document.querySelector('.page_photo');
  pagePhotoEl.style.background = bot.background

  const pageNameEl = document.querySelector('.page_name');

  pageNameEl.insertAdjacentElement('afterend', utils.createLayoutFromString(`
    <i>
      <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
        Комментарии
      </a>
      <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
        Карточка
      </a>
    </i>
  `))
}