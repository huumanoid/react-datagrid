'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var assign = require('object-assign');
var normalize = require('react-style-normalizer');

var TEXT_ALIGN_2_JUSTIFY = {
    right: 'flex-end',
    center: 'center'
};

function copyProps(target, source, list) {

    list.forEach(function (name) {
        if (name in source) {
            target[name] = source[name];
        }
    });
}

var PropTypes = React.PropTypes;

var Cell = React.createClass({

    displayName: 'ReactDataGrid.Cell',

    propTypes: {
        className: PropTypes.string,
        firstClassName: PropTypes.string,
        lastClassName: PropTypes.string,

        contentPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

        column: PropTypes.object,
        columns: PropTypes.array,
        index: PropTypes.number,

        style: PropTypes.object,
        text: PropTypes.any,
        rowIndex: PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            text: '',

            firstClassName: 'z-first',
            lastClassName: 'z-last',

            defaultStyle: {}
        };
    },

    prepareClassName: function prepareClassName(props) {
        var index = props.index;
        var columns = props.columns;
        var column = props.column;

        var textAlign = column && column.textAlign;

        var className = props.className || '';

        className += ' ' + Cell.className;

        if (columns) {
            if (!index && props.firstClassName) {
                className += ' ' + props.firstClassName;
            }

            if (index == columns.length - 1 && props.lastClassName) {
                className += ' ' + props.lastClassName;
            }
        }

        if (textAlign) {
            className += ' z-align-' + textAlign;
        }

        return className;
    },

    prepareStyle: function prepareStyle(props) {
        var column = props.column;
        var sizeStyle = column && column.sizeStyle;

        var alignStyle;
        var textAlign = column && column.textAlign || (props.style || {}).textAlign;

        if (textAlign) {
            alignStyle = { justifyContent: TEXT_ALIGN_2_JUSTIFY[textAlign] };
        }

        var style = assign({}, props.defaultStyle, sizeStyle, alignStyle, props.style);

        return normalize(style);
    },

    prepareProps: function prepareProps(thisProps) {

        var props = assign({}, thisProps);

        if (!props.column && props.columns) {
            props.column = props.columns[props.index];
        }

        props.className = this.prepareClassName(props);
        props.style = this.prepareStyle(props);

        return props;
    },

    render: function render() {
        var props = this.p = this.prepareProps(this.props);

        var propsColumn = props.column;
        var textAlign = propsColumn && propsColumn.textAlign;
        var propsText = props.renderText ? props.renderText(props.text, propsColumn, props.rowIndex) : props.text;

        var contentProps = {
            className: 'z-content',
            style: {
                padding: props.contentPadding
            }
        };

        var content = props.renderCell ? props.renderCell(contentProps, propsText, props) : React.DOM.div(contentProps, propsText);

        var renderProps = assign({}, props);

        delete renderProps.data;

        var contentPadding = renderProps.contentPadding,
            columns = renderProps.columns,
            index = renderProps.index,
            column = renderProps.column,
            text = renderProps.text,
            header = renderProps.header,
            firstClassName = renderProps.firstClassName,
            lastClassName = renderProps.lastClassName,
            defaultStyle = renderProps.defaultStyle,
            rowIndex = renderProps.rowIndex,
            textPadding = renderProps.textPadding,
            renderCell = renderProps.renderCell,
            renderText = renderProps.renderText,
            rest = _objectWithoutProperties(renderProps, ['contentPadding', 'columns', 'index', 'column', 'text', 'header', 'firstClassName', 'lastClassName', 'defaultStyle', 'rowIndex', 'textPadding', 'renderCell', 'renderText']);

        return React.createElement(
            'div',
            rest,
            content,
            props.children
        );
    }
});

Cell.className = 'z-cell';

module.exports = Cell;