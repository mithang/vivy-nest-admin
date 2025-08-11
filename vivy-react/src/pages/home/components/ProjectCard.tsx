import { Icon } from '@umijs/max'
import { Card, Typography } from 'antd'

export const items = [
  {
    title: 'Github',
    icon: 'ion:logo-github',
    color: '',
    desc: "Don't wait for opportunities, create them.",
    group: 'Open Source Team',
    date: '2023-09-14',
  },
  {
    title: 'Vue',
    icon: 'ion:logo-vue',
    color: '#3fb27f',
    desc: 'The present you determines the future you.',
    group: 'Algorithm Team',
    date: '2023-09-14',
  },
  {
    title: 'Html5',
    icon: 'ion:logo-html5',
    color: '#e18525',
    desc: 'No talent is more important than hard work.',
    group: 'Work Slacking',
    date: '2023-09-14',
  },
  {
    title: 'Angular',
    icon: 'ion:logo-angular',
    color: '#bf0c2c',
    desc: 'Passion and desire can overcome all difficulties.',
    group: 'UI',
    date: '2023-09-14',
  },
  {
    title: 'React',
    icon: 'ion:logo-react',
    color: '#00d8ff',
    desc: 'A healthy body is the cornerstone of achieving goals.',
    group: 'Tech Experts',
    date: '2023-09-14',
  },
  {
    title: 'Js',
    icon: 'ion:logo-javascript',
    color: '#4daf1bc9',
    desc: 'The road is walked out, not imagined.',
    group: 'Architecture Team',
    date: '2023-09-14',
  },
]

export default () => {
  return (
    <Card title="Projects" extra={<Typography.Link>More</Typography.Link>} className="w-full">
      {items.map((item) => (
        <Card.Grid key={item.title}>
          <span className="flex">
            <Icon icon={item.icon as any} color={item.color} width="30px" height="30px" />
            <span className="ml-4 text-lg">{item.title}</span>
          </span>
          <Typography.Text type="secondary" className="flex h-10 mt-2">
            {item.desc}
          </Typography.Text>
          <Typography.Text type="secondary" className="flex justify-between">
            <span>{item.group}</span>
            <span>{item.date}</span>
          </Typography.Text>
        </Card.Grid>
      ))}
    </Card>
  )
}
