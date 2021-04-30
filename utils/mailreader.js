const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');

function readUserMails(user) {
    return new Promise((resolve, reject) => {
        fs.readFile(`/var/spool/mail/${user}`, 'utf8', async(err, data) => {
            if(err){
                reject(err);
            } else {
                const split = data.split('\n');

                const separatorIndices = split
                  .filter((line) => !!line.match(new RegExp(/From\s+.*/, 'g')))
                  .map((line) => split.indexOf(line));
                
                const mails = separatorIndices
                  .map((index, i) => split.slice(index, i + 1 < separatorIndices.length ? separatorIndices[i + 1] : split.length).join('\n'));
                
                const tasks = [];
            
                mails.forEach((rawMail) => {
                  tasks.push(simpleParser(rawMail));
                });
            
                const parsed = await Promise.all(tasks);
                resolve(parsed);
            }  
        });
    });
}

module.exports = readUserMails;