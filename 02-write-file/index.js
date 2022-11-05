const path = require('path');
const fs = require('fs');
const { stdout, stdin } = process;
const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'));

stdout.write('Hi, enter something to the file: \n');
stdin.on('data', line => {
    if(line.toString() == 'exit\n') {
        console.log('The end of input, bye...');
        process.exit();
    }
    output.write(line);
});
process.on('SIGINT', () => {
    console.log('\nThe end of input, bye...');
    process.exit();
});
