import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { Button, message } from 'antd'
import Clipboard from 'clipboard'
import prettyBytes from 'pretty-bytes'
import { useEffect, useRef, useState } from 'react'
import { listFile, fileUseOptions } from '@/apis/file'
import type { FileModel } from '@/apis/file'
import UploadForm from './components/UploadForm'
import UploadsForm from './components/UploadsForm'

const File = () => {
  const actionRef = useRef<ActionType>()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadsOpen, setUploadsOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * File usage options
   */
  const { data: fileUseData } = useRequest(fileUseOptions)

  /**
   * Table column configuration
   */
  const columns: ProColumns<FileModel>[] = [
    {
      title: 'File Usage',
      dataIndex: 'fileUse',
      valueType: 'select',
      fieldProps: { options: fileUseData },
    },
    {
      title: 'File Path',
      dataIndex: 'fileUrl',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      search: false,
      render: (_, record) => {
        return prettyBytes(record.fileSize)
      },
    },
    {
      title: 'File Type',
      dataIndex: 'fileType',
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
        <Button key="copy" type="link" className="copy" data-clipboard-text={record.fileUrl}>
          Copy Address
        </Button>,
      ],
    },
  ]

  /**
   * Copy address
   */
  useEffect(() => {
    const clipboard = new Clipboard('.copy')
    clipboard.on('success', () => {
      message.success('Copy successful')
    })
    return () => {
      clipboard.destroy()
    }
  }, [])

  return (
    <>
      <ProTable
        rowKey="fileId"
        headerTitle="File List"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listFile({
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
              key="upload"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setUploadOpen(true)
              }}
            >
              Single Upload
            </Button>,
            <Button
              key="uploads"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setUploadsOpen(true)
              }}
            >
              Multiple Upload
            </Button>,
          ],
        }}
      />

      <UploadForm open={uploadOpen} onOpenChange={setUploadOpen} onFinish={async () => actionRef.current?.reload()} />

      <UploadsForm
        open={uploadsOpen}
        onOpenChange={setUploadsOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  )
}

export default File
