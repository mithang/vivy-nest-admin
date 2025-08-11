import { CopyOutlined } from '@ant-design/icons'
import { Button, Modal, ModalProps, Tabs } from 'antd'
import Clipboard from 'clipboard'
import { useEffect, useState } from 'react'
import { previewCode } from '@/apis/gen/gen'
import type { GenTableModel, GenPreviewResult } from '@/apis/gen/gen'
import { Message } from '@/components/App'

interface UpdateFormProps extends ModalProps {
  record: GenTableModel
}

const removePrefix = (str: string) => {
  return str.split('/').slice(1).join('/')
}

const PreviewModal: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  /**
   * Query preview
   */
  const [codeInfo, setCodeInfo] = useState<GenPreviewResult[]>([])
  const getCodeData = async () => {
    const data = await previewCode(record.tableName)
    setCodeInfo(data)
  }

  /**
   * Copy code
   */
  useEffect(() => {
    const clipboard = new Clipboard('.copy')
    clipboard.on('success', () => {
      Message.success('Copy successful')
    })
    return () => {
      clipboard.destroy()
    }
  }, [])

  return (
    <Modal
      {...props}
      title="Code Preview"
      footer={null}
      width={1000}
      afterOpenChange={(open) => {
        open && getCodeData()
        props.afterOpenChange?.(open)
      }}
    >
      <Tabs
        tabBarStyle={{ marginBottom: 0 }}
        items={codeInfo.map((item: GenPreviewResult) => ({
          key: item.name,
          label: item.name,
          children: (
            <Tabs
              items={(item.files || []).map((file) => ({
                key: file.name,
                label: removePrefix(file.name),
                children: (
                  <div className="relative">
                    <pre>{file.code}</pre>
                    <Button
                      className="absolute top-0 right-0 copy"
                      data-clipboard-text={file.code}
                      type="link"
                      icon={<CopyOutlined />}
                    >
                      Copy
                    </Button>
                  </div>
                ),
              }))}
            />
          ),
        }))}
      />
    </Modal>
  )
}

export default PreviewModal
