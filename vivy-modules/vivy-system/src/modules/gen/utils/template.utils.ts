import * as camelcase from 'camelcase'
import * as decamelize from 'decamelize'
import * as handlebars from 'handlebars'
import * as pluralize from 'pluralize'
import './handlebars.helpers'
import { GenTableColumn } from '../gen/entities/gen-table-column.entity'
import { GenTable } from '../gen/entities/gen-table.entity'
import { GenConstants } from './gen.constants'
import { GenUtils } from './gen.utils'

interface TemplateItem {
  name: string
  files: string[]
}

interface ColumnContext extends GenTableColumn {
  /** Property display name */
  fieldLabel?: string

  /** Dictionary type camelCase */
  dictTypeCamelcase?: string

  /** Database type information */
  columnLength?: string
  columnPrecision?: string
  columnScale?: string
}

interface CompileContext extends GenTable {
  /**
   * Constant values
   */
  constants: GenConstants

  /**
   * Interface naming
   */
  controllerName: string

  /**
   * Entity class naming format
   */
  classNameCamelcase: string
  classNamePascalCase: string
  classNameKebabCase: string

  /**
   * Business name naming format
   */
  businessNameCamelcase: string
  businessNamePascalCase: string
  businessNameKebabCase: string

  /**
   * Primary key column
   */
  pkColumn: ColumnContext

  /**
   * Dictionary columns
   */
  dictColumn: ColumnContext[]

  /**
   * Label types
   */
  htmlTypeList: string[]
}

/**
 * Template utility class
 * @author vivy
 */
export class TemplateUtils {
  /**
   * Get template list
   * @return Template list
   */
  static getTemplateList(): TemplateItem[] {
    return [
      {
        name: 'Nest',
        files: [
          'nest/[name].module.hbs',
          'nest/[name].controller.hbs',
          'nest/[name].service.hbs',
          'nest/dto/[name].dto.hbs',
          'nest/entities/[name].entity.hbs',
          'nest/[name].mapper.hbs',
          'nest/[name].mapper.xml.hbs',
        ],
      },
      {
        name: 'React',
        files: ['react/index.hbs', 'react/components/UpdateForm.hbs', 'react/apis/index.hbs', 'react/apis/model.hbs'],
      },
    ]
  }

  /**
   * Get file name
   * @param template Template name
   * @param table Generation table information
   * @return File generation path
   */
  static getFileName(template: string, table: GenTable) {
    let name = ''
    const context = this.getCompileContext(table)

    // Nest
    if (template.startsWith('nest')) {
      if (template.startsWith('nest/entities')) {
        name = template.replace('.hbs', '.ts').replace('[name]', context.classNameKebabCase)
      } else if (template.endsWith('mapper.xml.hbs')) {
        name = template.replace('.hbs', '').replace('[name]', context.businessNameKebabCase)
      } else {
        name = template.replace('.hbs', '.ts').replace('[name]', context.businessNameKebabCase)
      }
    }

    // React
    if (template.startsWith('react')) {
      if (template.startsWith('react/apis')) {
        name = template.replace('.hbs', '.ts')
      } else {
        name = template.replace('.hbs', '.tsx')
      }
    }

    return name
  }

  /**
   * Compile template code
   * @param template Template content
   * @param table Generation table information
   * @return Template result
   */
  static compileTemplate(template: string, table: GenTable) {
    const context = this.getCompileContext(table)
    return handlebars.compile(template)(context)
  }

  /**
   * Build compilation context
   * @param Generation table information
   * @returns Context
   */
  static getCompileContext(table: GenTable) {
    const context: CompileContext = table as CompileContext

    /**
     * Constant values
     */
    context.constants = GenConstants

    /**
     * Interface naming
     */
    context.controllerName = pluralize(decamelize(table.businessName, { separator: '-' }))

    /**
     * Entity class naming format
     */
    context.classNameCamelcase = camelcase(table.className)
    context.classNamePascalCase = camelcase(table.className, { pascalCase: true })
    context.classNameKebabCase = decamelize(table.className, { separator: '-' })

    /**
     * Business name naming format
     */
    context.businessNameCamelcase = camelcase(table.businessName)
    context.businessNamePascalCase = camelcase(table.businessName, { pascalCase: true })
    context.businessNameKebabCase = decamelize(table.businessName, { separator: '-' })

    /**
     * Column processing
     */
    table.columns.forEach((column: ColumnContext) => {
      // Extract label name from column comment
      if (column.columnComment) {
        column.fieldLabel = column.columnComment.replace(/\(.+\)/, '').replace(/（.+）/, '')
      }

      // Get variable name from dictionary type
      if (column.dictType) {
        column.dictTypeCamelcase = camelcase(column.dictType)
      }

      // Get field length from column field type
      if (column.columnType) {
        const dataType = GenUtils.getColumnType(column.columnType)
        if (GenConstants.COLUMNTYPE_NUMBER.includes(dataType)) {
          const match = GenUtils.getColumnMatchLength(column.columnType)?.split(',')
          if (match && match.length === 2) {
            column.columnPrecision = match[0]
            column.columnScale = match[1]
          }
        } else {
          const match = GenUtils.getColumnMatchLength(column.columnType)?.split(',')
          if (match && match.length) {
            column.columnLength = match[0]
          }
        }
        column.columnType = dataType
      }
    })

    /**
     * Primary key column
     */
    context.pkColumn = table.columns.find((column) => GenUtils.isRequire(column.isPk))
    if (!context.pkColumn) {
      context.pkColumn = table.columns[0]
    }

    /**
     * Dictionary columns
     */
    context.dictColumn = []
    table.columns.forEach((column: ColumnContext) => {
      if (column.dictType) {
        context.dictColumn.push(column)
      }
    })

    /**
     * Label types
     */
    context.htmlTypeList = []
    table.columns.forEach((column: ColumnContext) => {
      if (column.htmlType) {
        context.htmlTypeList.push(column.htmlType)
      }
    })

    return context
  }
}
