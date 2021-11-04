import fs from 'fs';
import readline from 'readline';

export default async (path: string) => {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const linesArr: string[] = [];
  for await (const line of rl) {
    linesArr.push(line);
  }

  return linesArr;
};
