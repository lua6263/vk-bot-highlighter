import configFactory from './configFactory'
import elementsFinderFactory from './elementsFinderFactory'
import botListsFactory from './botListsFactory'
import onReplyFound from './hightlighters/onReplyFound'
import onPostFound from './hightlighters/onPostFound'
import onFanFound from './hightlighters/onFanFound'
import onLikeFound from './hightlighters/onLikeFound'
import onProfileFound from './hightlighters/onProfileFound'
import onFoundMobilePost from './hightlighters/onFoundMobilePost'
import onFoundMobileProfile from './hightlighters/onFoundMobileProfile'
import onFoundMobileReply from './hightlighters/onFoundMobileReply'
import onFoundMobileFan from './hightlighters/onFoundMobileFan'

const config = configFactory()
const botList = botListsFactory(config)

async function start() {
  await config.fetchConfig()
  await botList.fillLists()

  const finder = elementsFinderFactory()

  finder.on('.reply', (el) => onReplyFound(el, botList))
  finder.on('.post', (el) => onPostFound(el, botList))
  finder.on('.fans_fan_row', (el) => onFanFound(el, botList))
  finder.on('.like_tt_owner', (el) => onLikeFound(el, botList))
  finder.on('#profile', (el) => onProfileFound(el, botList))

  finder.on('.wall_item', (el) => onFoundMobilePost(el, botList))
  finder.on('.owner_panel.profile_panel', (el) => onFoundMobileProfile(el, botList))
  finder.on('.ReplyItem', (el) => onFoundMobileReply(el, botList))
  finder.on('.pcont .inline_item', (el) => onFoundMobileFan(el, botList))
}

start()
