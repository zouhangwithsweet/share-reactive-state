import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import axios from 'axios'
import bodyParser from 'body-parser'
import qs from 'qs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(bodyParser.urlencoded({ extended: false }))
        server.middlewares.use('/api', async (req: any, res) => {
          const { data } = await axios.post(`https://sim01-api.honghusaas.com/biz-api/v1/driver${req.url}`, qs.stringify(req.body), {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            }
          })
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify(data)
          )
        })
      },
    },
  ],
  server: {
    port: 5173,
  },
})
