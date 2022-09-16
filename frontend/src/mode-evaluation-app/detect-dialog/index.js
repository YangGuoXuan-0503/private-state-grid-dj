import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import RecordDetailsDialog from '../record-details-dialog';


import './index.css';

class DetectDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowDetails: false,
    };
  }

  toggle = () => {
    this.props.toggleDialog();
  }

  getProjectProposal = (record, columnsCount) => {
    const s_ = record['6'] + record['7'];
    const s__ = record['8'] + record['9'];
    const s___ = s_ + s__;
    if (record['1'] === 1 && record['2'] === 1 && s___ === 0 && record['5'] === '规模报酬固定') {
      return {
        [columnsCount + '']: s_,
        [(columnsCount + 1) + '']: s__,
        [(columnsCount + 2) + '']: '优秀',
        [(columnsCount + 3) + '']: '续建项目建议立项',
      };
    }
    if (record['1'] === 1 && record['2'] === 1 && s___ > 0 && record['5'] === '规模报酬固定') {
      return {
        [columnsCount + '']: s_,
        [(columnsCount + 1) + '']: s__,
        [(columnsCount + 2) + '']: '良好',
        [(columnsCount + 3) + '']: '续建项目可以立项',
      };
    }
    if (record['1'] === 1 && record['2'] < 1 && s___ > 0 && record['5'] === '规模报酬递减') {
      return {
        [columnsCount + '']: s_,
        [(columnsCount + 1) + '']: s__,
        [(columnsCount + 2) + '']: '一般',
        [(columnsCount + 3) + '']: '续建项目暂缓立项',
      };
    }
    if ((record['1'] >= 0.6 && record['1'] < 1) && (record['2'] >= 0.6 && record['2'] < 1) && s___ > 0 && record['5'] === '规模报酬递减') {
      return {
        [columnsCount + '']: s_,
        [(columnsCount + 1) + '']: s__,
        [(columnsCount + 2) + '']: '较差',
        [(columnsCount + 3) + '']: '续建项目暂缓立项',
      };
    }
    return {
      [columnsCount + '']: s_,
      [(columnsCount + 1) + '']: s__,
      [(columnsCount + 2) + '']: '差',
      [(columnsCount + 3) + '']: '续建项目不予立项',
    };
  }

  openRecordDetails = (event, record, columns) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.record = record;
    this.columns = columns;
    this.setState({ isShowDetails: true });
  }

  closeRecordDetails = () => {
    this.record = {};
    this.columns = [];
    this.setState({ isShowDetails: false });
  }

  render() {
    const { results } = this.props;
    const { columns, records } = results;
    const columnsCount = columns.length;
    let displayColumns = columns.filter(column => ['0', '1', '2', '3', '5'].includes(column.key));
    const otherColumns = [
      {
        name: '松弛变量S-',
        group: '松弛变量S-',
        key: columnsCount + ''
      }, {
        name: '松弛变量S+',
        group: '松弛变量S+',
        key: (columnsCount + 1) + ''
      }, {
        name: '评价结果',
        group: '评价结果',
        key: (columnsCount + 2) + ''
      }, {
        name: '立项建议',
        group: '立项建议',
        key: (columnsCount + 3) + ''
      }
    ];
    displayColumns.push(...otherColumns);
    const allColumns = [ ...columns, ...otherColumns ];
    let validRecords = records.slice(0, ).map(record => {
      const projectProposal = this.getProjectProposal(record, columnsCount);
      return {
        ...record,
        ...projectProposal,
      };
    });

    return (
      <>
        <Modal
          isOpen={true}
          toggle={this.toggle}
          className="detect-result-dialog"
          size='lg'
          zIndex={1050}
        >
          <ModalHeader toggle={this.toggle}>{'评价结果'}</ModalHeader>
          <ModalBody className="detect-result-body">
            <div className="detect-result-container">
              <table className="detect-result-table">
                <thead>
                  <tr className="detect-result-tr">
                    {displayColumns.map((column, index) => {
                      return (
                        <th key={index} className="detect-result-td">
                          <div className="detect-result-item w-100">{column.name}</div>
                        </th>
                      );
                    })}
                    <th key={'-1'} className="detect-result-td">
                      <div className="detect-result-item w-100">{'详情'}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {validRecords.map((record, index) => {
                    return (
                      <tr key={index} className="detect-result-tr">
                        {displayColumns.map((column, valueIndex) => {
                          return (
                            <td key={`${index}-${valueIndex}`} className="detect-result-td">
                              <div className="detect-result-item w-100">{record[column.key]}</div>
                            </td>
                          );
                        })}
                        <td key={`${index}--1`} className="detect-result-td">
                          <div
                            className="detect-result-item details w-100"
                            onClick={(event) => this.openRecordDetails(event, record, allColumns)}
                          >{'详情'}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ModalBody>
        </Modal>
        {this.state.isShowDetails && (
          <RecordDetailsDialog
            record={this.record}
            columns={this.columns}
            toggleDialog={this.closeRecordDetails}
          />
        )}
      </>
    );
  }
}

DetectDialog.propTypes = {
  results: PropTypes.object.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

export default DetectDialog;
