const ncp = require('ncp').ncp;

ncp('src/', 'build/', {
    filter: f => {
        return !f.endsWith('.ts') && !f.endsWith('.js') && f !== 'tsconfig.json'
    }
}, err => {
    if (err) {
        return console.error(err);
    }

    console.log('Resources prepared');
});