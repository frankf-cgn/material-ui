const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const PropTypes = require('../utils/prop-types');
const StylePropable = require('../mixins/style-propable');
const Typography = require('../styles/typography');
const Paper = require('../paper');
const DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
const ThemeManager = require('../styles/theme-manager');

const List = React.createClass({

  mixins: [PureRenderMixin, StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    insetSubheader: React.PropTypes.bool,
    selectedLink: React.PropTypes.shape({
      value: React.PropTypes.number,
      requestChange: React.PropTypes.func}),
    subheader: React.PropTypes.string,
    subheaderStyle: React.PropTypes.object,
    zDepth: PropTypes.zDepth,
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getDefaultProps() {
    return {
      zDepth: 0,
    };
  },

  getInitialState () {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps (nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },

  render() {
    const {
      children,
      insetSubheader,
      style,
      subheader,
      subheaderStyle,
      zDepth,
      ...other,
    } = this.props;

    const styles = {
      root: {
        padding: 0,
        paddingBottom: 8,
        paddingTop: subheader ? 0 : 8,
      },

      subheader: {
        color: Typography.textLightBlack,
        fontSize: 14,
        fontWeight: Typography.fontWeightMedium,
        lineHeight: '48px',
        paddingLeft: insetSubheader ? 72 : 16,
      },
    };

    let subheaderElement;
    if (subheader) {
      const mergedSubheaderStyles = this.prepareStyles(styles.subheader, subheaderStyle);
      subheaderElement = <div style={mergedSubheaderStyles}>{subheader}</div>;
    }

    let listItems;
    if (this.props.selectedLink) {
      listItems = React.Children.map(children, (child) => {
        if (child.type.displayName === "ListItem") {
          return React.cloneElement(child, {
              key: child.props.index,
              selected: this._getSelected(child.props.index),
              updateSelected: this._updateSelectedIndex,
            }
          );
        }
        else {
          return child;
        }
      });
    }
    else {
      listItems = children;
    }

    return (
      <Paper
        {...other}
        style={this.mergeStyles(styles.root, style)}
        zDepth={zDepth}>
        {subheaderElement}
        {listItems}
      </Paper>
    );
  },

  _getSelected(index) {
    return this.props.selectedLink.value === index;
  },

  _updateSelectedIndex(index) {
    this.props.selectedLink.requestChange(index);
  },

});

module.exports = List;
