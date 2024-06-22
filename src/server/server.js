import express from 'express'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/canciones', (req, res) => {
  // obtener data
  try {
    const data = fs.readFileSync('data/repertorio.json')
    const canciones = JSON.parse(data)
    res.status(200).json(canciones)
  } catch (error) {
    res.status(404).send('Error al obtener datos')
  }
})

app.post('/canciones', (req, res) => {
  // obtener data
  // modificar data
  // guardar data
  try {
    console.log(req.body)
  } catch (error) {
    res.status(400).send(`No es posible crear la canción:   ${error.message}`)
  }
})

app.put('/canciones/:id', (req, res) => { })
app.delete('/canciones/:id', (req, res) => { })
app.all('/*', (req, res) => res.json({ code: 404, message: 'URL no existe' }))

app.listen(PORT, () => console.log('servidor inciado...'))
