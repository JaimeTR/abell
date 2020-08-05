const path = require('path');
const expect = require('chai').expect;

const {
  getProgramInfo,
  renderMarkdown,
  buildContentMap,
  getAbellConfig,
  addPrefixInHTMLPaths
} = require('../src/utils/build-utils.js');

describe('getProgramInfo()', () => {
  before(() => {
    process.chdir('tests/test-utils/resources/test_demo');
  });

  it('should return the base info for program to execute', async () => {
    expect(getProgramInfo())
      .to.be.an('object')
      .to.have.keys([
        'abellConfig',
        'contentMap',
        'templateMap',
        'task',
        'port',
        'logs'
      ]);
  });

  after(() => {
    process.chdir('../../../..')
  });
});


describe('buildContentMap()', () => {
  before(() => {
    process.chdir('tests/test-utils/resources/test_demo');
  });

  it('should return all the information about the content', () => {
    const contentMap = buildContentMap(path.resolve('./content'));

    expect(Object.keys(contentMap)).to.eql([
      'another-blog',
      'my-first-blog',
      `my-first-blog${path.sep}sub-blog`
    ]);

    expect(contentMap['another-blog'].$root).to.equal('..')

    expect(contentMap[`my-first-blog${path.sep}sub-blog`].$root)
      .to.equal(`..${path.sep}..`)

  });

  after(() => {
    process.chdir('../../../..')
  });
});


describe('getAbellConfig()', () => {
  before(() => {
    process.chdir('tests/test-utils/resources/test_demo');
  });

  it('should return siteName from abell.config.js', () => {
    // prettier-ignore
    expect(getAbellConfig().globalMeta.siteName)
      .to.equal('Abell Test Working!');
  });

  after(() => {
    process.chdir('../../../..')
  });
});


describe('renderMarkdown()', () => {
  it('should return HTML of the md file in given path', () => {
    const shouldOutput = /* html */ `
      <h1 id="abell-test-title-check">Abell Test Title Check</h1>
      <p>Hi this my another blog.
        <b>Nice</b>
      </p>
      <pre>
        <code class="language-js">const s = 'cool'</code>
      </pre>
    `;

    expect(
      renderMarkdown(
        'tests/test-utils/resources/test_demo/content/another-blog/index.md',
        {
          meta: { title: 'Abell Test Title Check' }
        }
      ).replace(/[\n ]/g, '')
    ).to.equal(shouldOutput.replace(/[\n ]/g, ''));
  });
});

describe('addPrefixInHTMLPaths()', () => {
  it('should add prefix to HTML paths', () => {
    const template = /* html */ `
      <link rel="preload" href="one.css" />
      <a href='two.html'></a>
      <a href='https://google.com/hi.html'></a>
      <img src="three.png" />
    `;
    // prettier-ignore
    expect(addPrefixInHTMLPaths(template, '..'))
      .to.equal(/* html */ `
      <link rel="preload" href="../one.css" />
      <a href='../two.html'></a>
      <a href='https://google.com/hi.html'></a>
      <img src="../three.png" />
    `)
  });
});
