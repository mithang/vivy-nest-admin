import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ListFileDto, CreateFileDto } from './dto/file.dto'
import { SysFile } from './entities/sys-file.entity'

/**
 * File management
 * @author vivy
 */
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(SysFile)
    private fileRepository: Repository<SysFile>
  ) {}

  /**
   * File list
   * @param file File information
   * @returns File list
   */
  async list(file: ListFileDto): Promise<Pagination<SysFile>> {
    return paginate<SysFile>(
      this.fileRepository,
      {
        page: file.page,
        limit: file.limit,
      },
      {
        where: {
          fileUse: file.fileUse,
          fileUrl: isNotEmpty(file.fileUrl) ? Like(`%${file.fileUrl}%`) : undefined,
        },
        order: {
          createTime: 'DESC',
        },
      }
    )
  }

  /**
   * Add file
   * @param file File information
   */
  async add(file: CreateFileDto | CreateFileDto[]): Promise<void> {
    await this.fileRepository.insert(file)
  }

  /**
   * File usage options
   * @returns File usage options list
   */
  async useOptions(): Promise<string[]> {
    const data = await this.fileRepository.find({ select: ['fileUse'] })
    return [...new Set(data.map((item) => item.fileUse))]
  }
}
