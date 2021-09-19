import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/axios'
import store from './store/index'
import { ElLoading, ElCard, ElRow, ElCol, ElSpace, ElDivider, ElButton, ElAside, ElMain, ElContainer, ElMenu, ElMenuItem, ElDrawer, ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElSelectV2, ElTag, ElPagination } from 'element-plus'

const app = createApp(App)

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
app.use(ElInputNumber)
app.use(ElSelect)
app.use(ElSelectV2)
app.use(ElTag)
app.use(ElPagination)

app.use(router)
app.use(store)

app.mount('#app')
