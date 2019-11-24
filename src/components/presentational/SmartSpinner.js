import React from "react";
import { IonSpinner } from "@ionic/react";
import { connect } from "../../services/LoadingSpinnerService";

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
    show: false
  };

  componentDidMount() {
    connect(this.showSpinner.bind(this), this.hideSpinner.bind(this));
  }

  showSpinner(total, loaded) {
    const percentageDefined = total !== undefined && loaded !== undefined;
    const percentageLoaded = percentageDefined ? (loaded / total) * 100 : 0;
    this.setState({
      percentageLoaded: Math.round(percentageLoaded),
      showPercentage: percentageLoaded > 0 && percentageLoaded < 100,
      show: true
    });
  }

  hideSpinner() {
    this.setState({
      show: false
    });
  }

  render() {
    return (
      this.state.show && (
        <div style={spinnerContainerStyles}>
          <IonSpinner
            style={{ transform: "scale(1.5)" }}
            name="lines"
          ></IonSpinner>
          <div style={{ marginLeft: "20px" }}>
            Loading..
            {this.state.showPercentage && this.state.percentageLoaded + "%"}
          </div>
        </div>
      )
    );
  }
}
