import path from 'node:path'

export const treatDirname = (dirname: string) => {
    return dirname.replace("/dist/", "/");
}

export const mocksDir = () => {
    return path.resolve(treatDirname(__dirname), "..", "mocks");
}
