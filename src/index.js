import configFactory from './configFactory'
import elementsFinderFactory from './elementsFinderFactory'
import botListsFactory from './botListsFactory'
import onReplyFound from './actions/onReplyFound'
import onPostFound from './actions/onPostFound'
import onFanFound from './actions/onFanFound'
import onLikeFound from './actions/onLikeFound'
import onProfileFound from './actions/onProfileFound'
import onFoundMobilePost from './actions/onFoundMobilePost'
import onFoundMobileProfile from './actions/onFoundMobileProfile'
import onFoundMobileReply from './actions/onFoundMobileReply'
import onFoundMobileFan from './actions/onFoundMobileFan'

const config = configFactory()
const botList = botListsFactory(config)

async function start() {
  await config.fetchConfig()
  await botList.fillLists()

  const finder = elementsFinderFactory(botList)

  finder.on('.reply', onReplyFound)
  finder.on('.post', onPostFound)
  finder.on('.fans_fan_row', onFanFound)
  finder.on('.like_tt_owner', onLikeFound)
  finder.on('#profile', onProfileFound)

  finder.on('.wall_item', onFoundMobilePost)
  finder.on('.owner_panel.profile_panel', onFoundMobileProfile);
  finder.on('.ReplyItem', onFoundMobileReply);
  finder.on('.pcont .inline_item', onFoundMobileFan);
}

start()
