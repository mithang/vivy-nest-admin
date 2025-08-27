import * as handlebars from 'handlebars'
import { includes, isEqual } from 'lodash'
import { GenUtils } from './gen.utils'

/**
 * Check if includes
 * @param value Value to check
 * @param other Value to check
 */
handlebars.registerHelper('isIn', function (value: any, other: any) {
  return includes(value, other)
})

/**
 * Check if not includes
 * @param value Value to check
 * @param other Value to check
 */
handlebars.registerHelper('notIn', function (value: any, other: any) {
  return !includes(value, other)
})

/**
 * Check if equal
 * @param value Value to check
 * @param other Value to check
 */
handlebars.registerHelper('isEqual', function (value: any, other: any) {
  return isEqual(value, other)
})

/**
 * Check if not equal
 * @param value Value to check
 * @param other Value to check
 */
handlebars.registerHelper('notEqual', function (value: any, other: any) {
  return !isEqual(value, other)
})

/**
 * Check if is required
 * @param value Value to check
 */
handlebars.registerHelper('isRequire', function (value: any) {
  return GenUtils.isRequire(value)
})

/**
 * Check if not required
 * @param value Value to check
 */
handlebars.registerHelper('notRequire', function (value: any) {
  return !GenUtils.isRequire(value)
})
