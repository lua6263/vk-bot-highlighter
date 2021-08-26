export interface IRawBot {
  i: string
  n: string | undefined
  t: string
  m: string
}

export interface IRawBotType {
  id: number
  n: string
  color: string
}

export interface IRawBotMark {
  id: string
  n: string
  color: string
}

export interface IRawConfig {
  timestamp: number
  types: IRawBotType[]
  mark: IRawBotMark[]
}

export interface IConfigState {
  botListVersion: string
  marks: IBotMark[]
}

export interface IConfig {
  fetchConfig: () => Promise<void>
  getConfig: () => IConfigState
}

export type IGradientDirection = 'vertical' | 'horizontal'

export interface IBotMark {
  id: string
  name: string
  color: string
  gradientDirection: IGradientDirection | null
}

export interface IBotParsed {
  id: number
  nickname: string | undefined
  marksIds: string[]
}

export interface IBot {
  id: number
  background: string
  nickname: string | undefined
  marks: IBotMark[]
}

export interface IBotList {
  fillLists: () => Promise<void>
  findBot: (idOrNickname: string | number) => IBot | null
}

export type IElementFoundHandler = (element: HTMLElement) => void
export interface IElementsFinder {
  on: (selector: string, foundHandler: IElementFoundHandler) => void
}

export interface IUserSettings {
  enableMark: (markId: string) => void
  disableMark: (markId: string) => void
  checkIsMarkDisabled: (markId: string) => boolean
}
