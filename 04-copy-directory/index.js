const fs = require('fs');
const fsP = fs.promises;
const path = require('path');

const filesDir = path.join(__dirname, './files');
const filesCopyDir = path.join(__dirname, './files-copy');

async function copyDir() {
    try {  
        try {
            await fsP.access(filesCopyDir, fsP.constants.R_OK | fsP.constants.W_OK);
            console.log('the folder exists, updating...');
            await fsP.rm(filesCopyDir, { recursive: true });
        } catch {
            console.log('there is no folder yet, creating...');
        }
        const createDir = await fsP.mkdir(filesCopyDir, { recursive: true });
        const files = await fsP.readdir(filesDir, { withFileTypes: true });

        for (const file of files) {
            if(file.isFile()) {
                fs.copyFile(path.join(filesDir, file.name), path.join(createDir, file.name), (err) => {
                    if (err) throw err;
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
}
copyDir();