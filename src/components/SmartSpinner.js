import React from "react";
import { IonSpinner } from "@ionic/react";
import { connect } from "../services/LoadingBarService";

const spinnerContainerStyles = {
  marginBottom: "80px",
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
  zIndex: 1
};

export class SmartSpinner extends React.Component {
  state = {
    percentageLoaded: 0,
    showLoadingBar: false
  };

  componentDidMount() {
    connect(
      this.showLoadingBar.bind(this),
      this.hideLoadingBar.bind(this)
    );
  }

  showLoadingBar(total, loaded) {
    const percentageDefined = total !== undefined && loaded !== undefined;
    const percentageLoaded = percentageDefined ? loaded / total : 0;
    this.setState({
      percentageLoaded,
      showLoadingBar: true
    });
  }

  hideLoadingBar() {
    this.setState({
      showLoadingBar: false
    });
  }

  render() {
    return (
      this.state.showLoadingBar && (
        <div style={spinnerContainerStyles}>
          <IonSpinner
            style={{ transform: "scale(1.5)" }}
            name="lines"
          ></IonSpinner>
          <div style={{ marginLeft: "20px" }}>
            Loading..
            {this.state.percentageLoaded > 0
              ? this.state.percentageLoaded * 100 + "%"
              : ""}
          </div>
        </div>
      )
    );
  }
}
