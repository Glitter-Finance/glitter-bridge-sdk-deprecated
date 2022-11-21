import * as minimist from 'minimist'

export class InputParams  {

    static get(field: string): string | undefined {
        const argv = minimist(process.argv.slice(2));
        return argv[field];
    }
}
