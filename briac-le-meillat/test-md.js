const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkRehype = require('remark-rehype');
const rehypeStringify = require('rehype-stringify');

const markdown = '```bash title="monparefeu.sh"\necho "hello"\n```';
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

const vfile = processor.processSync(markdown);
console.log(vfile.toString());
