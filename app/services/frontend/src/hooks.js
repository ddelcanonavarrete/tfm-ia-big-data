#! /usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const DEFAULT_RESPONSE = 0;
const ERROR_RESPONSE = -1;

const executeCommand = (command) => {
    let result = DEFAULT_RESPONSE;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.error(`global error while removing the hooks`, err);
            result = ERROR_RESPONSE;
            return;
        }

        // the *entire* stdout and stderr (buffered)
        // console.log(`echo stdout: ${stdout}`);
        // console.log(`echo stderr: ${stderr}`);
    });

    return result;
};

const getCommandName = () => {
    let command = '';

    switch (process.platform) {
        case 'win32':
            command = `rmdir /s /q`
            break;

        default:
            command = 'rm -rf';
            break;
    }

    return command;
}

const init = () => {
    const command = getCommandName();
    const basepath = '../../../..';
    const hooksFilename = '.git/hooks/';
    let result = DEFAULT_RESPONSE;

    // https://flaviocopes.com/how-to-check-if-file-exists-node/
    fs.access([basepath, hooksFilename].join('/'), fs.F_OK, (err) => {
        if (err) {
            // console.error(err)
            console.log('The hooks have already been deleted, or couldn\'t be found');
            return;
        }

        //file exists
        result = executeCommand(`cd ${basepath} && ${command} "./${hooksFilename}"`);
    });

    if (result == ERROR_RESPONSE) {
        console.error('An error ocurred while trying to delete the git hooks');
    }

    process.exit(result);
};
init();