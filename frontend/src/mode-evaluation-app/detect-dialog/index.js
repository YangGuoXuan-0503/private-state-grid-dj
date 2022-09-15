import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import './index.css';

class DetectDialog extends Component {

  toggle = () => {
    this.props.toggleDialog();
  }

  render() {
    const { results } = this.props;
    const { columns, records } = results;

    return (
      <Modal
        isOpen={true}
        toggle={this.toggle}
        className="detect-result-dialog"
        size='lg'
        zIndex={100}
      >
        <ModalHeader toggle={this.toggle}>{'评价结果'}</ModalHeader>
        <ModalBody className="detect-result-body">
          <div className="detect-result-container">
            <table className="detect-result-table">
              <thead>
                <tr className="detect-result-tr">
                  {columns.map((column, index) => {
                    return (
                      <th key={index} className="detect-result-td">
                        <div className="detect-result-item w-100">{column.name}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => {
                  return (
                    <tr key={index} className="detect-result-tr">
                      {record.map((value, valueIndex) => {
                        return (
                          <td key={`${index}-${valueIndex}`} className="detect-result-td">
                            <div className="detect-result-item w-100">{value}</div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

DetectDialog.propTypes = {
  results: PropTypes.object.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

export default DetectDialog;
