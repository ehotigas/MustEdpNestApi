import { parse, ParserOptionsArgs } from '@fast-csv/parse';
import { createReadStream } from 'fs';



type CsvParserOptions<T> = {
    encoding?: BufferEncoding;
    options?: ParserOptionsArgs;
    formatter?: (row: T) => T;
}

export interface ICsvParser {
    parse<T>(path: string): Promise<T[]>;
    parse<T>(path: string, options: CsvParserOptions<T>): Promise<T[]>;
}


export class CsvParser implements ICsvParser {
    public async parse<T>(path: string, options: CsvParserOptions<T> = { encoding: "latin1", options: { headers: true, delimiter: ";" } }): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const results: T[] = [];
            
            createReadStream(path, { encoding: options.encoding })
                .pipe(parse(options.options || { 
                    headers: true, 
                    delimiter: ';' 
                }))
                .on('data', (data) => {
                    results.push(options.formatter ? options.formatter(data) : data);
                })
                .on('end', () => resolve(results))
                .on('error', (err) => reject(err));
        });

    }
}
