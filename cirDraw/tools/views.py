import warnings
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import Http404, HttpResponse, JsonResponse

from .forms import UploadFileForm, JsonTestFile

from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max, Min
from django.db.models import Q
import sys, datetime, time
import json
import hashlib
import csv
import numpy as np
import re
import pickle
import os 

# ========================= RENDER PAGES ==============================
def render_index_page(request):
    context = {}
    return render(request, 'tools/index.html', context)

def render_upload_page(request):
    """test_render_upload_page"""
    context = {}
    return render(request, 'tools/upload.html', context)

def render_search_page(request):
    """test_render_search_page"""
    # preload data
    prepath = "/home/tianqinl/mye2/cirDraw/tools/cache.pkl"
    if not os.path.isfile(prepath): 
        prepath = "/home/tianqinl/Code/e2database-release/cirDraw/tools/cache.pkl"
    if not os.path.isfile(prepath):
        prepath = "/Users/tianqinli/Code/e2database-release/cirDraw/tools/cache.pkl"
    with open(prepath, 'rb') as f:
         all_out_data = pickle.load(f)
    all_out_data_json = json.dumps(all_out_data)
    context = {'preload': all_out_data_json}
    return render(request, 'tools/search.html', context)

def render_stats_page(request):
    """test_render_search_page"""
    # preload data
    # with open("/home/tianqinl/mye2/cirDraw/tools/cache.pkl", 'rb') as f:
    #      all_out_data = pickle.load(f)
    # all_out_data_json = json.dumps(all_out_data)
    context = {}
    return render(request, 'tools/stats.html', context)



def render_display_page(request, md5):
    context = {"md5": md5}
    print('Render display1:',md5)
    case = UploadParametersMD5.objects.filter(md5 = md5).values('status')
    print("check:", context)
    if case.exists():
        #print("check:",case)
        code = case[0]['status']
        print('Render display2:', code, type(code))
        if code == 200:
            return render(request, 'tools/tools.html', context)
        elif code == 202:
            return render(request, 'tools/wait.html', context)
        else:
            return render(request, 'tools/HTTP404.html', context)
    else:
        print('This md5 not exist.')
        return render(request, 'tools/HTTP404.html', context)
        #raise Http404


# ====================================================================

@csrf_exempt
def get_stats(request): 
    celllines = request.GET['celllines']
    if len(celllines) == 0:
        celllines = 'ALL'
    else:
        celllines = celllines[:-1].split(";")
    
    # duration
    durations = request.GET['durations']
    if len(durations) == 0:
        durations = 'ALL'
    else:
        print(durations[:-1])
        durations = [int(i[:-5]) for i in durations[:-1].split(";")]
    
    
    # dose
    doses = request.GET['doses']
    if len(doses) == 0:
        doses = 'ALL'
    else:
        doses = [int(i[:-3]) for i in doses[:-1].split(";")]
    
    
    # uppercent 
    up_percent = request.GET['up_percent']
    down_percent = request.GET['down_percent']
    adj_p_value = request.GET['adj_p_value']
    logfc = request.GET['logfc']
    
    if up_percent == "-1":
        mode = "down"
        mode_sign = "<"
        logfc = str(-float(logfc))
        percent = str(float(down_percent) * 0.01)
    elif down_percent == '-1':
        mode = "up"
        mode_sign = ">"
        percent = str(float(up_percent) * 0.01)
    else:
        raise ValueError(f"up_percent {up_percent} BUT down_percent {down_percent}")

    # check sanity
    print(f"durations {durations}")
    print(f"doses {doses}")
    print(f"celllines {celllines}")
    
    # MicroArray
    if celllines != 'ALL' or durations != 'ALL' or doses != 'ALL':
        query = "WHERE "
        if celllines != 'ALL':
            query += "(CellLine = '" + str(celllines[0]) + "'"
            if len(celllines) > 1:
                for cell_line in celllines[1:]:
                    query += " OR CellLine = '" + str(cell_line) + "'"
            query += ")"
            query += " AND "
        
        if durations != 'ALL':
            query += "(Duration = " + str(durations[0]) 
            if len(durations) > 1:
                for duration in durations[1:]:
                    query += " OR Duration = " + str(duration)
            query += ")"
            query += " AND "
        
        if doses != 'ALL':
            query += "(Dose = " + str(doses[0]) 
            if len(doses) > 1:
                for dose in doses[1:]:
                    query += " OR Dose = " + str(dose)
            query += ")"
    
        print(query)
    else:
        query = ""
    sql_query = f'''
    select 1 as id, C.ins_count, C.genename, C.logfc_percent, C.log10padj_percent from (select count(A.GeneName) 
    as ins_count,A.GeneName, AVG(Log2FC{mode_sign}{logfc}) as logfc_percent, AVG(minus_log10padj>{str(-np.log10(float(adj_p_value)))} OR A.minus_log10padj=0.0) as log10padj_percent from 
    (select GeneName, Log2FC, minus_log10padj from CombinedData {query}) as A group by A.GeneName ORDER BY ins_count DESC, logfc_percent DESC) C 
    where C.logfc_percent > {percent} AND C.log10padj_percent > {percent};'''
    print('SQL: ', sql_query)
    data_p = SearchTable.objects.raw(sql_query)
    print(len(data_p))
   
    print(data_p.columns)
    data_microarray = []
    # TODO: get the return of microarray ready
    for data_i in data_p:
        # print(data_i.ins_count, data_i.genename)
        obj_i = {
            'ins_count': data_i.ins_count,
            'genename': data_i.genename,
            'logfc_percent': round(data_i.logfc_percent * 100, 2),
            'log10padj_percent': data_i.log10padj_percent,
        }
        data_microarray.append(obj_i)
    

    ## RNA-seq
    sql_query = f'''
    select 1 as id, C.ins_count, C.genename, C.logfc_percent, C.log10padj_percent from (select count(A.GeneName) 
    as ins_count,A.GeneName, AVG(Log2FC{mode_sign}{logfc}) as logfc_percent, AVG(A.minus_log10padj>{str(-np.log10(float(adj_p_value)))} OR A.minus_log10padj=0.0) as log10padj_percent from 
    (select GeneName, Log2FC, minus_log10padj from RNAseqData {query}) as A group by A.GeneName ORDER BY ins_count DESC, logfc_percent DESC) C 
    where C.logfc_percent > {percent} AND C.log10padj_percent > {percent};'''
    print('RNAseq SQL: ', sql_query)
    data_p = SearchTable.objects.raw(sql_query)
    print(len(data_p))
   
    print(data_p.columns)
    data_rnaseq = []
    # TODO: get the return of microarray ready
    for data_i in data_p:
        # print(data_i.ins_count, data_i.genename)
        obj_i = {
            'ins_count': data_i.ins_count,
            'genename': data_i.genename,
            'logfc_percent': round(data_i.logfc_percent * 100, 2),
            'log10padj_percent': data_i.log10padj_percent,
        }
        data_rnaseq.append(obj_i)
    


    
    return JsonResponse([data_microarray, data_rnaseq], safe=False)



# ====================================================================
@csrf_exempt
def search_indb(request):
    start_time = time.time()
    assert request.method == "GET", f"request.method is {request.method} not GET"
    
    # search for the database to get this form of data


    gene_name = request.GET['gene_name']
    print(f"gene_name {gene_name}")
    
    start_mr_search_time = time.time()
    data = SearchTable.objects.filter(GeneName__exact = gene_name)
    print(f"microarray seach time {time.time() - start_mr_search_time} s")
    print(f"microarray data.objects.count() {len(data)}")

    all_out_data = []
    
    out_data = {}

    # get unique duration, dose
    st_iter = time.time()
    for data_i in data:
        logfc = data_i.Log2FC
        logp = data_i.minus_log10padj # ?????
        CellLine = data_i.CellLine.replace(" ", "")
        RepL = data_i.RepL
        DataSet = data_i.DataSet
        Dose = data_i.Dose
        Rep = data_i.Rep
        Duration = data_i.Duration
        GSE = data_i.GSE

        obj = {'logfc': float(logfc),
                'logp': float(logp),
                'name': CellLine,
                'duration': convert_hour_radius(Duration),
                'dose': Dose,
                'DataSet': DataSet,
                'GSE': GSE,
            }
        if CellLine not in out_data:
            out_data[CellLine] = [obj]
        else:
            out_data[CellLine].append(obj)
    print(f"time for object iteration {time.time() - st_iter}")
    # calculate stats
    start_calculate_stats_time = time.time()
    stats_1 = calculate_statistics(out_data, threshold_fc=0.5)
    print(f"time for calculate stats {time.time() - start_calculate_stats_time}")

    all_out_data.append(out_data)
    
    
    # RNAseq
    start_rna_search_time = time.time()
    data = SearchTableRNAseq.objects.filter(GeneName__exact = gene_name)
    print(f"RNA seach time {time.time() - start_rna_search_time} s")
    print(f"RNAseq data.objects.count() {len(data)}")
    out_data = {}
    st_iter_rna = time.time()
    for data_i in data:
        logfc = data_i.Log2FC
        logp = data_i.minus_log10padj # ???
        CellLine = data_i.CellLine.replace(" ", "")
        Dose = data_i.Dose
        Rep = data_i.Rep
        Duration = data_i.Duration
        GSE = data_i.GSE
        
        # print(f"data_i.filename {data_i.filename} out {out_name}: hour: {hours}; dose {dose}")
        # create object to append

        duration, multi_duration = convert_RNAseq_hour_radius(Duration)


        obj = {'logfc': float(logfc),
                'logp': float(logp),
                'name': CellLine,
                'duration': duration,
                'multi_duration': multi_duration,
                'dose': Dose,
                'GSE': GSE,
            }
        if CellLine not in out_data:
            out_data[CellLine] = [obj]
        else:
            out_data[CellLine].append(obj)
    print(f"RNA-seq iter {time.time() - st_iter_rna}")
    stats_2 = calculate_statistics(out_data, threshold_fc=2.0)
    print(f"RNA-seq processing time {time.time() - st_iter_rna}")
    all_out_data.append(out_data)

    all_out_data.append(stats_1)
    all_out_data.append(stats_2)


    # chipseq
    start_chipseq = time.time()
    print(f"---------gene_name {gene_name}")
    gene_info = SearchTableChipSeqRefData.objects.filter(gene__exact = gene_name) 
    print(f"----gene_info {len(gene_info)}")
    if len(gene_info) > 0:
        chr_num = gene_info[0].chr_num
        tss = np.mean([i.tss for i in gene_info])
        up_tss = max(0, tss - 200000)
        down_tss = tss + 200000
        data_chip = SearchTableChipSeq.objects.filter(chr_num__exact = chr_num).filter(mid__gt = up_tss).filter(mid__lt=down_tss)
        print([i.score for  i in data_chip])
        print(f"chipseq time is {time.time() - start_chipseq}")
        
        out_data = {}
        for data_i in data_chip:
            mid = data_i.mid
            score = data_i.score # ???
            CellLine = data_i.Cellline.replace(" ", "")
            Dose = data_i.Dose
            Duration = data_i.Duration.replace(" ", "").replace(",", "-")
            GSE = data_i.GSE
            
            # print(f"data_i.filename {data_i.filename} out {out_name}: hour: {hours}; dose {dose}")
            # create object to append

            duration, multi_duration = convert_RNAseq_hour_radius(Duration)


            obj = {"log2score": np.log2(float(score)),
                    "tss": (mid - tss)/1000,
                    "name": CellLine,
                    "duration": duration,
                    "multi_duration": multi_duration,
                    "dose": Dose,
                    "GSE": GSE,
                }
            if CellLine not in out_data:
                out_data[CellLine] = [obj]
            else:
                out_data[CellLine].append(obj)
    else:
        out_data = {}
    all_out_data.append(out_data)
    end_time = time.time()
    total_time = end_time - start_time
    print(f"Total time {total_time} s")
   
    return JsonResponse(all_out_data, safe=False)



def calculate_statistics(out_data, threshold_fc):
    # calculate stats for (sig_downregulated, middle, sig_upregulated)
    stats = {}
    for i in out_data:
        stats_i = [0, 0] # sig_down, sig_up
        for j in out_data[i]:
            # print(j)

            if j['logfc'] > 0 :
                if (j['logp'] == 0 and j['logfc'] > threshold_fc) or (j['logp'] >= 1.0):
                    stats_i[1] += 1
            elif j['logfc'] < 0:
                if (j['logp'] == 0 and j['logfc'] < -threshold_fc) or (j['logp'] >= 1.0):
                    stats_i[0] += 1
               
        i_sum = stats_i[0] + stats_i[1]
        
        stats_i[0], stats_i[1] = round(stats_i[0]/len(out_data[i]), 2), round(stats_i[1]/len(out_data[i]), 2)
        
    
        stats[i] = stats_i
    print(f"stats {stats}")
    return stats


def convert_RNAseq_hour_radius(hours):
    if "-" in hours:
        hours = [float(i) for i in hours.split("-")]
        return convert_hour_radius(np.mean(hours)), True
    else:
        return convert_hour_radius(float(hours)), False

def convert_hour_radius(hours):
    return np.log(hours + 1)


def meta_info_process(filename):
    """filter the filename"""
    filename_list = filename.split("_")
    out_name_list = []
    hours = 0
    dose = 0
    hour_string = ""
    dose_string = ""
    

    for piece in filename_list:
        piece = piece.replace("\"", "")
        append_switch = 1
        if 'h' == piece.lower()[-1]:
            try:
                hours = int(piece[:-1])
                append_switch = 0
            except Exception as e:
                warnings.warn(f"Warning: Unsuccessful parsing for hours: {e}")
        if 'nM' == piece[-2:]:
            try:
                dose = int(piece[:-2])
                append_switch = 0
            except Exception as e:
                warnings.warn(f"Warning: Unsuccessful parsing for dose: {e}")
        # cout as part of the name if not be used as dose or hours
        if append_switch:
            out_name_list.append(piece)
    
    M = out_name_list[0]
    out_name_list = out_name_list[1:]
    out_name_list = [p for p in out_name_list if not re.match(r'^\d+', p)]
    
    out_name = "_".join(out_name_list) 
    return out_name, hours, dose, M








