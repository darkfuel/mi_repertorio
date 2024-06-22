import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/', (req, res) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  res.sendFile(__dirname + '/index.html')
})

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
    const { id, titulo, artista, tono } = req.body
    if (id === undefined || titulo === undefined || artista === undefined || tono === undefined) {
      throw new Error('Todos los campos son obligatorios')
    }
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

app.put('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params
    const cancion = req.body
    const canciones = JSON.parse(fs.readFileSync('data/repertorio.json'))
    // filtar canción a actualizar
    const index = canciones.findIndex((cancion) => cancion.id === id)
    // validación de existencia
    if (index === -1) {
      res.status(404).send('El ítem seleccionado no existe')
    } else {
    // reescribir registro
      canciones[index] = cancion
      fs.writeFileSync('data/repertorio.json', JSON.stringify(canciones))
      res.status(200).json({ message: 'Canción actualizada' })
    }
  } catch (error) {
    res.status(501).json({ menssage: `No se pudo actualizar la cancion ${error.message}` })
  }
})
app.delete('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params
    // const cancion = req.body
    const canciones = JSON.parse(fs.readFileSync('data/repertorio.json'))
    // filtrar canción para eliminar
    const index = canciones.findIndex((cancion) => cancion.id === id)
    // validación y recorte de arreglo
    index === -1
      ? res.status(404).send('El ítem seleccionado no existe')
      : (canciones.splice(index, 1),
        fs.writeFileSync('data/repertorio.json', JSON.stringify(canciones)),
        res.status(200).json({ message: 'Canción eliminada' }))
  } catch (error) {
    res.status(501).json({ menssage: `No se pudo actualizar la cancion ${error.message}` })
  }
})
app.all('/*', (req, res) => res.json({ code: 404, message: 'URL no existe' }))

app.listen(PORT, () => console.log('servidor inciado...'))
