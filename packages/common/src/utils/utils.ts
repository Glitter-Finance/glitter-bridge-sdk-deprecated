export class InputParams  {

    static get(field: string): string | undefined {
        let argv = require('minimist')(process.argv.slice(2));
        return argv[field];
    }
}
