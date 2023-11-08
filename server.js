const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const app = express()
const port = 3008

var cors = require('cors')
app.use(cors())
app.use(express.json())

// Create a storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/91939/Desktop/TinyMCEProject/server/public/images') // Set the destination folder for image storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // Rename uploaded file with a unique name
  },
})

const upload = multer({ storage: storage })

// Initialize an empty array to store the JSON data.
let data = []

// Read data from data.js file, if it exists
if (fs.existsSync('data.js')) {
  data = require('./data')
}

app.get('/public/images/:file_name', (req, res) => {
  let file_name = req.params.file_name
  res.sendFile(`${__dirname}/public/images/${file_name}`)
})
// Set up an endpoint to handle image uploads
app.post('/upload/images', upload.single('image'), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  console.log(req.params)

  const imagePath = req.file.path
  const imageUrl = `http://localhost:${port}/public/images/${path.basename(
    imagePath
  )}`

  console.log(imagePath)
  const serverImageDirectory = path.join(__dirname, 'public/images') // Define the directory where you want to save images
  const newImagePath = path.join(serverImageDirectory, path.basename(imagePath)) // Construct the path for the new image

  fs.mkdirSync(serverImageDirectory, { recursive: true }) // Create the directory if it doesn't exist
  fs.renameSync(imagePath, newImagePath) // Move the uploaded image to the specified directory

  console.log({ url: imageUrl, status: 'OK' })
  console.log(newImagePath)
  res.json({ url: imageUrl, status: 'OK' })
})
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
