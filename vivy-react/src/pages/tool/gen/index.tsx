import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Popconfirm } from 'antd'
import { saveAs } from 'file-saver'
import React, { useRef, useState } from 'react'
import { listGenTable, deleteGenTable, syncDbTable, downloadCode } from '@/apis/gen/gen'
import type { GenTableModel } from '@/apis/gen/gen'
import ImportModal from './components/ImportModal'
import PreviewModal from './components/PreviewModal'
import UpdateForm from './components/UpdateForm'

const Gen = () => {
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<GenTableModel>()
  const [importOpen, setImportOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * Sync table structure
   * @param tableName Table name
   */
  const handleSync = async (tableName: React.Key) => {
    await syncDbTable(tableName)
  }

  /**
   * Delete record table
   * @param tableIds Table IDs
   */
  const handleDelete = async (tableIds: React.Key) => {
    await deleteGenTable(tableIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * Download code
   * @param tableName Table name
   */
  const handleDownload = async (tableName: React.Key) => {
    const { data } = await downloadCode(tableName)
    saveAs(data, `${tableName}.zip`)
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
    {
      title: 'Entity',
      dataIndex: 'className',
      search: false,
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: 'Action',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Button
          key="preview"
          type="link"
          onClick={() => {
            setRecord(record)
            setPreviewOpen(true)
          }}
        >
          Preview
        </Button>,
        <Button
          key="update"
          type="link"
          onClick={() => {
            setRecord(record)
            setUpdateOpen(true)
          }}
        >
          Edit
        </Button>,
        <Popconfirm
          key="delete"
          title="Are you sure you want to delete?"
          onConfirm={() => handleDelete(record.tableId)}
        >
          <Button type="link">Delete</Button>
        </Popconfirm>,
        <Popconfirm
          key="sync"
          title="Are you sure you want to force sync table structure?"
          onConfirm={() => handleSync(record.tableName)}
        >
          <Button type="link">Sync</Button>
        </Popconfirm>,
        <Button key="gen" type="link" onClick={() => handleDownload(record.tableName)}>
          Generate
        </Button>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="tableId"
        headerTitle="Generation List"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listGenTable({
            ...params,
            page: params.current,
            limit: params.pageSize,
          })
          return {
            data: items,
            total: meta.totalItems,
          }
        }}
        toolbar={{
          actions: [
            <Button
              key="gen"
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                setImportOpen(true)
              }}
            >
              Import
            </Button>,
            <Popconfirm
              key="delete"
              title="Are you sure you want to delete?"
              disabled={!selectedRowKeys.length}
              onConfirm={() => handleDelete(selectedRowKeys.join(','))}
            >
              <Button icon={<DeleteOutlined />} type="primary" danger disabled={!selectedRowKeys.length}>
                Delete
              </Button>
            </Popconfirm>,
          ],
        }}
      />

      <ImportModal
        open={importOpen}
        onOk={() => {
          setImportOpen(false)
          actionRef.current?.reload()
        }}
        onCancel={() => {
          setImportOpen(false)
        }}
      />

      <UpdateForm
        record={record!}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => {
          actionRef.current?.reload()
        }}
      />

      <PreviewModal
        record={record!}
        open={previewOpen}
        onCancel={() => {
          setPreviewOpen(false)
        }}
      />
    </>
  )
}

export default Gen
