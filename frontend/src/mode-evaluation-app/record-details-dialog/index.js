import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, FormGroup, Label } from 'reactstrap';

import './index.css';

class RecordDetailsDialog extends Component {


  toggle = () => {
    this.props.toggleDialog();
  }
  render() {
    const { record, columns } = this.props;
    const displayColumns = columns.slice(1, ).filter(column => column.key !== '');
    return (
      <Modal
        isOpen={true}
        toggle={this.toggle}
        className="detect-record-dialog"
        size='lg'
        zIndex={1050}
      >
        <ModalHeader toggle={this.toggle}>{record['0']}</ModalHeader>
        <ModalBody className="detect-record-body">
          <div className="detect-record-container">
            {displayColumns.map(column => {
              return (
                <FormGroup className="mb-4 w-100 record-item d-flex" key={column.key}>
                  <Label className="mb-2">{column.name}</Label>
                  <div className="w-100 record-item-value d-flex align-items-center">
                    {record[column.key]}
                  </div>
                </FormGroup>
              );
            })}
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

RecordDetailsDialog.propTypes = {
  record: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

export default RecordDetailsDialog;
