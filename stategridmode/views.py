import pandas as pd
from django.shortcuts import render
from apiManager.settings import MEDIA_URL, WEB_SERVICE_URL
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from apiManager.utils import api_error
from stategridmode.DEA_model import DEA
import xlrd3 as xlrd

# Create your views here.
def index(request):
    context={
        'media_url': MEDIA_URL,
        'server_url': WEB_SERVICE_URL.rstrip('/')
    }
    return render(request, 'stategridmode/index.html', context)

class oneRecordAppraisal(APIView):
    def post(self, request):

        project_name = request.POST.get('project_name', '项目名称')
        project_capital_investment = request.POST.get('project_capital_investment', 0)
        try:
            project_capital_investment = float(project_capital_investment)
        except Exception as e:
            project_capital_investment = 0
        
        project_importance = request.POST.get('project_importance', 1)
        try:
            project_importance = int(project_importance)
        except Exception as e:
            project_importance = 1
        
        project_completion_degree = request.POST.get('project_completion_degree', 0)
        try:
            project_completion_degree = float(project_completion_degree)
        except Exception as e:
            project_completion_degree = 0

        project_effectiveness_evaluation_results = request.POST.get('project_effectiveness_evaluation_results', 0)
        try:
            project_effectiveness_evaluation_results = float(project_effectiveness_evaluation_results)
        except Exception as e:
            project_effectiveness_evaluation_results = 0

        data = pd.DataFrame({
            project_name: [project_capital_investment, project_importance, project_effectiveness_evaluation_results, project_completion_degree],
        },
        index=['项目资金投入', '项目重要程度', '项目成效评价结果', '所评价项目的规定时间完成程度']
        ).T

        X = data[['项目资金投入', '项目重要程度', '项目成效评价结果']]
        Y = data[['所评价项目的规定时间完成程度']]

        dea = DEA(DMUs_Name=data.index, X=X, Y=Y)
        results = dea.analysis()
        results_records = results.values
        results_columns = results.columns
        columns = [{
                'name': '项目名称',
                'group': '项目名称',
                'key': 0
            }]
        records = []
        
        for i in results_columns:
            columns_length = len(columns)
            columns.append({
                'name': i[1],
                'group': i[0],
                'key': columns_length
            })

        for i in results_records:
            results_record = list(i)
            results_record.insert(0, project_name)
            records.append(results_record)

        return Response({
            'columns': columns,
            'records': records,
        })


class fileAppraisal(APIView):
    def post(self, request):
        file = request.FILES.get('file', None)
        if not file:
            error_msg = 'file invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)
        
        if '.' not in file.name:
            error_msg = 'file %s invalid.' % file.name
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        extension = file.name.split('.')[-1].lower()
        if extension not in ['xlsx', 'csv']:
            error_msg = 'file %s invalid.' % file.name
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        file = file.read()
        wb = xlrd.open_workbook(file_contents=file)
        sheet = wb.sheet_by_index(0)
        data = {}
        index_list = []
        
        for i in range(sheet.nrows):
            row = sheet.row_values(i)
            if i == 0:
                index_list = row[1:5]
                project_name = row[0]
                X = index_list[0:3]
                Y = [index_list[3]]
            else:
                data[row[0]] = row[1:5]

        data = pd.DataFrame(data, index=index_list).T
        X = data[X]
        Y = data[Y]

        dea = DEA(DMUs_Name=data.index, X=X, Y=Y)
        results = dea.analysis()
        results_records = results.values
        results_columns = results.columns
        columns = [{
                'name': project_name,
                'group': project_name,
                'key': 0
            }]
        records = []
        
        for i in results_columns:
            columns_length = len(columns)
            columns.append({
                'name': i[1],
                'group': i[0],
                'key': columns_length
            })

        for i in results_records:
            results_record = list(i)
            records.append(results_record)
        
        for i in range(1, sheet.nrows):
            row = sheet.row_values(i)
            records[i - 1].insert(0, row[0])

        return Response({
            'columns': columns,
            'records': records,
        })
