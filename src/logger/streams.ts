import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { promisify } from 'util';
import ph from 'path';
import { stdout, stderr } from 'process';
import { ConfigService } from '@nestjs/config';

const fsStat = promisify(fs.stat);
const fsRename = promisify(fs.rename);
const fsMkdir = promisify(fs.mkdir);
const fsAccess = promisify(fs.access);

type StreamsWriteFunc = (message: string) => void;
type PropsRenameFileFunc = { pathFile: string; nameFile: string; dir: string };

@Injectable()
export class Streams {
  constructor(private configService: ConfigService) {}
  private renameFile = async ({ pathFile, nameFile, dir }: PropsRenameFileFunc): Promise<void> => {
    try {
      await fsRename(
        pathFile,
        `${ph.format({
          dir,
          base: nameFile,
        })}`,
      );
    } catch (e) {
      throw Error(e);
    }
  };

  private reCreateFileLog = async (pathFile: string): Promise<void> => {
    const { dir, base } = ph.parse(pathFile);
    const stats = await fsStat(pathFile);
    const LOG_REWRITE_EVERY_DAY = this.configService.get<string>('LOG_REWRITE_EVERY_DAY');

    if (LOG_REWRITE_EVERY_DAY) {
      const birthDate = new Date(stats.birthtimeMs).getDate();
      const currentDate = new Date().getDate();
      const dateStamp = stats.birthtime.toLocaleDateString();

      if (currentDate !== birthDate) {
        const nameFile = `${dateStamp}_${base}`;
        await this.renameFile({ pathFile, nameFile, dir });

        return;
      }
    }

    const LOG_REWRITE_OVERSIZE = this.configService.get('LOG_REWRITE_OVERSIZE') as number;
    if (LOG_REWRITE_OVERSIZE !== 0 && stats.size > LOG_REWRITE_OVERSIZE) {
      const dateStamp = stats.birthtime.toLocaleDateString();
      const timeStamp = stats.birthtime.toLocaleTimeString().split(':');
      const nameFile = `${dateStamp}_${timeStamp.join('-')}_${base}`;
      await this.renameFile({ pathFile, nameFile, dir });
    }
  };

  private createDir = async (pathDir: string): Promise<void> => {
    try {
      await fsMkdir(pathDir, { recursive: true });
    } catch (e) {
      throw Error(e);
    }
  };

  private createWritable = (pathFile: string): fs.WriteStream =>
    fs.createWriteStream(pathFile, {
      encoding: 'utf8',
      flags: 'a',
    });

  private accessFile = async (pathFile: string): Promise<fs.WriteStream | null> => {
    const DIR_LOG = this.configService.get('DIR_LOG') as string;
    try {
      // eslint-disable-next-line no-bitwise
      await fsAccess(pathFile, fs.constants.F_OK | fs.constants.W_OK);
      await this.reCreateFileLog(pathFile);
    } catch (e) {
      switch (true) {
        case (e as NodeJS.ErrnoException).code === 'ENOENT':
          try {
            await this.createDir(DIR_LOG);
          } catch (err) {
            stderr.write(`Directory "${DIR_LOG}" creation error: ${(err as Error).message} /n`);
            stderr.write(`The log file: "${pathFile}" does not exist /n`);
            return null;
          }
          break;

        case (e as NodeJS.ErrnoException).code === 'EPERM':
          stderr.write(`The log file: "${pathFile}" is read-only /n`);
          return null;

        case (e as NodeJS.ErrnoException).code === 'EACCES':
          stderr.write(`The log file: "${pathFile}" is permission denied /n`);
          return null;

        default:
          stderr.write(`${(e as NodeJS.ErrnoException).message} /n`);
          return null;
      }
    }

    const stream = this.createWritable(pathFile);
    return stream;
  };

  public streamErrLog: StreamsWriteFunc = async (message) => {
    const DIR_LOG = this.configService.get('DIR_LOG') as string;
    const ERROR_LOG = this.configService.get('ERROR_LOG') as string;

    const stream = await this.accessFile(`${DIR_LOG}/${ERROR_LOG}`);

    if (stream !== null) {
      stream.write(message);
      stream.end();
    }
  };

  public streamInfoLog: StreamsWriteFunc = async (message) => {
    const INFO_LOG = this.configService.get('INFO_LOG') as string;
    const DIR_LOG = this.configService.get('DIR_LOG') as string;

    const stream = await this.accessFile(`${DIR_LOG}/${INFO_LOG}`);

    if (stream !== null) {
      stream.write(message);
      stream.end();
    }
  };

  public streamConsLog: StreamsWriteFunc = (message) => {
    const stream = stdout;
    stream.write(message);
  };
}
