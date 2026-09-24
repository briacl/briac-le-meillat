const fs = require('fs');
const path = require('path');

const srcAssetsDir = path.join(__dirname, '../src/assets');
const rtDir = path.join(__dirname, '../src/content/rt');
const nbDir = path.join(__dirname, '../src/content/NetworkBriac');

const extractImagesFromMarkdown = (dir) => {
    let images = new Set();
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            const nestedImages = extractImagesFromMarkdown(fullPath);
            nestedImages.forEach(img => images.add(img));
        } else if (file.name.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Regex to find images in frontmatter: image: "/assets/projects/img.png"
            const fmMatches = [...content.matchAll(/image:\s*['"]?(?:.*\/)?([^\/]+?\.(?:png|jpg|jpeg|webp|gif|svg))['"]?/g)];
            // Regex to find markdown images: ![alt](/assets/projects/img.png)
            const mdMatches = [...content.matchAll(/!\[.*?\]\((?:.*\/)?([^\/]+?\.(?:png|jpg|jpeg|webp|gif|svg))\)/g)];
            
            fmMatches.forEach(m => images.add(m[1]));
            mdMatches.forEach(m => images.add(m[1]));
        }
    }
    return images;
};

const moveImages = (targetImages, destFolder) => {
    targetImages.forEach(imgName => {
        const sourcePath = path.join(srcAssetsDir, imgName);
        const destPath = path.join(srcAssetsDir, destFolder, imgName);
        if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()) {
            fs.renameSync(sourcePath, destPath);
            console.log(`Moved ${imgName} to ${destFolder}/`);
        }
    });
};

console.log('Extracting RT images...');
const rtImages = extractImagesFromMarkdown(rtDir);
console.log('RT images found:', Array.from(rtImages).length);
moveImages(rtImages, 'rt');

console.log('Extracting NetworkBriac images...');
const nbImages = extractImagesFromMarkdown(nbDir);
console.log('NetworkBriac images found:', Array.from(nbImages).length);
moveImages(nbImages, 'NetworkBriac');

console.log('Moving remaining files to projects...');
const remainingFiles = fs.readdirSync(srcAssetsDir, { withFileTypes: true });
for (const file of remainingFiles) {
    if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
            const sourcePath = path.join(srcAssetsDir, file.name);
            const destPath = path.join(srcAssetsDir, 'projects', file.name);
            fs.renameSync(sourcePath, destPath);
            console.log(`Moved remaining ${file.name} to projects/`);
        }
    }
}

console.log('Done!');
