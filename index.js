const prompt = require('prompt');
const { run } = require('./src/runner');

const promptSchema = [
    'Enter your art URL'
]

prompt.get(promptSchema, (err, result) => {
    const url = result[promptSchema[0]];
    run(url);
});
