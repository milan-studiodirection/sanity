import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'r0nmxv5e',
    dataset: 'production'
  },
  deployment: {
    appId: 'lbm8br8tr4obw97i1n3tktm4',
    autoUpdates: true,
  }
})
