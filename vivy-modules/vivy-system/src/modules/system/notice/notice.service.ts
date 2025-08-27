import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ListNoticeDto, CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto'
import { SysNotice } from './entities/sys-notice.entity'

/**
 * Notices and announcements
 * @author vivy
 */
@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(SysNotice)
    private noticeRepository: Repository<SysNotice>
  ) {}

  /**
   * Notices list
   * @param notice Notice information
   * @returns Notices list
   */
  async list(notice: ListNoticeDto): Promise<Pagination<SysNotice>> {
    return paginate<SysNotice>(
      this.noticeRepository,
      {
        page: notice.page,
        limit: notice.limit,
      },
      {
        where: {
          noticeTitle: isNotEmpty(notice.noticeTitle) ? Like(`%${notice.noticeTitle}%`) : undefined,
          noticeType: notice.noticeType,
        },
      }
    )
  }

  /**
   * Add notice
   * @param notice Notice information
   */
  async add(notice: CreateNoticeDto): Promise<void> {
    await this.noticeRepository.insert(notice)
  }

  /**
   * Update notice
   * @param noticeId Notice ID
   * @param notice Notice information
   */
  async update(noticeId: number, notice: UpdateNoticeDto): Promise<void> {
    await this.noticeRepository.update(noticeId, notice)
  }

  /**
   * Delete notice
   * @param noticeIds Notice ID
   */
  async delete(noticeIds: number[]): Promise<void> {
    await this.noticeRepository.delete(noticeIds)
  }

  /**
   * Notice details
   * @param noticeId Notice ID
   * @returns Notice details
   */
  async info(noticeId: number): Promise<SysNotice> {
    return this.noticeRepository.findOneBy({ noticeId })
  }
}
