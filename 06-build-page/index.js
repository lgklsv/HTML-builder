const fs = require('fs');
const fsP = fs.promises;
const path = require('path');
const assetsPath = path.join(__dirname, './project-dist', './assets');
const projectDistPath = path.join(__dirname, './project-dist');

async function copyDir(dir, dest) {
    try {
        const files = await fsP.readdir(dir, { withFileTypes: true });
    
        for (const file of files) {
            const srcPath = path.join(dir, file.name);
            const destPath = path.join(dest, file.name);
            if(file.isDirectory()) {
                copyDir(srcPath, destPath);
            }
            else {
                await fsP.mkdir(dest, { recursive: true });
                fs.copyFile(srcPath, destPath, (err) => {
                    if (err) throw err;
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function mergeStyles(output) {
    try {  
        const files = await fsP.readdir(path.join(__dirname, './styles'), { withFileTypes: true });
        const outputArr = [];

        for (const file of files)  {
            const extention = path.extname(file.name);

            if(extention === '.css' && file.isFile()) {
                const componentCSS = await fsP.readFile(path.join(__dirname, './styles', file.name), { encoding: "utf-8" })
                outputArr.push(componentCSS + '\n');
            }
        }
        output.write(outputArr.join(''));
    } catch (err) {
        console.error(err);
    }
}

async function mergeMarkup(template, output) {
    try {  
        const files = await fsP.readdir(path.join(__dirname, './components'), { withFileTypes: true });
        let outputMarkup = await fsP.readFile(template, { encoding: "utf-8" });

        for (const file of files) {
            const extention = path.extname(file.name);
            const fileName = path.parse(file.name).name;

            if(extention === '.html' && file.isFile()) {
                const componentMarkup = await fsP.readFile(path.join(__dirname, './components', file.name), { encoding: "utf-8" })
                outputMarkup = outputMarkup.replace(`{{${fileName}}}`, componentMarkup);
            }
        }
        output.write(outputMarkup);
    } catch (err) {
        console.error(err);
    }
}

async function buildProject() {
    try {
        try {
            await fsP.access(assetsPath, fsP.constants.R_OK | fsP.constants.W_OK);
            console.log('the folder exists, updating...');
            await fsP.rm(assetsPath, { recursive: true });
        } catch {
            console.log('there is no folder yet, creating...');
        }

        await fsP.mkdir(projectDistPath, { recursive: true });
        await fsP.mkdir(assetsPath, { recursive: true });

        const stylesOutput = fs.createWriteStream(path.join(projectDistPath, './style.css'));
        const markupOutout = fs.createWriteStream(path.join(projectDistPath, './index.html'));

        copyDir(path.join(__dirname, './assets'), assetsPath);
        mergeStyles(stylesOutput);
        mergeMarkup(path.join(__dirname, './template.html'), markupOutout);

    } catch (err) {
        console.error(err);
    }
}
buildProject();