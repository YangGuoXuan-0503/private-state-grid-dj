import axios from 'axios';
import FormData from 'form-data';

class ModeAppraisalAPI {
  
  init({ server }) {
    this.server = server;
    this.req = axios.create({
      baseURL: this.server,
      headers: { }
    });
    return this;
  }

  _sendPostRequest(url, form) {
    if (form.getHeaders) {
      return this.req.post(url, form, {
        headers:form.getHeaders()
      });
    }
    return this.req.post(url, form);
  }

  oneRecordAppraisal(p = {}) {
    const url = this.server + '/api/one-record-appraisal/';
    let formData = new FormData();
    Object.keys(p).forEach(key => {
      formData.append(key, p[key]);
    });
    return this._sendPostRequest(url, formData);
  }

  fileAppraisal(file) {
    const url = this.server + '/api/appraisal/file/';
    let formData = new FormData();
    formData.append('file', file);
    return this._sendPostRequest(url, formData);
  }

}

const { server } = window.app;
let modeAppraisalAPI = new ModeAppraisalAPI();
modeAppraisalAPI.init({ server });

export default modeAppraisalAPI;
