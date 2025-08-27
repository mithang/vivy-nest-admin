import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListPostDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'
import { PostService } from './post.service'

/**
 * Post management
 * @author vivy
 */
@ApiTags('Post management')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Post list
   * @param post Post information
   * @returns Post list
   */
  @Get()
  @RequirePermissions('system:post:list')
  async list(@Query() post: ListPostDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.list(post))
  }

  /**
   * Add post
   * @param post Post information
   */
  @Post()
  @Log({ title: 'Post management', operType: OperType.INSERT })
  @RequirePermissions('system:post:add')
  async add(@Body() post: CreatePostDto): Promise<AjaxResult> {
    if (!(await this.postService.checkPostNameUnique(post.postName))) {
      return AjaxResult.error(`Add post ${post.postName} failed, post name already exists`)
    }

    if (!(await this.postService.checkPostCodeUnique(post.postCode))) {
      return AjaxResult.error(`Add post ${post.postName} failed, post code already exists`)
    }

    post.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.postService.add(post))
  }

  /**
   * Update post
   * @param postId Post ID
   * @param post Post information
   */
  @Put(':postId')
  @Log({ title: 'Post management', operType: OperType.UPDATE })
  @RequirePermissions('system:post:update')
  async update(@Param('postId') postId: number, @Body() post: UpdatePostDto): Promise<AjaxResult> {
    if (!(await this.postService.checkPostNameUnique(post.postName, postId))) {
      return AjaxResult.error(`Update post ${post.postName} failed, post name already exists`)
    }

    if (!(await this.postService.checkPostCodeUnique(post.postCode, postId))) {
      return AjaxResult.error(`Update post ${post.postName} failed, post code already exists`)
    }

    post.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.postService.update(postId, post))
  }

  /**
   * Delete post
   * @param postIds Post ID
   */
  @Delete(':postIds')
  @Log({ title: 'Post management', operType: OperType.DELETE })
  @RequirePermissions('system:post:delete')
  async delete(@Param('postIds', new ParseArrayPipe({ items: Number })) postIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.delete(postIds))
  }

  /**
   * Post options list
   * @returns Post options list
   */
  @Get('options')
  async options(): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.options())
  }

  /**
   * Post details
   * @param postId Post ID
   * @returns Post details
   */
  @Get(':postId')
  @RequirePermissions('system:post:query')
  async info(@Param('postId') postId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.info(postId))
  }
}
