let fs = require("fs")
const express = require("express")
const app = express()
const chokidar = require('chokidar');

let myData = new Set;

// Function to get the created date of a file in Millseconds
function createdDate (file) {  
    const { birthtimeMs } = fs.statSync(file)
    return birthtimeMs
  }

// One-liner for current directory - watch for new files in the directory
chokidar.watch('./datafolder').on('add', (path) => {
    // When a new file enters the watched directory - call function to get the contents
    getFileContents(path);
  });

// Function to read the contents of the file passed in and write to a Set
function getFileContents(path) {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log("ERROR: " + data)
        }
        else {
            let parsed = [JSON.parse(data), createdDate(path)]
            myData.add(parsed) 
        }
    })
}

// Create an express server that provides the data when requested
app.get('/', function (res) {
    res.send(Array.from(myData))
})

app.listen(1337)