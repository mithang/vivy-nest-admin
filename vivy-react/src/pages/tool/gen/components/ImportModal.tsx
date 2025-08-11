import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal, ModalProps } from 'antd'
import { useRef, useState } from 'react'
import { listDbTable, importDbTable } from '@/apis/gen/gen'
import type { GenTableModel } from '@/apis/gen/gen'

const ImportModal: React.FC<ModalProps> = (props) => {
  const actionRef = useRef<ActionType>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * Submit import
   */
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleSubmit = async (e: any) => {
    if (!selectedRowKeys.length) return

    setConfirmLoading(true)
    await importDbTable(selectedRowKeys.join(','))
    setConfirmLoading(false)

    setSelectedRowKeys([])
    props.onOk?.(e)
  }

  /**
   * Table column configuration
   */
  const columns: ProColumns<GenTableModel>[] = [
    {
      title: 'Table Name',
      dataIndex: 'tableName',
    },
    {
      title: 'Table Description',
      dataIndex: 'tableComment',
    },
  ]

  return (
    <Modal
      {...props}
      title="Import List"
      width={1000}
      confirmLoading={confirmLoading}
      onOk={handleSubmit}
      afterOpenChange={(open) => {
        open && actionRef.current?.reload()
        props.afterOpenChange?.(open)
      }}
    >
      <ProTable
        rowKey="tableName"
        bordered
        toolBarRender={false}
        columns={columns}
        actionRef={actionRef}
        pagination={{ pageSize: 8 }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        manualRequest
        request={async (params) => {
          const items = await listDbTable({
            tableName: params.tableName,
            tableComment: params.tableComment,
          })
          return {
            data: items,
            total: items.length,
          }
        }}
      />
    </Modal>
  )
}

export default ImportModal
