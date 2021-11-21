import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/axios'
import store from './store/index'
import { ElIcon, ElCheckbox, ElCheckboxGroup, ElCheckboxButton, ElDatePicker, ElPopover, ElLoading, ElCard, ElRow, ElCol, ElSpace, ElDivider, ElButton, ElAside, ElMain, ElContainer, ElMenu, ElMenuItem, ElDrawer, ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElSelectV2, ElTag, ElPagination, ElScrollbar, ElLink, ElSteps, ElStep, ElSwitch } from 'element-plus'
import 'element-plus/theme-chalk/display.css'
import icons from './plugins/icons/index'

const app = createApp(App)

icons(app)

app.use(ElSwitch)
app.use(ElSteps)
app.use(ElStep)
app.use(ElIcon)
app.use(ElLink)
app.use(ElScrollbar)
app.use(ElCheckbox)
app.use(ElCheckboxGroup)
app.use(ElCheckboxButton)
app.use(ElDatePicker)
app.use(ElPopover)
app.use(ElLoading)
app.use(ElCard)
app.use(ElRow)
app.use(ElCol)
app.use(ElSpace)
app.use(ElDivider)
app.use(ElContainer)
app.use(ElAside)
app.use(ElMain)
app.use(ElButton)
app.use(ElMenu)
app.use(ElMenuItem)
app.use(ElDrawer)
app.use(ElTable)
app.use(ElTableColumn)
app.use(ElDialog)
app.use(ElForm)
app.use(ElFormItem)
app.use(ElInput)
app.use(ElSelect)
app.use(ElSelectV2)
app.use(ElTag)
app.use(ElPagination)

app.use(router)
app.use(store)

app.mount('#app')
