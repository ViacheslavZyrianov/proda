import * as ElPlusIcons from '@element-plus/icons'
import iconsList from './iconsList'

export default async app => {
  iconsList.forEach(({ name, tag }) => {
    const iconTag = tag || name.toLowerCase()
    app.component(iconTag, ElPlusIcons[name])
  })
}