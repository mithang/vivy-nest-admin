import * as camelcase from 'camelcase'
import { GenTableColumn } from '../gen/entities/gen-table-column.entity'
import { GenTable } from '../gen/entities/gen-table.entity'
import { GenConstants } from './gen.constants'

/**
 * Code generator utility class
 * @author vivy
 */
export class GenUtils {
  /**
   * Check if current value is "required"
   * @param val Value
   */
  static isRequire(val: any) {
    return val === GenConstants.REQUIRE
  }

  /**
   * Initialize table information (update the passed object)
   * @param table Table information
   */
  static initTable(table: GenTable) {
    table.updateTime = undefined
    table.className = this.getClassName(table.tableName)
    table.moduleName = GenConstants.MODULE
    table.businessName = this.getBusinessName(table.tableName)
    table.functionName = this.getFunctionName(table.tableComment)
    table.functionAuthor = GenConstants.AUTHOR
  }

  /**
   * Initialize column attribute fields (update the passed object)
   * @param column Column information
   * @param table Table information
   */
  static initColumn(column: GenTableColumn, table: GenTable) {
    const dataType = this.getColumnType(column.columnType)
    const columnName = column.columnName

    // Set initial values
    column.tableId = table.tableId
    column.createBy = table.createBy
    column.fieldName = camelcase(columnName)
    column.queryType = GenConstants.QUERY_EQ
    column.tslangType = GenConstants.TS_TYPE_STRING
    column.javalangType = GenConstants.JAVA_TYPE_STRING

    // Edit fields
    if (!GenConstants.COLUMNNAME_NOT_EDIT.includes(columnName) && !this.isRequire(column.isPk)) {
      column.isEdit = GenConstants.REQUIRE
      column.isInsert = GenConstants.REQUIRE
    }

    // List fields
    if (!GenConstants.COLUMNNAME_NOT_LIST.includes(columnName) && !this.isRequire(column.isPk)) {
      column.isList = GenConstants.REQUIRE
    }

    // Query fields
    if (!GenConstants.COLUMNNAME_NOT_QUERY.includes(columnName) && !this.isRequire(column.isPk)) {
      column.isQuery = GenConstants.REQUIRE
    }

    // Database string type
    if (GenConstants.COLUMNTYPE_STR.includes(dataType)) {
      const match = +this.getColumnMatchLength(column.columnType)
      // If string length exceeds 500, set to text area
      column.htmlType = match >= 500 ? GenConstants.HTML_TEXTAREA : GenConstants.HTML_INPUT
    }
    // Database text type
    else if (GenConstants.COLUMNTYPE_TEXT.includes(dataType)) {
      column.htmlType = GenConstants.HTML_TEXTAREA
    }
    // Database time type
    else if (GenConstants.COLUMNTYPE_TIME.includes(dataType)) {
      column.htmlType = GenConstants.HTML_DATETIME
      column.javalangType = GenConstants.JAVA_TYPE_DATE
    }
    // Database number type
    else if (GenConstants.COLUMNTYPE_NUMBER.includes(dataType)) {
      column.htmlType = GenConstants.HTML_NUMBER
      column.tslangType = GenConstants.TS_TYPE_NUMBER
      const match = this.getColumnMatchLength(column.columnType)?.split(',')
      // If floating point
      if (match && match.length === 2 && +match[0] > 0) {
        column.javalangType = GenConstants.JAVA_TYPE_BIGDECIMAL
      }
      // If integer
      else if (match && match.length === 1 && +match[0] <= 10) {
        column.javalangType = GenConstants.JAVA_TYPE_INTEGER
      }
      // Fallback to long integer
      else {
        column.javalangType = GenConstants.JAVA_TYPE_LONG
      }
    }

    // Query field type
    if (this.endsWithIgnoreCase(columnName, '(name)')) {
      column.queryType = GenConstants.QUERY_LIKE
    }

    // Status field set to radio box
    if (this.endsWithIgnoreCase(columnName, '(status)')) {
      column.htmlType = GenConstants.HTML_RADIO
    }
    // Gender & type fields set to dropdown box
    else if (this.endsWithIgnoreCase(columnName, '(sex|type)')) {
      column.htmlType = GenConstants.HTML_SELECT
    }
    // Image & file fields set to image upload control
    else if (this.endsWithIgnoreCase(columnName, '(file|image)')) {
      column.htmlType = GenConstants.HTML_UPLOAD
    }
    // Content fields set to rich text control
    else if (this.endsWithIgnoreCase(columnName, 'content')) {
      column.htmlType = GenConstants.HTML_EDITOR
    }
  }

  /**
   * Get entity name (converted to PascalCase)
   * @param tableName Table name
   * @return Class name
   */
  static getClassName(tableName: string): string {
    return camelcase(tableName, { pascalCase: true })
  }

  /**
   * Get business name (last word separated by "_")
   * @param tableName Table name
   * @return Business name
   */
  static getBusinessName(tableName: string): string {
    const arr = tableName.split('_')
    return camelcase(arr[arr.length - 1])
  }

  /**
   * Get function name (remove special characters from table comment)
   * @param tableComment Table comment information
   * @return Function name
   */
  static getFunctionName(tableComment: string): string {
    return tableComment.replace(/(?:table)/g, '')
  }

  /**
   * Get database type field
   * @param columnType Column type
   * @return Extracted column type
   */
  static getColumnType(columnType: string): string {
    if (columnType.indexOf('(') > 0) {
      return columnType.substring(0, columnType.indexOf('('))
    } else {
      return columnType
    }
  }

  /**
   * Get field length
   * @param columnType Column type
   * @return Matched length information
   */
  static getColumnMatchLength(columnType: string): string | null {
    return columnType.match(/(?<=\().*(?=\))/)?.[0]
  }

  /**
   * Check if ends with specified character
   * @param content String content
   * @param matchContent Content to match
   * @return true/false
   */
  static endsWithIgnoreCase(content: string, matchContent: string): boolean {
    return new RegExp(`${matchContent}$`, 'i').test(content)
  }
}
