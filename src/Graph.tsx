import React, { Component } from "react";
import { Table } from "@jpmorganchase/perspective";
import { ServerRespond } from "./DataStreamer";
import { DataManipulator } from "./DataManipulator";
import "./Graph.css";

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement("perspective-viewer");
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = (document.getElementsByTagName(
      "perspective-viewer"
    )[0] as unknown) as PerspectiveViewerElement;

    const schema = {
      ratio: "float",
      price_abc: "float",
      price_def: "float",
      timestamp: "date",
      upper_bound: "float",
      lower_bound: "float",
      trigger_alert: "float",
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute("view", "y_line"); //'view' is the graph type, previously it was grid type
      // elem.setAttribute("column-pivots", '["stock"]'); // column-pivots to distinguish stock ABC with DEF in task2, in task3 the objective is to get ratio between 2 stocks so remove it
      elem.setAttribute("row-pivots", '["timestamp"]'); // "row-pivots" equal to x-axis
      elem.setAttribute(
        "columns",
        '["ratio","upper_bound", "lower_bound", "trigger_alert"]'
      ); // "columns" to track datapoint's data along y-axis, in task2 only top_ask_price was needed
      elem.setAttribute(
        "aggregates",
        JSON.stringify({
          ratio: "avg",
          price_abc: "avg",
          price_def: "avg",
          timestamp: "distinct count",
          upper_bound: "avg",
          lower_bound: "avg",
          trigger_alert: "avg",
        })
      ); // "aggregates" to handle duplicated data n consolidate it to 1 data point. In this case a data point is considered unique if it has a timestamp. Otherwise, average out all other non-unique fields
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([DataManipulator.generateRow(this.props.data)]);
    }
  }
}

export default Graph;
