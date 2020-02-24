import {CommandModule} from 'yargs';
import Sync, {SyncArguments} from '@gitsync/sync';
import {Config} from '@gitsync/config';

const command: CommandModule = {
  handler: () => {},
};

command.command = 'import <target> <source-dir> [target-dir]';

command.describe = 'Sync the commits from the specify repository to current repository';

command.builder = {
  target: {
    describe: 'The target repository URL or path to be synchronized',
  },
  'source-dir': {
    describe: 'Directory in the current repository to be synchronized',
  },
  'target-dir': {
    describe: 'Directory in the target repository to be synchronized',
    default: '.',
  },
  'include-branches': {
    describe: 'Include only branch with names matching the given glob',
    default: [],
    type: 'array',
  },
  'exclude-branches': {
    describe: 'Exclude branch with names matching the given glob',
    default: [],
    type: 'array',
  },
  'include-tags': {
    describe: 'Include only tag with names matching the given glob',
    default: [],
    type: 'array',
  },
  'exclude-tags': {
    describe: 'Exclude tag with names matching the given glob',
    default: [],
    type: 'array',
  },
  'add-tag-prefix': {
    describe: 'Add prefix to tag names before syncing',
    default: '',
    type: 'string',
  },
  'remove-tag-prefix': {
    describe: 'Restrict tag names with the specified prefix to sync and remove the prefix before syncing',
    default: '',
    type: 'string',
  },
  'no-tags': {
    describe: 'Whether to sync tags',
    default: false,
    type: 'boolean',
  },
  'preserve-commit': {
    describe: 'Whether to preserve original author and committer name, email and date',
    default: true,
    type: 'boolean',
  },
  'max-count': {
    describe: 'Limit the number of commits to compare for syncing',
    type: 'number',
  },
  after: {
    describe: 'Sync commits after specified date',
    type: 'string',
  },
  filter: {
    describe: 'Pattern used to limit sync paths',
    default: [],
    type: 'array',
  },
  squash: {
    describe: 'Create only one commit that contains all the new commits',
    default: false,
    type: 'boolean',
  },
  'squash-base-branch': {
    describe: 'When squash a new branch, create new branch from this branch',
    default: 'master',
    type: 'string',
  },
  yes: {
    describe: 'Whether to skip confirm or not',
    alias: 'y',
    type: 'boolean',
  },
};

command.handler = async (argv: SyncArguments) => {
  const repo = argv;
  const config = new Config();

  const cwd = process.cwd();
  const repoDir = await config.getRepoDirByRepo(repo, true);
  process.chdir(repoDir);

  [repo.sourceDir, repo.targetDir] = [repo.targetDir, repo.sourceDir];
  [repo.addTagPrefix, repo.removeTagPrefix] = [repo.removeTagPrefix, repo.addTagPrefix];
  repo.target = cwd;

  const sync = new Sync();
  return sync.sync(repo);
};

export default command;
