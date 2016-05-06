import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import FileSaver from 'filesaverjs';
require('blueimp-canvas-to-blob/js/canvas-to-blob.js');

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
    getHTML: function(el){
        return el.outerHTML || new window.XMLSerializer().serializeToString(el);
    },
    getUri: function(el){
        var html = this.getHTML(el);
        if(typeof window.btoa !== 'undefined'){
            return 'data:image/svg+xml;base64,' + window.btoa(html);
        }
        return 'data:image/svg+xml,' + html;

    },
    saveUri: function(link, filename) {
        const DownloadAttributeSupport = (typeof document !== 'undefined') && ('download' in document.createElement('a'));
        if (DownloadAttributeSupport) {
            const a = document.createElement("a");
            a.setAttribute('href' , link);
            a.setAttribute('download' , filename);
            a.dispatchEvent(new MouseEvent('click'));
        }else if(typeof window !== 'undefined'){
            window.open(link, '_blank', '');
        }
    },
    savePNG: function(link, name){
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const image = new Image();
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            if (typeof canvas.toBlob !== 'undefined' && typeof window.saveAs !== 'undefined') {
                canvas.toBlob(function (blob) {
                    FileSaver.saveAs(blob, name);
                });
            } else {
                this.saveUri(canvas.toDataURL('image/png'), name);
            }
        };
        image.src = link;
    },
    getBlob: function(el){
        const html = this.getHTML(el);
        return new Blob([html], { type: 'text/xml' });
    },
    /**
     * Exports the svg to a file which is downloaded to the user's computer
     */
    exportSVG: function() {
        var el = this.getSVG();
        if (typeof window.saveAs !== 'undefined' && typeof Blob == 'function') {
            // Saves the svg to the desktop
            FileSaver.saveAs(this.getBlob(el), this.props.selectedTerm.toString() + ".svg");
        }else{
            this.saveUri(this.getUri(el), new Date().toJSON().slice(0,10) + ".svg");
        }
    },

    /**
     * Exports the svg to a canvas which is then converted into a png file
     * which is downloaded to the user's computer
     */
    exportPNG: function(){
        var el = this.getSVG();
        var name = new Date().toJSON().slice(0,10) + ".png";
        this.savePNG(this.getUri(el), name);
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