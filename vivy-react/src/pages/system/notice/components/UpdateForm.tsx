import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { useRef } from 'react'
import { addNotice, updateNotice, infoNotice } from '@/apis/system/notice'
import type { CreateNoticeParams, NoticeModel } from '@/apis/system/notice'
import { ProFormWangEditor } from '@/components/WangEditor'

interface UpdateFormProps extends DrawerFormProps {
  record?: NoticeModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNoticeType = loadDict('sys_notice_type')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoNotice } = useRequest(infoNotice, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoNotice(record.noticeId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateNoticeParams) => {
    if (record) {
      await updateNotice(record.noticeId, values)
    } else {
      await addNotice(values)
    }
  }

  return (
    <DrawerForm
      {...props}
      width={900}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `Edit Notice Announcement` : `Add Notice Announcement`}
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
      onOpenChange={(open) => {
        open && handleInitial()
        props.onOpenChange?.(open)
      }}
    >
      <ProFormText
        name="noticeTitle"
        label="Notice Title"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormSelect
        name="noticeType"
        label="Notice Type"
        rules={[{ required: true }]}
        fieldProps={{ options: toSelect(sysNoticeType) }}
      />
      <ProFormRadio.Group
        name="status"
        label="Notice Status"
        rules={[{ required: true }]}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
      />
      <ProFormWangEditor name="noticeContent" label="Notice Content" rules={[{ required: true }]} />
    </DrawerForm>
  )
}

export default UpdateForm
