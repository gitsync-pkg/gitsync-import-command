import * as fs from 'fs';
import {createRepo, runCommand} from '@gitsync/test';
import {default as imp} from '..';

describe('import command', () => {
  test('run import', async () => {
    const source = await createRepo();
    const target = await createRepo();

    await target.commitFile('test.txt');

    await runCommand(imp, source, {
      sourceDir: 'package-name',
      target: target.dir,
      targetDir: '.',
    });

    expect(fs.existsSync(source.getFile('package-name/test.txt'))).toBeTruthy();
  });
});
