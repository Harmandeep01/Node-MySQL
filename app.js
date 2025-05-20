import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import {getNotes, getNote, insert, deleteFields} from './database.js'

const app = express();
app.use(express.json())

const PORT = 8080 || process.env.PORT

app.get('/notes', async (req, res) => {
    const notes = await getNotes();
    res.send(notes);
})

app.get('/note/:id', async (req, res) => {
    const id = req.params.id
    if(!id){
        return res.status(400).json({
            error : 'Missing id parameter'
        })
    }
    try {
        const note = await getNote(id);
        if(!note || note.length === 0){
            return res.status(404).json({
                error : 'Note not found'
            })
        }
        res.json(note);
    } catch (error) {
        console.log(error, error.message);
         res.status(500).json({ 
                error: 'Internal server error'
             });
    }
})

app.post('/notes', async (req, res) => {
    const {title, contents} = req.body;
    const result = await insert(title, contents);
    console.log(result)
    res.status(201).send(result)
})

app.delete('/delete/:tableName', async(req, res) => {
    const tableName = req.params.tableName
    const result = await deleteFields(tableName)
    res.send(result);
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}/`)
})