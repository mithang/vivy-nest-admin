import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { Button, Modal, Space } from 'antd'
import { useRef, useState } from 'react'
import { addJob, updateJob, infoJob } from '@/apis/monitor/job'
import type { CreateJobParams, JobModel } from '@/apis/monitor/job'
import { cronValidate, CronTab } from '@/components/Cron'

interface UpdateFormProps extends DrawerFormProps {
  record?: JobModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * Register dictionary data
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysJobGroup = loadDict('sys_job_group')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * Get initialization data
   */
  const { run: runInfoJob } = useRequest(infoJob, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoJob(record.jobId)
  }

  /**
   * Cron expression generation
   */
  const [cronOpen, setCronOpen] = useState(false)
  const [cronValue, setCronValue] = useState('')

  /**
   * Submit form
   * @param values Form values
   */
  const handleSubmit = async (values: CreateJobParams) => {
    if (record) {
      await updateJob(record.jobId, values)
    } else {
      await addJob(values)
    }
  }

  return (
    <>
      <DrawerForm
        {...props}
        layout="horizontal"
        labelCol={{ flex: '100px' }}
        formRef={formRef}
        title={record ? `Edit Scheduled Task` : `Add Scheduled Task`}
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
        <ProFormText name="jobName" label="Task Name" rules={[{ required: true }]} fieldProps={{ maxLength: 100 }} />
        <ProFormSelect
          name="jobGroup"
          label="Task Group"
          rules={[{ required: true }]}
          fieldProps={{ options: toSelect(sysJobGroup) }}
        />
        <ProFormText
          name="invokeTarget"
          label="Invoke Target"
          rules={[{ required: true }]}
          fieldProps={{ maxLength: 500 }}
        />
        <ProFormText name="invokeParams" label="Invoke Parameters" fieldProps={{ maxLength: 500 }} />
        <Space.Compact style={{ width: '100%', display: 'flex' }}>
          <ProFormText
            name="cronExpression"
            label="Cron Expression"
            rules={[
              { required: true },
              {
                validator(_, value) {
                  if (cronValidate(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Cron expression format is incorrect'))
                },
              },
            ]}
            fieldProps={{ maxLength: 100 }}
            formItemProps={{ style: { flex: 1 } }}
          />
          <Button type="primary" onClick={() => setCronOpen(true)}>
            Generate Expression
          </Button>
        </Space.Compact>
        <ProFormRadio.Group
          name="status"
          label="Status"
          fieldProps={{ options: toSelect(sysNormalDisable) }}
          initialValue={'0'}
        />
        <ProFormTextArea name="remark" label="Remark" fieldProps={{ maxLength: 500, showCount: true }} />
        <Modal
          title="Cron Expression Generator"
          width={1000}
          open={cronOpen}
          onCancel={() => setCronOpen(false)}
          destroyOnClose
          onOk={() => {
            setCronOpen(false)
            formRef.current?.setFieldsValue({
              cronExpression: cronValue,
            })
          }}
        >
          <CronTab onChange={setCronValue} />
        </Modal>
      </DrawerForm>
    </>
  )
}

export default UpdateForm
