var DiagramElement = require('./DiagramElement');

//Temporary fake user
var fakeUser = {
    id: 1337,
    username: "Arnold",
    email: "arnold@schwarzenegger.com",
    lang: "eng"
}

//Component that displays favorite diagrams in a table
module.exports = React.createClass({
    getInitialState: function(){
        return({
            diagrams: this.props.diagrams,
            filteredDiagrams: this.props.diagrams
        });
    },

    componentDidMount: function(){
        this.setState({
            diagrams: this.props.dateSort(this.state.diagrams, false),
            sortBy: 'added',
            ascending: false
        });
    },

    //Sort diagrams by header
    sortBy: function(header){
        var asc = true;
        //If already sorting by header, invert order
        if(this.state.sortBy == header){
            var asc = !this.state.ascending;
        }
        switch(header){
            case "name":
                this.setState({
                    terms: this.props.nameSort(this.state.diagrams, asc),
                    sortBy: 'name'
                });
                break;
            case "added":
                this.setState({
                    terms: this.props.dateSort(this.state.diagrams, asc),
                    sortBy: 'added'
                });
                break;
        }

        this.setState({
            ascending: asc
        });

    },
    
    //Remove element from the diagram table
    removeDiagram: function(id){
        //Remove element locally (for responsiveness)
        var tempDiagrams = this.props.removeid(this.state.diagrams, id);
        this.setState({
            diagrams: tempDiagrams
        });
        //TODO: Remove element from database
    },

    filterDiagrams: function(event){
        var input = event.target.value;
        var regEx = new RegExp(input.toLowerCase());
        var filteredDiagrams = [];
        for(var i = 0; i < this.state.diagrams.length; i++){
            if(regEx.test(this.state.diagrams[i].name.toLowerCase())){
                filteredDiagrams.push(this.state.diagrams[i]);
            }
        }

        this.setState({
            filteredDiagrams: filteredDiagrams
        });
        
    },
    
    render: function(){
        //Generate the diagram elements
        var diagramArray = this.state.filteredDiagrams.map(function(diagram){
            //Date, "0" together with slice(-2) ensures the date format xxxx-xx-xx (e.g 3 -> 03)
            var day = ("0" + diagram.dateAdded.getDate()).slice(-2);
            var month = ("0" + diagram.dateAdded.getMonth()).slice(-2);
            var year = diagram.dateAdded.getUTCFullYear();
            
            var dateString = year + "-" + month + "-" + day;

            return(
                <DiagramElement key={diagram.id} name={diagram.name} dict={this.props.dict} id={diagram.id} date={dateString} parameters={diagram.parameters} openDiagram={this.props.openDiagram} removeDiagram={this.removeDiagram}/>
            );
        }, this);

        //Render the correct sorting arrows
        var nameSortArrow = null;
        var dateSortArrow = null;
        switch(this.state.sortBy){
            case "name":
                if(this.state.ascending == true){
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    nameSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
            case "added":
                if(this.state.ascending == true){
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-bottom sortArrow" aria-hidden="true"></span>;
                }
                else{
                    dateSortArrow = <span className="glyphicon glyphicon-triangle-top sortArrow" aria-hidden="true"></span>;
                }
                break;
        }

        return(
            <div>
                <h1><span className="glyphicon glyphicon-heart accHeaderGlyph favoritesGlyph" aria-hidden="true"> </span> {this.props.dict[fakeUser.lang]["diagrams"]}</h1>
                <hr className="profileHr"/>
                <div className="diagramPageWrapper">
                    <div className="input-group" style={{marginBottom: "8px"}}>
                        <span className="input-group-addon" id="basic-addon1">Filter</span>
                        <input type="text" className="form-control" onChange={this.filterDiagrams} placeholder={this.props.dict[fakeUser.lang]["name"]}/>
                    </div>

                    <table className="favorites">
                        <thead>
                            <tr>
                                <th id="Diagram_name" className="favorites" onClick={this.sortBy.bind(this, "name")}>{this.props.dict[fakeUser.lang]["name"]} {nameSortArrow}</th>
                                <th id="Diagram_acc" className="favorites"></th>
                                <th id="Diagram_date" className="favorites" onClick={this.sortBy.bind(this, "added")}>{this.props.dict[fakeUser.lang]["added"]} {dateSortArrow}</th>
                                <th id="Diagram_remove" className="favorites"></th>
                            </tr>
                        </thead>
                        {diagramArray}
                    </table>
                </div>
            </div>
        );
    }
});


