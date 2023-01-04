import warnings
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import Http404, HttpResponse, JsonResponse
from annoying.functions import get_object_or_None
from .forms import UploadFileForm, JsonTestFile
#from .models import ToolsEachobservation, ToolsAnnotation, ToolsChromosome, ToolsScalegenome, UploadParametersMD5, ToolsModM6A, ToolsModM1A, ToolsModM5C
# from .process_file import handle_uploaded_file
from .models import *
from .handle_file import handle
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max, Min
import sys, datetime, time
import ujson, json
import hashlib
import csv
import numpy as np
import re

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
    context = {}
    return render(request, 'tools/search.html', context)



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
def search_indb(request):
    start_time = time.time()
    assert request.method == "GET", f"request.method is {request.method} not GET"
    
    # search for the database to get this form of data

    
    gene_name = request.GET['gene_name']
    print(f"gene_name {gene_name}")
    
    start_mr_search_time = time.time()
    data_micro = SearchTable.objects.filter(GeneName__exact = gene_name)
    print(f"microarray seach time {time.time() - start_mr_search_time} s")
    print(f"microarray data.objects.count() {len(data_micro)}")

    data_rna = SearchTableRNAseq.objects.filter(GeneName__exact = gene_name)
    print(f"RNA data.objects.count() {len(data_rna)}")
    # print(f"data micro {list(data_micro)}")
    
    start_convert = time.time()

    all_out_data = {'MicroArray': convert_obj_to_dict(data_micro, mode='micro'), 
                    'RNASeq': convert_obj_to_dict(data_rna, mode='RNAseq')
                    }
    print(f"Convert use time {time.time() - start_convert} s")
    return JsonResponse(all_out_data, safe=False)
    # out_data = {}

    # # get unique duration, dose
    # st_iter = time.time()
    # for data_i in data:
    #     logfc = data_i.Log2FC
    #     logp = data_i.minus_log10padj # ?????
    #     CellLine = data_i.CellLine.replace(" ", "")
    #     RepL = data_i.RepL
    #     DataSet = data_i.DataSet
    #     Dose = data_i.Dose
    #     Rep = data_i.Rep
    #     Duration = data_i.Duration
    #     GSE = data_i.GSE

    #     obj = {'logfc': float(logfc),
    #             'logp': float(logp),
    #             'name': CellLine,
    #             'duration': convert_hour_radius(Duration),
    #             'dose': Dose,
    #             'DataSet': DataSet,
    #             'GSE': GSE,
    #         }
    #     if CellLine not in out_data:
    #         out_data[CellLine] = [obj]
    #     else:
    #         out_data[CellLine].append(obj)
    # print(f"time for object iteration {time.time() - st_iter}")
    # # calculate stats
    # start_calculate_stats_time = time.time()
    # stats_1 = calculate_statistics(out_data, threshold_fc=0.5)
    # print(f"time for calculate stats {time.time() - start_calculate_stats_time}")

    # all_out_data.append(out_data)
    
    
    # # RNAseq
    # start_rna_search_time = time.time()
    # data = SearchTableRNAseq.objects.filter(GeneName__exact = gene_name)
    # print(f"RNA seach time {time.time() - start_rna_search_time} s")
    # print(f"RNAseq data.objects.count() {len(data)}")
    # out_data = {}
    # st_iter_rna = time.time()
    # for data_i in data:
    #     logfc = data_i.Log2FC
    #     logp = data_i.minus_log10padj # ???
    #     CellLine = data_i.CellLine.replace(" ", "")
    #     Dose = data_i.Dose
    #     Rep = data_i.Rep
    #     Duration = data_i.Duration
    #     GSE = data_i.GSE
        
    #     # print(f"data_i.filename {data_i.filename} out {out_name}: hour: {hours}; dose {dose}")
    #     # create object to append

    #     duration, multi_duration = convert_RNAseq_hour_radius(Duration)


    #     obj = {'logfc': float(logfc),
    #             'logp': float(logp),
    #             'name': CellLine,
    #             'duration': duration,
    #             'multi_duration': multi_duration,
    #             'dose': Dose,
    #             'GSE': GSE,
    #         }
    #     if CellLine not in out_data:
    #         out_data[CellLine] = [obj]
    #     else:
    #         out_data[CellLine].append(obj)
    # print(f"RNA-seq iter {time.time() - st_iter_rna}")
    # stats_2 = calculate_statistics(out_data, threshold_fc=2.0)
    # print(f"RNA-seq processing time {time.time() - st_iter_rna}")
    # all_out_data.append(out_data)

    # all_out_data.append(stats_1)
    # all_out_data.append(stats_2)
    # end_time = time.time()

    # total_time = end_time - start_time
    # print(f"Total time {total_time} s")
    # return JsonResponse(all_out_data, safe=False)


def convert_obj_to_dict(data, mode='micro'):
    output = []
    for data_i in data:
        if mode == 'micro':
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
        elif mode == 'RNAseq':
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
        output.append(obj)
    return output


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



# ======================== UPLOAD & SAVE ==============================

@csrf_exempt
def save_to_files(request):
    if request.method == "POST":
        print("POST: ", request.POST)
        print("FILES: ", request.FILES)
        try:
            form = UploadFileForm(data=request.POST, files=request.FILES)
            if form.is_valid():
                # get md5 value. Note: consider (file + parameters) as a whole md5
                form_file = form.cleaned_data['file']

                str_parameters = form.cleaned_data['parameters']
                print(str_parameters)
                print("OK here0")
                parameters = json.loads(str_parameters)
                print(parameters)
                print("OK here1")


                b_file = form_file.read()
                print("OK here 2")
                file_parameters = str_parameters.encode('utf-8') + b_file
                md5 = hashlib.md5(file_parameters).hexdigest()


                sub_base = "md5_data/"
                path = sub_base + md5

                # check if the file exists
                md5ob = get_object_or_None(UploadParametersMD5, md5=md5)
                print("Md5 existed in DB?: ", md5ob)

                if md5ob:
                    status_old = md5ob.status
                    print("existed in databse, code: ", status_old)
                    time_ = md5ob.time
                    if status_old == 200:
                        return_json = [{'md5': md5, 'time': time_, 'save_status': 'Finished'}]
                        return JsonResponse(return_json, safe=False)
                    ##elif status_old == 201:
                    ##    return_json = [{'md5': md5, 'time': time_, 'save_status': True}]
                    ##    return JsonResponse(return_json, safe=False)
                    elif status_old == 202:
                        return_json = [{'md5': md5, 'time': time_, 'save_status': "Running"}]
                        return JsonResponse(return_json, safe=False)


                # check if the file existed in filesystem
                if md5ob:
                    print("Previous saving failed, Re-saving now...")
                if default_storage.exists(path):
                    default_storage.delete(path)

                time_ = time.time()
                return_json = [{'md5': md5, 'time': time_}]

                # store md5 value and parameters into database, store file
                print("saving upload file...")
                path = default_storage.save(sub_base + md5, form_file) # note this path doesnot include the media root, e.g. it is actually stored in "media/data/xxxxxx"
                file_path = settings.MEDIA_ROOT + '/' + path
                # distribute parameters details
                file_type = parameters['filetype']
                species = parameters['species']

            

                # insert to data base the info of file, paramerter and time
                # initial code 202
                print("create model instance")
                a = UploadParametersMD5(md5 = md5, status = 202, file_type = file_type, species = species, time = time_, path = file_path)
                a.save()

                return_json = [{'md5': md5, 'time': time_, 'save_status': True}]
                return JsonResponse(return_json, safe=False)
            else:
                print("Form not valid")
                print("Error: ", form.errors)


        except Exception as e:
            print("Save to file Failed: ", e)
            return_json = [{'md5':"", 'time': 0.0, 'save_status': False}]
            return JsonResponse(return_json, safe=False)
        


def call_process(file_path, md5, parameters):
    """Function to control the file process precedure"""

    # info_needed = ['circRNA_ID', 'chr', 'circRNA_start', 'circRNA_end']
    # save_status = handle_uploaded_file(form_file, info_needed, md5ob, parameters, toCHR, get_chr_num, circ_isin)



    configuration = {
        'FILE_NAME': file_path,
        'CORE_NUM': 4,
        'FILE_TYPE': parameters['filetype'],
        'NEW_FILE': f'{md5}_circDraw_generate',
        'ASSEMBLY': parameters['species'],
        'TASK_ID': md5,
    }

    save_status,circRNA_length_distribution,circRNA_isoform = handle(configuration)
    print('In View:', circRNA_length_distribution, circRNA_isoform)
    st = StatisticTable(md5=md5, lenChart=circRNA_length_distribution, toplist=circRNA_isoform)
    st.save()
    print("Saved?: {} {}".format(save_status, md5))
    return save_status

######### END of save_to_files #########

# ======================== RUN ==============================
@csrf_exempt
def run_call(request):
    # run save fille for 
    if request.method == 'GET':
        md5 = request.GET['caseid']
        try:
            md5ob = get_object_or_None(UploadParametersMD5, md5=md5)
            parameters = {}
            # md5 = md5, status = 202, file_type = file_type, species = species, time = time_, path = path 
            parameters['filetype'] = md5ob.file_type
            parameters['species'] = md5ob.species
            filepath = md5ob.path
            # call process
            save_status = call_process(filepath, md5, parameters)
            if save_status:
                ss_status = True
                md5ob.status = 200
                md5ob.save()
                return JsonResponse([{"call_process": True, "error": ""}], safe=False)

            else:
                ss_status = False
                print("MD5 {} status 404! Call process return False...".format(md5))
                print("Save data into database failed, deleting uploaded file now...")
                default_storage.delete(filepath)
                md5ob.delete()
                return JsonResponse([{"call_process": False, "error": "Wrong File Input..."}], safe=False)
        except Exception as e:
            print("Run call failed: ", e)
            return JsonResponse([{"call_process": False, "error": "Server Error..."}], safe=False)
            








# ======================== Check Status ==============================

def check_status(request):
    if request.method == 'GET':
        md5 = request.GET['caseid']
        try:
            md5ob = get_object_or_None(UploadParametersMD5, md5=md5)
            process_status = md5ob.status
            time_ = md5ob.time
            print("STATUS CODE: ", process_status)
            return JsonResponse([{'status': process_status,'time': time_}], safe=False)
        except:
            print("check status error: No object returned or attribute is not correct")
            return JsonResponse([{'status': 404}], safe=False)
    else:
        raise Http404

# ===================== HANDLE AJAX CALL =================================

# ---------------------handle_file1---------------------------------------
@csrf_exempt
def handle_chrLen(request):
    # database needed: chromosome_length
    if request.method == 'GET':
        case_id = request.GET['case_id']
        print("chrLen caseid: ", case_id)
        case_species = UploadParametersMD5.objects.get(md5 = case_id)
        try:
            ob_distinct_chr = UserDensity.objects.filter(md5 = case_id).values('chr_num').distinct()
            distinct_chr = [ob['chr_num'] for ob in ob_distinct_chr]
            obs = chromosome_length.objects.filter(assembly = case_species.species).values('chr_num', 'chr_length')
        except Exception as e:
            print(e)
        results = []
        for ob in obs:
            if ob['chr_num'] in distinct_chr:
                results.append({
                'chr': ob['chr_num'],
                'chrLen': ob['chr_length']
            })
        print("GET /tools/display/chrLen:", len(results))
        return JsonResponse(results, safe=False)
    else:
        print("GET /tools/display/chrLen: Failed")
        raise Http404

def handle_density(request):
    # database needed: UserDensity
    if request.method == 'GET':
        case_id = request.GET['case_id']
        print("density case_id: ", case_id)
        try:
            obs = UserDensity.objects.filter(md5 = case_id)
        except Exception as e:
            print(e)
        print("GET /tools/display/density:", len(obs))
        results = [{
                    "chr": ob.chr_num,
                    "start": ob.start,
                    "end": ob.end,
                    "name": ob.name,
                    "geneID": ob.gene_id,
                    "type": ob.gene_type,
                    "count": ob.circ_num
                } for ob in obs]
        return JsonResponse(results, safe=False)
    else:
        print("GET /tools/display/density: Failed")
        raise Http404

def handle_circrnas(request):
    # database needed:
    if request.method == 'GET':
        case_id = request.GET['caseid']
        gene_id = request.GET['geneid']
        chr_num = request.GET['chr']
        start = request.GET['start']
        end = request.GET['end']
        """ print("circrnas parameters: ", case_id)
        print(gene_id)
        print(chr_num)
        print(start)
        print(end) """
        obs = UserTable.objects.filter(md5 = case_id).filter(gene_id = gene_id)
        print("GET /tools/display/circrnas:", len(obs))
        results = []
        for ob in obs:
            for i in ujson.loads(ob.circ_on_gene_all):
                results.append(i)
        return JsonResponse(results, safe=False)
    else:
        print("GET /tools/display/circrnas: Failed")
        raise Http404

def handle_genes(request):

    if request.method == 'GET':
        case_id = request.GET['caseid']
        chr_num = request.GET['chr']
        start = request.GET['start']
        end = request.GET['end']
        print("gene caseid: ", case_id)
        case_species = UploadParametersMD5.objects.get(md5 = case_id)
        obs = exec(f"""{case_species.species}_speceis_genome_genes.objects.filter(chr_num = chr_num).filter(start >= start).filter(end <= end)""")
        print("GET /result/genes:", len(obs))
        results = [{
                    "name": ob.name,
                    "start": ob.start,
                    "end": ob.end,
                    "type": ob.type,
                    "id": ob.id
                    } for ob in obs]
        print("GET /result/circrnas:", results)
        return JsonResponse(results, safe=False)
    else:
        print("GET /result/circrnas: Failed")
        raise Http404

def lenChart(request):
    if request.method == 'GET':
        case_id = request.GET['caseid']
        data = StatisticTable.objects.filter(md5__exact=case_id)
        print(data)
        result = ujson.loads(data[0].lenChart)
        return JsonResponse(result, safe=False)
    else:
        raise Http404

def toplist(request):
    if request.method == 'GET':
        case_id = request.GET['case_id']
        data = StatisticTable.objects.filter(md5__exact=case_id)
        result = ujson.loads(data[0].toplist)
        return JsonResponse(result, safe=False)
    else:
        raise Http404

def download_UserFile(request):
    # Create the HttpResponse object with the appropriate CSV header.
    if request.method == 'GET':
        case_id = request.GET['case_id']
        print(f'Generating result file for {case_id}')
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="circDraw_results_{case_id}.csv"'
        print('Finished writing http head-content')
        writer = csv.writer(response,delimiter='\t')
        print('Create csv writer')
        all_results = UserTable.objects.filter(md5=case_id)
        print('Get from database')
        for r in all_results:
            writer.writerow([r.gene_id,r.chr_num, r.start, r.end, r.name, r.gene_type, r.circ_on_gene_all, r.circ_on_num])
        return response

# ===================== View Example =================================

def view_example(request):
    # redirect to the example page:
    example_md5 = "4672896d383d34c10a4561dddece79aa"
    return redirect("/tools/display/" + example_md5)



