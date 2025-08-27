import { Injectable } from '@nestjs/common'
import { Taskable } from '../utils/taskable.decorator'

@Taskable()
@Injectable()
export class HttpTask {
  calc() {
    console.log('Calculate big data')
  }
}
