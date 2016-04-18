//Term element in favorite terms table
module.exports = React.createClass({
    render: function(){
        return(
            <tr className="favorites">
                <td className="favorites"> <a className="favorites" href="#" onClick={this.props.openTerm.bind(null, this.props.id)}>{this.props.name}</a></td>
                <td className="favorites"> <a className="favorites" href="#" onClick={this.props.openTerm.bind(null, this.props.id)}>{this.props.id}</a></td>
                <td className="favorites">{this.props.date}</td>
                <td id="removeGlyph" className="favorites glyph" onClick={this.props.removeTerm.bind(null, this.props.id)}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
            </tr>
        );
    }
});
