const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(path.join(__dirname, './text.txt'));
let output = '';

stream.on('data', function(data) {
    output += data;
}).on('end', function() {
    console.log(output);
})
