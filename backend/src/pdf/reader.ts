export interface IPdfReader {
    read(buffer: Buffer): Promise<string>
}
