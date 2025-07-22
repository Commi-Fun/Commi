import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import neostandard from 'neostandard'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: [
      '.next/',
      'node_modules/',
      'dist/',
      '.pnpm-store/',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...neostandard(),
]

export default eslintConfig
