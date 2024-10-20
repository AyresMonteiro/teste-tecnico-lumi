import { PdfReader as LibPdfReader, Error as LibError, DataEntry as LibDataEntry } from "pdfreader";
import { IPdfReader } from "../reader";

export class PdfReaderLib implements IPdfReader {
    read(buffer: Buffer): Promise<string> {
        return new Promise<string>((res, rej) => {
            let contentChunks: string[] = [];

            new LibPdfReader().parseBuffer(buffer, (err: LibError, data: LibDataEntry) => {
                if (err) {
                    return rej(err)
                }

                if (data?.text !== undefined) {
                    contentChunks.push(String(data.text));
                }

                if (data === undefined || data === null) {
                    return res(contentChunks.join("\n"));
                }
            })
        })

    }
}
