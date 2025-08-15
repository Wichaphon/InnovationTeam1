const fs = require('fs');
const path = require('path');
const files = fs.readdirSync('./prisma/models');
const base = fs.readFileSync('./prisma/base.prisma');
let content = '';

for(const file of files) {
    content += fs.readFileSync(path.join('./prisma/models', file),'utf-8')+'\n';
}

content += base+'\n';

fs.writeFileSync('./prisma/schema.prisma', content);