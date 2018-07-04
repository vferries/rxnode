import * as fs from 'fs';
import * as path from 'path';
import {of, bindNodeCallback, Observable} from 'rxjs';
import {concatAll, flatMap} from 'rxjs/operators';

const readdir = bindNodeCallback(fs.readdir);

export const readdirDeep = (folder: string): Observable<string> => readdir(folder).pipe(
    concatAll(),
    flatMap(file => {
        const filePath = path.join(folder, file);
        return fs.statSync(filePath).isDirectory() ? readdirDeep(filePath) : of(filePath)
    })
);

readdirDeep('node_modules/tslib')
    .subscribe(console.log, console.error, () => console.log('complete'));
