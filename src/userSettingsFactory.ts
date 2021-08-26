import utils from '@/utils'
import { IUserSettings } from './interfaces'

export default function userSettingsFactory() : IUserSettings {
  const settings: { disabledMarks: string[] } = utils.getStorageValue('botHighlighterSettings') || {
    disabledMarks: [],
  }

  function saveSettings() {
    utils.setStorageValue('botHighlighterSettings', settings)
  }

  function disableMark(markId: string) {
    settings.disabledMarks = [...settings.disabledMarks, markId]
    saveSettings()
  }

  function enableMark(markId: string) {
    settings.disabledMarks = settings.disabledMarks.filter((markIdItem) => markIdItem === markId)
    saveSettings()
  }

  function checkIsMarkDisabled(markId: string): boolean {
    return settings.disabledMarks.includes(markId)
  }

  return {
    enableMark,
    disableMark,
    checkIsMarkDisabled,
  }
}
