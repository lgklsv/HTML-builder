const fs = require('fs');
const fsP = fs.promises;
const path = require('path');
const stylesPath = path.join(__dirname, './styles');

async function mergeStyles() {
    try { 
        const output = fs.createWriteStream(path.join(__dirname, './project-dist', 'bundle.css'));
        const files = await fsP.readdir(stylesPath, { withFileTypes: true });
        const outputArr = [];
        
        for (const file of files) {
            const extention = path.extname(file.name);
            if(extention === '.css' && file.isFile()) {
                const componentCSS = await fsP.readFile(path.join(stylesPath, file.name), { encoding: "utf-8" })
                outputArr.push(componentCSS + '\n');
            }
        }
        output.write(outputArr.join(''));
    } catch (err) {
        console.error(err);
    }
}
mergeStyles();