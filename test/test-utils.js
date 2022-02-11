const execaWrap = require('execa-wrap');

function execWrapper (cmd, args, options = {}) {
    return execaWrap(cmd, args, options).then(adjustExitCode);
}

/** Adjust execa-Wrap exit code.
 *  In some environments (Windows) it's returning codes higher than 255 for negative exit codes
 */
function adjustExitCode(text) {
    const match = /code: (-?\d+)/.exec(text);
    if (match == null) {
        return text;
    }
    const codeText = match[1];
    try {
        const code = Number.parseInt(codeText);
        if (code >= Math.pow(2, 32) - 256 && code < Math.pow(2, 32)) {
            const adjustedCode = 256 - (Math.pow(2, 32) - code);
            return text.replace(`code: ${codeText}`, `code: ${adjustedCode}`);
        }
    } catch (err) {
    }
    return text;
}

module.exports = {
    execaWrap: execWrapper,
};
