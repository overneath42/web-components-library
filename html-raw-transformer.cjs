const fs = require('fs');
const path = require('path');

module.exports = {
  process(src, filename) {
    // Remove the ?raw suffix for the actual file path
    const rawPath = filename.replace(/\?raw$/, '');
    const content = fs.readFileSync(rawPath, 'utf8');
    return {
      code: `module.exports = ${JSON.stringify(content)};`,
    };
  },
};
