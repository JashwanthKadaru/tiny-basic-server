const express = require('express')
const fs = require('fs')
const app = express()
const port = 3008

var cors = require('cors')
app.use(cors())
app.use(express.json())

// Initialize an empty array to store the JSON data.
let data = []

// Read data from data.js file, if it exists
if (fs.existsSync('data.js')) {
  data = require('./data')
}

// POST endpoint for creating a new page
app.post('/post/newpage', (req, res) => {
  const newPage = req.body

  console.log(newPage)

  let newDatum = JSON.parse(newPage.data)
  // Generate an incremental ID
  newDatum.id = data.length + 1

  // Push the new page data into the array
  data.push(newDatum)

  // Save the data to a JavaScript file
  fs.writeFileSync(
    'data.js',
    'module.exports = ' + JSON.stringify(data, null, 2)
  )

  res
    .status(201)
    .json({ message: 'Page created successfully', page: newPage.data })
})

// GET endpoint to retrieve a page by ID
app.get('/get/pages/:id', (req, res) => {
  const id = parseInt(req.params.id)

  // Find the page with the given ID
  const page = data.find((page) => page.id === id)

  if (!page) {
    res.status(404).json({ status: 404, message: 'Page not found' })
    console.log('Page not found')
  } else {
    res.status(200).json({ status: 404, message: JSON.stringify(page) })
    console.log(JSON.stringify(page))
    console.log(page)
    console.log('Page found')
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
