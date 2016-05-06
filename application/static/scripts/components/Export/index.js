import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import FileSaver from 'browser-filesaver';

const MARGIN = 20;


var Export = React.createClass({
    propTypes: {
        language: React.PropTypes.string,
        selectedTerm: React.PropTypes.number,
        diagramView: React.PropTypes.string
    },
    dict: {
        se: {
            export:       "Exportera"
        },
        en: {
            export:       "Export"
        }
    },
    getSVG: function(){
        // Clones the svg node so that we don't modify it
        var svg = d3.select("svg." + this.props.diagramView).node();
        var svgClone = svg.cloneNode(true);

        // Resets the position and zoom in the cloned diagram
        svgClone.firstChild.setAttribute("transform", 'translate(0,0)scale(1)');

        // Sets the viewbox, width and height of the cloned svg element to that of "nodes"
        var bb = d3.select("svg." + this.props.diagramView).selectAll('.nodes').node().getBBox();
        var bbx = bb.x - MARGIN;
        var bby = bb.y - MARGIN;
        var bbw = bb.width + 2 * MARGIN;
        var bbh = bb.height + 2 * MARGIN;
        var vb = [bbx, bby, bbw, bbh];
        svgClone.setAttribute("viewBox", vb.join(" "));
        svgClone.setAttribute('width', bbw);
        svgClone.setAttribute('height', bbh);

        return svgClone;
    },
    getUri: function(html){
        var encoded = encodeURIComponent(html);
        var link;
        if(typeof window.btoa == 'function'){
            link = 'data:image/svg+xml;base64,' + window.btoa(encoded);
        }else{
            link = 'data:image/svg+xml,' + encoded;
        }
        return link;
    },
    saveUri: function(link, filename){
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.download = filename + ".png";
        a.href = link;
        a.click();
    },
    /**
     * Exports the svg to a file which is downloaded to the user's computer
     */
    exportSVG: function() {
        var svgClone = this.getSVG();
        const html = svgClone.outerHTML || (new window.XMLSerializer().serializeToString(svgClone));
        if (typeof Blob == 'function') {
            var blob = new Blob([html],
                {type: "image/svg+xml"});
        // Saves the svg to the desktop
            saveAs(blob, this.props.selectedTerm.toString() + ".svg");
        }else{
            var link = this.getUri(html);
            this.saveUri(link, new Date().toJSON().slice(0,10));
        }
    },

    /**
     * Exports the svg to a canvas which is then converted into a png file
     * which is downloaded to the user's computer
     */
    exportPNG:function(){
        // Initiates svgsaver
        var svgClone = this.getSVG();
        const html = svgClone.outerHTML || (new window.XMLSerializer().serializeToString(svgClone));
        var link = this.getUri(html);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const image = new Image();
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            if (typeof canvas.toBlob == 'function') {
                canvas.toBlob(function (blob) {
                    saveAs(blob, name);
                });
            } else {
                this.saveUri(canvas.toDataURL('image/png'),new Date().toJSON().slice(0,10));
            }
        };
        image.src = link;
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