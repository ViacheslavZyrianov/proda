import { createStore } from 'vuex'

const importedModules = import.meta.glob('./*.js')

const modules = {}

(async () => {
  for (const path in importedModules) {
    const importedModulesPath = await importedModules[path]()
    const key = path.replace('./', '').replace('.js', '')
    modules[key] = importedModulesPath.default
  }
})()

export default createStore({
  modules
})