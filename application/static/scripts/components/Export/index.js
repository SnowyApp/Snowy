import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
require('stackblur');
require('rgbcolor');
import canvg from 'canvg-fixed';
import FileSaver from 'browser-filesaver';

var Export = React.createClass({
    propTypes: {
        language: React.PropTypes.string
    },
    dict: {
        se: {
            export:       "Exportera"
        },
        en: {
            export:       "Export"
        }
    },
    /**
     * Exports the svg to a file which is downloaded to the user's computer
     */
    exportSVG: function(){
        var html = d3.select("svg")
            .attr({
                'xmlns': 'http://www.w3.org/2000/svg',
                'xlink': 'http://www.w3.org/1999/xlink',
                version: '1.1'
            })
            .node().parentNode.innerHTML;

        var blob = new Blob([html], {type: "image/svg+xml"});
        FileSaver.saveAs(blob, new Date().toJSON().slice(0,10) + ".svg");

    },

    /**
     * Exports the svg to a canvas which is then converted into a png file
     * which is downloaded to the user's computer
     */
    exportPNG: function(){
        // Create a canvas with the height and width of the parent of the svg document
        var chartArea = document.getElementsByTagName('svg')[0].parentNode;
        var svg = chartArea.innerHTML;
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', chartArea.offsetWidth);
        canvas.setAttribute('height', chartArea.offsetHeight);
        canvas.setAttribute('display', 'none');

        // Add the canvas to the body of the document and add the svg document to the canvas
        document.body.appendChild(canvas);
        canvg(canvas, svg);

        // Draw a white background behind the content
        var context = canvas.getContext("2d");
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Append the image data to a link, download the image and then remove canvas
        var dataString = canvas.toDataURL();
        var link = document.createElement("a");
        link.download = new Date().toJSON().slice(0,10) + ".png";
        link.href = dataString;
        link.click();
        canvas.parentNode.removeChild(canvas);
    },
    render: function(){
        return (
            <DropdownButton bsStyle="primary" title={this.dict[this.props.language]["export"]} id="Export">
                <MenuItem onClick={this.exportSVG}>SVG</MenuItem>
                <MenuItem onClick={this.exportPNG}>PNG</MenuItem>
            </DropdownButton>
        );
    }
});

module.exports = Export;