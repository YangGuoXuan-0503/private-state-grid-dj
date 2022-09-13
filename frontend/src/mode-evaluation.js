import React, { Component, Suspense } from 'react';
import ReactDOM from 'react-dom';
import Loading from './components/loading';
import ModeEvaluationApp from './mode-evaluation-app';

class ModeEvaluation extends Component {

  render() {
    return (
      <ModeEvaluationApp />
    );
  }
}

ReactDOM.render(
  <Suspense fallback={<Loading/>}>
    <ModeEvaluation />
  </Suspense>,
  document.getElementById('wrapper')
);
