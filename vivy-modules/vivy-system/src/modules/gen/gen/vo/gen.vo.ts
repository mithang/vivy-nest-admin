/**
 * Code generation preview
 */
export class GenPreviewVo {
  /** Category name */
  name: string

  /** File list */
  files: Array<{
    /** File name */
    name: string

    /** File code */
    code: string
  }>
}
