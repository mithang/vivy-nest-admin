import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ServiceException, BaseStatusEnum } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { SysUserPost } from '@/modules/system/user/entities/sys-user-post.entity'
import { ListPostDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'
import { SysPost } from './entities/sys-post.entity'

/**
 * Post management
 * @author vivy
 */
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPost)
    private postRepository: Repository<SysPost>,

    @InjectRepository(SysUserPost)
    private userPostRepository: Repository<SysUserPost>
  ) {}

  /**
   * Post list
   * @param post Post information
   * @returns Post list
   */
  async list(post: ListPostDto): Promise<Pagination<SysPost>> {
    return paginate<SysPost>(
      this.postRepository,
      {
        page: post.page,
        limit: post.limit,
      },
      {
        order: {
          postSort: 'ASC',
        },
        where: {
          status: post.status,
          postName: isNotEmpty(post.postName) ? Like(`%${post.postName}%`) : undefined,
          postCode: isNotEmpty(post.postCode) ? Like(`%${post.postCode}%`) : undefined,
        },
      }
    )
  }

  /**
   * Add post
   * @param post Post information
   */
  async add(post: CreatePostDto): Promise<void> {
    await this.postRepository.insert(post)
  }

  /**
   * Update post
   * @param postId Post ID
   * @param post Post information
   */
  async update(postId: number, post: UpdatePostDto): Promise<void> {
    await this.postRepository.update(postId, post)
  }

  /**
   * Delete post
   * @param postIds Post ID
   */
  async delete(postIds: number[]): Promise<void> {
    for (const postId of postIds) {
      const count = await this.userPostRepository.countBy({ postId })
      if (count > 0) {
        const post = await this.postRepository.findOneBy({ postId })
        throw new ServiceException(`${post.postName} has been assigned, cannot delete`)
      }
    }

    await this.postRepository.delete(postIds)
  }

  /**
   * Post details
   * @param postId Post ID
   * @returns Post details
   */
  async info(postId: number): Promise<SysPost> {
    return this.postRepository.findOneBy({ postId })
  }

  /**
   * Check if post name is unique
   * @param postName Post name
   * @param postId Post ID
   * @returns true unique / false not unique
   */
  async checkPostNameUnique(postName: string, postId?: number): Promise<boolean> {
    const info = await this.postRepository.findOneBy({ postName })
    if (info && info.postId !== postId) {
      return false
    }

    return true
  }

  /**
   * Check if post code is unique
   * @param postCode Post code
   * @param postId Post ID
   * @returns true unique / false not unique
   */
  async checkPostCodeUnique(postCode: string, postId?: number): Promise<boolean> {
    const info = await this.postRepository.findOneBy({ postCode })
    if (info && info.postId !== postId) {
      return false
    }

    return true
  }

  /**
   * Post options list
   * @returns Post options list
   */
  async options(): Promise<SysPost[]> {
    return this.postRepository.find({
      select: ['postId', 'postName', 'postCode'],
      order: {
        postSort: 'ASC',
      },
      where: {
        status: BaseStatusEnum.NORMAL,
      },
    })
  }

  /**
   * Query post list by user ID
   * @param userId User ID
   * @returns User post list
   */
  async selectPostByUserId(userId: number): Promise<SysPost[]> {
    return this.postRepository
      .createQueryBuilder('p')
      .leftJoin('sys_user_post', 'up', 'p.post_id = up.post_id')
      .where('up.user_id = :userId', { userId })
      .andWhere('p.status = :status', { status: BaseStatusEnum.NORMAL })
      .getMany()
  }
}
