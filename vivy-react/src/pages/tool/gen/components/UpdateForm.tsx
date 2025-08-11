import { type DrawerFormProps, type ProFormInstance, DrawerForm } from '@ant-design/pro-components'
import { Tabs } from 'antd'
import { useRef, useState } from 'react'
import { infoGenTable, updateGenTable } from '@/apis/gen/gen'
import type { GenTableModel, GenTableColumnModel, UpdateGenParams } from '@/apis/gen/gen'
import UpdateFormBase from './UpdateFormBase'
import UpdateFormColumn from './UpdateFormColumn'

interface UpdateFormProps extends DrawerFormProps {
  record: GenTableModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * Get initialization data
   */
  const [tableInfo, setTableInfo] = useState<GenTableModel>()
  const getTableColumnData = async () => {
    formRef.current?.resetFields()
    const data = await infoGenTable(record.tableId)
    setTableInfo(data)
    formRef.current?.setFieldsValue(data)
  }

  /**
   * Submit form
   * @param values Form values
   */
  const handleSubmit = async (values: UpdateGenParams) => {
    if (tableInfo) {
      await updateGenTable({
        ...values,
        columns: tableInfo.columns,
        tableId: tableInfo.tableId,
      })
    }
    formRef.current?.resetFields()
  }

  return (
    <DrawerForm
      {...props}
      width={'95vw'}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
      drawerProps={{ styles: { body: { paddingTop: 0 } } }}
      formRef={formRef}
      title={record ? `Edit Table` : `Add Table`}
      onOpenChange={(open) => {
        open && getTableColumnData()
        props.onOpenChange?.(open)
      }}
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: `Basic Information`,
            children: <UpdateFormBase />,
          },
          {
            key: '2',
            label: 'Field Information',
            children: (
              <UpdateFormColumn
                value={tableInfo?.columns || []}
                onChange={(newColumns: GenTableColumnModel[]) => {
                  setTableInfo({
                    ...tableInfo!,
                    columns: newColumns,
                  })
                }}
              />
            ),
          },
        ]}
      />
    </DrawerForm>
  )
}

export default UpdateForm
