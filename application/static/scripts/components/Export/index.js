import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import FileSaver from 'filesaverjs';
require('blueimp-canvas-to-blob/js/canvas-to-blob.js');

const MARGIN = 20;

/**
 * Exports SVG documents to images to the user's desktop
 */
var Export = React.createClass({
    propTypes: {
        language: React.PropTypes.string,
        selectedTerm: React.PropTypes.number,
        diagramView: React.PropTypes.string
    },
    // Dictionary used for the export button
    dict: {
        se: {
            export:       "Exportera"
        },
        en: {
            export:       "Export"
        }
    },
    /**
     * Returns the svg node of the current svg document on the screen
     * @returns {*|Node}
     */
    getSVG: function(){
        // Clones the svg node so that we don't modify it
        var svg = d3.select("svg." + this.props.diagramView).node();
        var svgClone = svg.cloneNode(true);

        // Resets the position and zoom in the cloned diagram
        svgClone.firstChild.setAttribute("transform", 'translate(0,0)scale(1)');

        // Sets the viewbox, width and height of the cloned svg element to that of "nodes"
        var boundingBox = d3.select("svg." + this.props.diagramView).selectAll('.nodes').node().getBBox();
        var boundingBoxX = boundingBox.x - MARGIN;
        var boundingBoxY = boundingBox.y - MARGIN;
        var boundingBoxW = boundingBox.width + 2 * MARGIN;
        var boundingBoxH = boundingBox.height + 2 * MARGIN;
        var viewBox = [boundingBoxX, boundingBoxY, boundingBoxW, boundingBoxH];
        svgClone.setAttribute("viewBox", viewBox.join(" "));
        svgClone.setAttribute('width', boundingBoxW);
        svgClone.setAttribute('height', boundingBoxH);

        return svgClone;
    },
    /**
     * Returns the HTML of the element el
     * @param el
     * @returns {*|string}
     */
    getHTML: function(el){
        return el.outerHTML || new window.XMLSerializer().serializeToString(el);
    },
    /**
     * Returns the URI of the element el
     * @param el
     * @returns {string}
     */
    getUri: function(el){
        var html = this.getHTML(el);
        if(typeof window.btoa !== 'undefined'){
            return 'data:image/svg+xml;base64,' + window.btoa(html);
        }
        return 'data:image/svg+xml,' + html;
    },
    /**
     * Saves the image from link with a name of variable filename
     * @param link
     * @param filename
     */
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
    /**
     * Saves a file referenced by link as a PNG with filename of name
     * @param link
     * @param name
     */
    savePNG: function(link, name){
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
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
    /**
     * Returns a Blob from element el
     * @param el
     * @returns {*}
     */
    getBlob: function(el){
        const html = this.getHTML(el);
        return new Blob([html], { type: 'text/xml' });
    },
    /**
     * Exports the svg to a file which is downloaded to the user's computer
     */
    exportSVG: function() {
        this.props.exitFullscreen();
        var el = this.getSVG();
        if (typeof window.saveAs !== 'undefined' && typeof Blob == 'function') {
            // Saves the svg to the desktop
            FileSaver.saveAs(this.getBlob(el), this.props.selectedTerm.toString() + ".svg");
        }else{
            this.saveUri(this.getUri(el), this.props.selectedTerm.toString() + ".svg");
        }
    },

    /**
     * Exports the svg to a canvas which is then converted into a png file
     * which is downloaded to the user's computer
     */
    exportPNG: function(){
        this.props.exitFullscreen();
        var el = this.getSVG();
        var name = this.props.selectedTerm.toString() + ".png";
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