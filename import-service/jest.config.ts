import type { Config } from '@jest/types';

type JestConfig = Partial<
  Omit<Config.ProjectConfig, 'moduleNameMapper' | 'transform'> &
    Config.GlobalConfig
> & {
  preset: string;
  transform: Record<string, string>;
};

const config: JestConfig = {
  preset: 'ts-jest',
  rootDir: './',
  roots: ['<rootDir>/src'],
  testRegex: ['.test.ts$', '.spec.ts$'],
  transform: {
    '^.+\\.(tsx|ts)?$': 'ts-jest',
  },
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/src',
    '<rootDir>',
    'src/functions',
    'src/libs',
  ],
};

export default config;
