import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import FileSaver from 'browser-filesaver';
var Svgsaver = require('svgsaver');

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
        // Initiates svgsaver
        var svgsaver = new Svgsaver();

        // Clones the svg node so that we don't modify it
        var svg = d3.select("svg").node();
        var svgClone = svg.cloneNode(true);

        // Resets the position and zoom in the cloned diagram
        svgClone.firstChild.setAttribute("transform", 'translate(0,0)scale(1)');

        // Sets the viewbox, width and height of the cloned svg element to that of "nodes"
        var bb=d3.select('body').selectAll('.nodes').node().getBBox();
        var bbx=bb.x;
        var bby=bb.y;
        var bbw=bb.width;
        var bbh=bb.height;
        var vb=[bbx,bby,bbw,bbh];
        svgClone.setAttribute("viewBox", vb.join(" ") );
        svgClone.setAttribute('width', bbw);
        svgClone.setAttribute('height', bbh);

        // Saves the svg to the desktop
        svgsaver.asSvg(svgClone, new Date().toJSON().slice(0,10) + ".svg");

    },

    /**
     * Exports the svg to a canvas which is then converted into a png file
     * which is downloaded to the user's computer
     */
    exportPNG:function(){
        // Initiates svgsaver
        var svgsaver = new Svgsaver();

        // Clones the svg node so that we don't modify it
        var svg = d3.select("svg").node();
        var svgClone = svg.cloneNode(true);

        // Resets the position and zoom in the cloned diagram
        svgClone.firstChild.setAttribute("transform", 'translate(0,0)scale(1)');

        // Sets the viewbox, width and height of the cloned svg element to that of "nodes"
        var bb=d3.select('body').selectAll('.nodes').node().getBBox();
        var bbx=bb.x;
        var bby=bb.y;
        var bbw=bb.width;
        var bbh=bb.height;
        var vb=[bbx,bby,bbw,bbh];
        svgClone.setAttribute("viewBox", vb.join(" ") );
        svgClone.setAttribute('width', bbw);
        svgClone.setAttribute('height', bbh);

        // Saves the svg to the desktop
        svgsaver.asPng(svgClone, new Date().toJSON().slice(0,10) + ".png");
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