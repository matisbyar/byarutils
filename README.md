# byarutils

> Simple, powerful, lightweight helpers library to assist your projects

[![NPM](https://img.shields.io/npm/v/byarutils.svg)](https://www.npmjs.com/package/byarutils) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save byarutils
```

## Usage

```jsx
import Logger from 'byarutils'
import ErrorHandler from 'byarutils'

function send(to, subject, body) {
  try {
    // ...
    Logger.log('SUCCESS', 'Mail Sender Service', 'Mail sent successfully to: ' + to)
  } catch (error) {
    Logger.log('ERROR', 'Mail Sender Service', 'Mail sending failed to: ' + to)
    ErrorHandler.addToPool(send, [to, subject, body], 3)
  }
}

```

## License

MIT © [matisbyar](https://github.com/matisbyar)
