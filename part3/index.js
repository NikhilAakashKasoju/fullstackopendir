
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

app.use(express.static("dist"))


morgan.token("body", (request, response) => {
    return JSON.stringify(request.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const len = persons.length
    const date = new Date()

    response.send(`<p>Phonebook has info for ${len} people</p>
        <p>${date}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    let newId
    do {
        newId = String(Math.floor(Math.random() * 10000))
    } while (persons.find(n => n.id === newId))
    return newId
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(404).json({
            error: "missing-content"
        })
    }

    const nameExists = persons.find(p => p.name === body.name)
    if (nameExists) {
        return response.status(404).json({
            error: "name must be unique"
        })
    }

    const personObject = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(personObject)
    response.json(personObject)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})