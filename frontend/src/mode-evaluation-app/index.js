import React, { Component } from 'react';
import { Input, FormGroup, Label, Button } from 'reactstrap';
import ReactSelect from '../components/react-select';
import { PROJECT_IMPORTANCE } from './constants';
import { modeAppraisalAPI } from '../api';
import DetectDialog from './detect-dialog';

import './index.css';

class ModeEvaluationApp extends Component {
  
  constructor(props) {
    super(props);
    this.projectImportanceOptions = PROJECT_IMPORTANCE.map(item => {
      const { name, value } = item;
      return {
        label: <span>{name}</span>,
        value
      };
    });
    this.detectResult = null;
    this.state = {
      isDetecting: false,
      projectName: '', // 项目名称
      projectCapitalInvestment: '', // 项目资金投入
      projectImportance: this.projectImportanceOptions[0], // 项目重要程度
      projectEffectivenessEvaluationResults: 0, // 项目成效评价结果
      plannedDuration: 0, // 规定工期
      actualDuration: 0, // 实际工期
      errorMessage: '',
    };
  }

  onProjectNameChange = (event) => {
    const newValue = event.target.value;
    if (newValue === this.state.projectName) return;
    this.setState({ projectName: newValue });
  }

  onProjectCapitalInvestmentChange = (event) => {
    const newValue = event.target.value;
    if (newValue === this.state.projectCapitalInvestment) return;
    this.setState({ projectCapitalInvestment: newValue });
  }

  onProjectImportanceChange = (option) => {
    const value = option.value;
    if (value === this.state.projectImportance.value) return;
    this.setState({ projectImportance: option });
  }

  onProjectEffectivenessEvaluationResultsChange = (event) => {
    const newValue = event.target.value;
    if (newValue === this.state.projectEffectivenessEvaluationResults) return;
    this.setState({ projectEffectivenessEvaluationResults: newValue });
  }

  onPlannedDurationChange = (event) => {
    const newValue = event.target.value;
    if (newValue === this.state.plannedDuration) return;
    this.setState({ plannedDuration: newValue });
  }

  onActualDurationChange = (event) => {
    const newValue = event.target.value;
    if (newValue === this.state.actualDuration) return;
    this.setState({ actualDuration: newValue });
  }

  onDetect = () => {
    this.detectResult = null;
    this.setState({ isDetecting: true });
    const { projectName, projectCapitalInvestment, projectImportance, projectEffectivenessEvaluationResults, plannedDuration,
      actualDuration } = this.state;
    const projectCompletionDegree = parseFloat(plannedDuration) - 0 < 0.000001 ? 0 : (parseFloat(plannedDuration) - parseFloat(actualDuration)) / parseFloat(plannedDuration); // 所评价项目的规定时间完成程度
    modeAppraisalAPI.oneRecordAppraisal({
      project_name: projectName,
      project_capital_investment: parseFloat(projectCapitalInvestment),
      project_importance: projectImportance.value,
      project_completion_degree: projectCompletionDegree,
      project_effectiveness_evaluation_results: projectEffectivenessEvaluationResults,
    }).then(res => {
      this.detectResult = res.data;
      this.setState({ isDetecting: false, isShowDetectResultDialog: true });
    }).catch(error => {
      this.detectResult = null;
      this.setState({ isDetecting: false });
    });
  }

  importExcelCSV = (event) => {
    event.stopPropagation();
    event.nativeEvent && event.nativeEvent.stopImmediatePropagation && event.nativeEvent.stopImmediatePropagation();
    this.excelCSVInput.click();
  }

  onExcelCSVClick = (event) => {
    event.stopPropagation();
    event.nativeEvent && event.nativeEvent.stopImmediatePropagation && event.nativeEvent.stopImmediatePropagation();
  }

  onExcelCSVFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    this.detectResult = null;
    this.setState({ isDetecting: true });
    modeAppraisalAPI.fileAppraisal(file).then(res => {
      this.detectResult = res.data;
      this.setState({ isDetecting: false, isShowDetectResultDialog: true });
    }).catch(error => {
      this.detectResult = null;
      this.setState({ isDetecting: false });
    });
  }

  closeDetectResultDialog = () => {
    this.setState({ isShowDetectResultDialog: false });
  }

  render() {
    const { projectName, projectCapitalInvestment, projectImportance, projectEffectivenessEvaluationResults,
      plannedDuration, actualDuration, isDetecting, isShowDetectResultDialog } = this.state;
    return (
      <>
        <div className="mode-evaluation-container w-100 h-100">
          <FormGroup key="project-name" className="mb-4 w-100 mode-evaluation-item d-flex">
            <Label className="mb-2">{'项目名称'}</Label>
            <Input
              type="text"
              value={projectName}
              placeholder="请输入项目名称, 例如: 1900xxx"
              onChange={this.onProjectNameChange}
            />
          </FormGroup>
          <FormGroup key="project-capital-investment" className="mb-4 w-100 mode-evaluation-item d-flex">
            <Label className="mb-2">{'项目资金投入'}</Label>
            <Input
              type="number"
              value={projectCapitalInvestment}
              placeholder="请输入项目资金投入, 单位为: 万元"
              onChange={this.onProjectCapitalInvestmentChange}
            />
          </FormGroup>
          <FormGroup key="project-importance" className="mb-4 w-100 mode-evaluation-item d-flex">
            <Label className="mb-2">{'项目重要程度'}</Label>
            <ReactSelect
              options={this.projectImportanceOptions}
              value={projectImportance}
              menuPortalTarget={'#wrapper'}
              classNamePrefix="project-importance-select"
              onChange={this.onProjectImportanceChange}
            />
          </FormGroup>
          <FormGroup key="project-completion-degree" className="mb-4 w-100 mode-evaluation-item d-flex">
            <Label className="mb-1">{'所评价项目的规定时间完成程度'}</Label>
            <div className="d-flex w-100">
              <FormGroup key="planned-duration" className="mode-evaluation-item d-flex">
                <Label className="mb-2">{'规定工期'}</Label>
                <Input
                  type="number"
                  value={plannedDuration}
                  placeholder="规定工期"
                  onChange={this.onPlannedDurationChange}
                />
              </FormGroup>
              <FormGroup key="actual-duration" className="mode-evaluation-item d-flex">
                <Label className="mb-2">{'实际工期'}</Label>
                <Input
                  type="number"
                  value={actualDuration}
                  placeholder="实际工期"
                  onChange={this.onActualDurationChange}
                />
              </FormGroup>
            </div>
          </FormGroup>
          <FormGroup key="project-effectiveness-evaluation-results" className="mb-4 w-100 mode-evaluation-item d-flex">
            <Label className="mb-2">{'项目成效评价结果'}</Label>
            <Input
              type="number"
              value={projectEffectivenessEvaluationResults}
              placeholder="项目成效评价结果"
              onChange={this.onProjectEffectivenessEvaluationResultsChange}
            />
          </FormGroup>
          <input
            className="d-none"
            type="file"
            accept=".csv, .xlsx"
            ref={ref => this.excelCSVInput = ref}
            onClick={this.onExcelCSVClick}
            onChange={this.onExcelCSVFileChange}
          />
          <Button onClick={this.importExcelCSV} disabled={isDetecting} color="primary" className="mr-4">
            {'导入CSV/EXCEL评价'}
          </Button>
          <Button onClick={this.onDetect} disabled={isDetecting} color="primary">{'评价'}</Button>
        </div>
        {isShowDetectResultDialog && (
          <DetectDialog
            results={this.detectResult}
            toggleDialog={this.closeDetectResultDialog}
          />
        )}
      </>
    );
  }
}

export default ModeEvaluationApp;
