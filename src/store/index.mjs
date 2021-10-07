import { createStore } from 'vuex'

const importedModules = import.meta.glob('./*.js')

const modules = {}

for (const path in importedModules) {
  const resModule = await importedModules[path]()
  const key = path.replace('./', '').replace('.js', '')
  modules[key] = resModule.default
}

export default createStore({
  modules
})
