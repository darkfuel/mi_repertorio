import express from 'express'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/canciones', (req, res) => {
  // obtener data
  try {
    const canciones = JSON.parse(fs.readFileSync('data/repertorio.json'))
    res.status(200).json(canciones)
  } catch (error) {
    res.status(404).send('Error al obtener datos')
  }
})

app.post('/canciones', (req, res) => {
  try {
    const cancion = req.body
    // obtener data
    const canciones = JSON.parse(fs.readFileSync('data/repertorio.json'))
    // modificar data
    canciones.push(cancion)
    // guardar data
    fs.writeFileSync('data/repertorio.json', JSON.stringify(canciones))
    res.status(200).json({ message: 'Canción agregada' })
  } catch (error) {
    res.status(400).send(`No es posible crear la canción:   ${error.message}`)
  }
})

app.put('/canciones/:id', (req, res) => { })
app.delete('/canciones/:id', (req, res) => { })
app.all('/*', (req, res) => res.json({ code: 404, message: 'URL no existe' }))

app.listen(PORT, () => console.log('servidor inciado...'))
