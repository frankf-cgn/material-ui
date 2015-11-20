import React from 'react';
import marked from 'marked';

require('./mui-github-markdown.css');

const styles = {
  root: {
    marginBottom: 22,
    padding: '0 24px',
  },
};

const MarkdownElement = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      text: '',
    };
  },

  componentWillMount() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function(code, lang) {
        return require('highlight.js').highlight(lang, code).value;
      },
    });
  },

  render() {
    const {
      text,
    } = this.props;

/* eslint-disable */
    return (
      <div style={styles.root} className="markdown-body">
        <div dangerouslySetInnerHTML={{__html: marked(text)}} />
      </div>
    );
/* eslint-enable */
  },
});

export default MarkdownElement;
