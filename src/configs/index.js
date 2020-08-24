import app from './app.js'
import url from './url.js'
import name from './name.js'
import ws from './ws.js'

let config = {
  ...app,
  ...url,
  ...name,
  ws,
}

export default config
