/**
 * Code generation common constants
 * @author vivy
 */
export class GenConstants {
  /** Owner */
  static AUTHOR = 'vivy'

  /** Module name */
  static MODULE = 'system'

  /** Database string type */
  static COLUMNTYPE_STR = ['char', 'varchar', 'nvarchar', 'varchar2']

  /** Database text type */
  static COLUMNTYPE_TEXT = ['tinytext', 'text', 'mediumtext', 'longtext']

  /** Database time type */
  static COLUMNTYPE_TIME = ['datetime', 'time', 'date', 'timestamp']

  /** Database number type */
  static COLUMNTYPE_NUMBER = [
    'tinyint',
    'smallint',
    'mediumint',
    'int',
    'number',
    'integer',
    'bigint',
    'float',
    'double',
    'decimal',
  ]

  /** Page fields that do not need editing */
  static COLUMNNAME_NOT_EDIT = ['id', 'create_by', 'create_time', 'update_by', 'update_time']

  /** Page fields that do not need to be displayed in the list */
  static COLUMNNAME_NOT_LIST = ['id', 'create_by', 'create_time', 'update_by', 'update_time']

  /** Page fields that do not need querying */
  static COLUMNNAME_NOT_QUERY = ['id', 'create_by', 'create_time', 'update_by', 'update_time']

  /** Entity base class fields */
  static BASE_ENTITY = ['createBy', 'createTime', 'updateBy', 'updateTime']

  /** Text box */
  static HTML_INPUT = 'input'

  /** Number box */
  static HTML_NUMBER = 'number'

  /** Text area */
  static HTML_TEXTAREA = 'textarea'

  /** Dropdown box */
  static HTML_SELECT = 'select'

  /** Radio box */
  static HTML_RADIO = 'radio'

  /** Checkbox */
  static HTML_CHECKBOX = 'checkbox'

  /** Date control */
  static HTML_DATETIME = 'datetime'

  /** Upload control */
  static HTML_UPLOAD = 'upload'

  /** Rich text control */
  static HTML_EDITOR = 'editor'

  /** TS string type */
  static TS_TYPE_STRING = 'string'

  /** TS number type */
  static TS_TYPE_NUMBER = 'number'

  /** TS unknown type */
  static TS_TYPE_UNKNOWN = 'unknown'

  /** JAVA string type */
  static JAVA_TYPE_STRING = 'String'

  /** JAVA integer type */
  static JAVA_TYPE_INTEGER = 'Integer'

  /** JAVA long integer type */
  static JAVA_TYPE_LONG = 'Long'

  /** JAVA floating point type */
  static JAVA_TYPE_DOUBLE = 'Double'

  /** JAVA high precision calculation type */
  static JAVA_TYPE_BIGDECIMAL = 'BigDecimal'

  /** JAVA time type */
  static JAVA_TYPE_DATE = 'Date'

  /** Fuzzy query */
  static QUERY_LIKE = 'LIKE'

  /** Equal query */
  static QUERY_EQ = 'EQ'

  /** Required */
  static REQUIRE = '1'
}
