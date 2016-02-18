var CellList = React.createClass({
    render: function() {
        return (
            <div className="cells">
                <h1>Sample Cell 1</h1>
                <h2>Sample Cell 2</h2>
                <h3>Sample Cell 3</h3>
            </div>
        );
    }
});

ReactDOM.render(
    <CellList />,
    document.getElementById('content')
);
