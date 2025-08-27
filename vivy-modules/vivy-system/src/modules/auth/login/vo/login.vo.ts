/**
 * Captcha
 */
export class CaptchaVo {
  /* Captcha img */
  img: string

  /* Captcha uuid */
  uuid: string
}
/**
 * Route tree
 */
export class RouterTreeVo {
  /** Menu name */
  name: string

  /** Path, can be set as a web link */
  path: string

  /** Menu icon */
  icon: string

  /** Custom menu internationalization key */
  locale: string | false

  /** Component path, find component element through path */
  component: string

  /** Submenu */
  children: RouterTreeVo[]

  /** Hide self and child nodes in menu */
  hideInMenu: boolean

  /** Hide child nodes in menu */
  hideChildrenInMenu: boolean

  /** When this node is selected, parentKeys nodes will also be selected */
  parentKeys: string[]
}
