import * as migration_20260508_013319 from './20260508_013319';
import * as migration_20260508_020000 from './20260508_020000';

export const migrations = [
  {
    up: migration_20260508_013319.up,
    down: migration_20260508_013319.down,
    name: '20260508_013319'
  },
  {
    up: migration_20260508_020000.up,
    down: migration_20260508_020000.down,
    name: '20260508_020000'
  },
];
