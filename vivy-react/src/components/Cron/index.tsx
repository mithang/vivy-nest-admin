import parser from 'cron-parser'
import CronEval from './CronEval'
import CronTab from './CronTab'

const cronValidate = (value: string) => {
  try {
    parser.parseExpression(value)
    return true
  } catch (e) {
    return false
  }
}

export { CronTab, CronEval, cronValidate }
