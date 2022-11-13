const fs = require('fs');

const dir = 'build/';

fs.rm(dir, { recursive: true }, (err) => {
    if (err) {
        if (err.errno === -4058) {
            console.log('No cleaning required');
            return
        }
    }

    console.log('Clean complete');
});