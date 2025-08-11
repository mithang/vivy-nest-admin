import { Icon } from '@umijs/max'
import { Card } from 'antd'

export const items = [
  {
    title: 'Home',
    icon: 'ion:home-outline',
    color: '#1fdaca',
  },
  {
    title: 'Dashboard',
    icon: 'ion:grid-outline',
    color: '#bf0c2c',
  },
  {
    title: 'Components',
    icon: 'ion:layers-outline',
    color: '#e18525',
  },
  {
    title: 'System Management',
    icon: 'ion:settings-outline',
    color: '#3fb27f',
  },
  {
    title: 'Permission Management',
    icon: 'ion:key-outline',
    color: '#4daf1bc9',
  },
  {
    title: 'Charts',
    icon: 'ion:bar-chart-outline',
    color: '#00d8ff',
  },
]

export default () => {
  return (
    <Card title="Quick Navigation" className="w-full">
      {items.map((item) => (
        <Card.Grid key={item.title}>
          <span className="flex flex-col items-center">
            <Icon icon={item.icon as any} color={item.color} width="20px" height="20px" />
            <span className="mt-2 text-md">{item.title}</span>
          </span>
        </Card.Grid>
      ))}
    </Card>
  )
}
