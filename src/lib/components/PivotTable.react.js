import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import propUpdater from 'react-pivottable/PivotTableUI';

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

/**
 * ...
 */
export default class PivotTable extends Component {
    constructor(props) {
        super(props);
        this.state = props;
        this.handleChange = this.handleChange.bind(this);
//		this.setState = this.setState.bind(this);
    }

    handleChange(state){
        const {
          cols,
          colOrder,
          rows,
          rowOrder,
          aggregatorName,
          rendererName,
		  //added AGB
		  selectData
        } = state;

        if (typeof this.props.setProps === 'function') {
            this.props.setProps({
                cols,
                colOrder,
                rows,
                rowOrder,
                aggregatorName,
                rendererName,
				//added AGB
				selectData
            });
        }

        this.setState(state);
    }
	
/* 	componentWillMount() {
        this.setState({
			pivotState: {
                tableOptions: {
                    clickCallback: function(e, value, filters, pivotData) {
                        var names = [];
                        pivotData.forEachMatchingRecord(filters, function(
                            record
                        ) {
                            names.push(record.global_id);
                        });
                        alert(names.join('\n'));
                    },
                },
            },
        });
    } */
	
    render() {
        const {
            data,
            hiddenAttributes,
            hiddenFromAggregators,
            hiddenFromDragDrop,
            menuLimit,
            unusedOrientationCutoff,
			tableOptions,
			//added AGB
			selectData
        } = this.props;

        return (
            <PivotTableUI
                data={data}
				//ADDED AGB
				selectData={data}
                onChange={s => this.handleChange(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                hiddenAttributes={hiddenAttributes}
                hiddenFromAggregators={hiddenFromAggregators}
                hiddenFromDragDrop={hiddenFromDragDrop}
                menuLimit={menuLimit}
                unusedOrientationCutoff={unusedOrientationCutoff}
				//sorters = {{age_at_death: function(a,b){ return Number(a)-Number(b);}}}
				//ADDED AGB
				tableOptions = {{clickCallback: function(e, value, filters, pivotData) 
												{
													var recs = [];
													var dbg = [];
													pivotData.forEachMatchingRecord(filters, 
													//function(record){recs.push(record); dbg.push(typeof record.import_id); });
													function(record){recs.push(record); dbg.push(record.import_id); });
													//this took a lot of experimenting --don't mess with it AGB
													this.handleChange({selectData: recs});
													//alert(dbg.join('\n'));											
												}.bind(this)} }
                {...this.state}
            />
        );
    }
}

PivotTable.defaultProps = {
    menuLimit: 500,
    unusedOrientationCutoff: 85,
    hiddenAttributes: [],
    hiddenFromAggregators: [],
    hiddenFromDragDrop: []
};

PivotTable.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that should be called whenever any of the
     * properties change
     */
    setProps: PropTypes.func,

    // MODIFIABLE PROPS

    /**
     * The input data
     */
    data: PropTypes.array,
	
	//ADDED AGB
    /**
     * selectData -- data selected by cell click 
     */
    selectData: PropTypes.array,	

    /**
     * contains attribute names to omit from the UI
     */
    hiddenAttributes: PropTypes.array,

    /**
     * contains attribute names to omit from the aggregator arguments dropdowns
     */
    hiddenFromAggregators: PropTypes.array,

    /**
     * contains attribute names to omit from the drag'n'drop portion of the UI
     */
    hiddenFromDragDrop: PropTypes.array,

    /**
     * maximum number of values to list in the double-click menu
     */
    menuLimit: PropTypes.number,

    /**
     * If the attributes' names' combined length in characters exceeds this
     * value then the unused attributes area will be shown vertically to the
     * left of the UI instead of horizontally above it. 0 therefore means
     * 'always vertical', and Infinity means 'always horizontal'.
     */
    unusedOrientationCutoff: PropTypes.number,

    // PROPS ONLY ACCEPTED AS INPUT TO A CALLBACK

    /**
     * Which columns are currently in the column area
     */
    cols: PropTypes.array,

    /**
     * the order in which column data is provided to the renderer, must be one
     * of "key_a_to_z", "value_a_to_z", "value_z_to_a", ordering by value
     * orders by column total
     */
    colOrder: PropTypes.string,

    /**
     * Which rows is currently inside the row area.
     */
    rows: PropTypes.array,

    /**
     * the order in which row data is provided to the renderer, must be one
     * of "key_a_to_z", "value_a_to_z", "value_z_to_a", ordering by value
     * orders by row total
     */
    rowOrder: PropTypes.string,

    /**
     * Which aggregator is currently selected. E.g. Count, Sum, Average, etc.
     */
    aggregatorName: PropTypes.string,

    /**
     * Vals for the aggregator.
     */
    vals: PropTypes.array,

    /**
     * Value filter for each attibute name.
     */
    valueFilter: PropTypes.object,

    /**
     * Which renderer is currently selected. E.g. Table, Line Chart, Scatter
     * Chart, etc.
     */
    rendererName: PropTypes.string,
	
	 /**
     * tableOptions -- were clickCallback is placed 
	 * it is a Function to call when mouse clicks on cell
	 * function(e, value, filters, pivotData) 
     */
    tableOptions: PropTypes.object

		
	
};
