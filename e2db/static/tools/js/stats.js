$(document).ready(function () {
    window.click_once = false;
    window.download_ready = false;
    const button = document.querySelector('button');

    $('#button').click(function (e) {
        e.preventDefault();
        $('#fname1').html('GREB1');
    });
    function draw_left_bar_plot(processResult) {
        console.log("processResult")
        console.log(processResult)
        var current_focus_idx = 0;
        var datasets_counts = [];
            var datasets_names = []
            var upordown = processResult[0]
            var count_color = [];
            for (i in processResult[1]){
                if (upordown == 'up') {
                    datasets_counts.push(processResult[1][i].Counts)
                    if (i == 0) {
                        count_color.push('rgba(255, 0, 0, 0.5)')
                        //count_color.push('rgba(238, 130, 238, 0.5)')
                    } else {
                        count_color.push('rgba(255, 0, 0, 0.5)')
                    }
                } else {
                    datasets_counts.push(-1 * processResult[1][i].Counts)
                    if (i == 0) {
                        //count_color.push('rgba(255, 0, 255, 0.5)')
                        count_color.push('rgba(0, 0, 255, 0.5)')
                    } else {
                        count_color.push('rgba(0, 0, 255, 0.5)')
                    }
                }

                datasets_names.push(processResult[1][i].Name)
            }
            console.log(datasets_counts, datasets_names)

            if (upordown == 'up') {
                var count_bcolor = 'rgba(255, 0, 0, 1)'
                var labels = "Comparsion Number"
            } else {
                var count_bcolor = 'rgba(0, 0, 255, 1)'
                var labels = "Comparsion Number"
            }
            const data = {
                labels: datasets_names,
                datasets: [{
                    label: labels,
                    data: datasets_counts,
                    backgroundColor: count_color,
                    borderColor: [
                        count_bcolor,
                    ],
                    borderWidth: 1
                }]
            };

            // config
            const config = {
                type: 'bar',
                data: data,
                options: {
                    plugins: {
                        tooltip: {
                            enabled: false // <-- this option disables tooltips
                          },
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Selected Genes (top ' + processResult[1].length + ' displayed)'
                        }
                    },
                    scales: {

                    y: {
                        beginAtZero: true,
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value, index, ticks) {
                                return Math.abs(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Number of comparisons that fit the cutoff'
                          }
                    },
                    x: {
                        ticks: {
                            autoSkip: false
                        }
                    }


                    }
                }
            };

            // render init block
            const myChart = new Chart(
                document.getElementById('myChart-meta'),
                config
            );
    }
    // function update_dataset_right() {
    //     negative_data = []
    //     for (i in window.all_meta_dataset[window.showing_index]['down']) {
    //         negative_data.push(-1 * window.all_meta_dataset[window.showing_index]['down'][i])
    //     }
    //     const data_ind = {
    //         labels: ["0-5", "5-10", "10-15", "15-20", "20-25", "25-30", "30-35",
    //                 "35-40", "40-45", "45-50", "50-55", "55-60", "60-65", "65-70", "70-75",
    //                 "75-80", "80-85", "85-90", "90-95", "95-100"],
    //         datasets: [{
    //             label: 'Up Regulated ',
    //             data: window.all_meta_dataset[window.showing_index]['up'],
    //             backgroundColor: [
    //                 'rgba(255, 0, 0, 0.5)',
    //             ],
    //             borderColor: [
    //                 'rgba(255, 0, 0, 1)',
    //             ],
    //             borderWidth: 1
    //         }, {
    //             label: 'Down Regulated ',
    //             data: negative_data,
    //             backgroundColor: [
    //                 'rgba(0, 0, 255, 0.5)',
    //             ],
    //             borderColor: [
    //                 'rgba(0, 0, 255, 1)',
    //             ],
    //             borderWidth: 1
    //         }]
    //     };
    //     return data_ind;

    // }

    function update_dataset_right_input(gene_name, up, down) {
        negative_data = []
        for (i in down) {
            negative_data.push(-1 * down[i])
        }
        var pos_data = up;
        const data_ind = {
            labels: ["0-5", "5-10", "10-15", "15-20", "20-25", "25-30", "30-35",
                    "35-40", "40-45", "45-50", "50-55", "55-60", "60-65", "65-70", "70-75",
                    "75-80", "80-85", "85-90", "90-95", "95-100"],
            datasets: [{
                label: 'Up Regulated',
                data: pos_data,
                backgroundColor: [
                    'rgba(255, 0, 0, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)',
                ],
                borderWidth: 1
            }, {
                label: 'Down Regulated',
                data: negative_data,
                backgroundColor: [
                    'rgba(0, 0, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)',
                ],
                borderWidth: 1
            }]
        };
        return data_ind;

    }

    
    function update_right_basic(instance) {
        var celllines, durations, doses
        [celllines, durations, doses] = getWindowFilter();
        var top_percent = $('#fname3').val();
        var upordown = $('#fname4').val();
        var disply_percent = $('#fname5').val();
        var gene_name = window.all_meta[window.showing_index].Name
        
        // ajax call
        $.getJSON("/tools/get_meta_stats_each_gene/", {
            celllines: celllines,
            durations: durations,
            doses: doses,
            top_percent: top_percent,
            upordown: upordown,
            disply_percent: disply_percent,
            gene_name: gene_name
        }).done(function (processResult) {
            // instance.data = update_dataset_right()
            var gene_name = processResult[0]
            var up = processResult[1]
            var down = processResult[2]
            
            instance.data = update_dataset_right_input(gene_name, up, down);
            instance.options.plugins.title.text = 'Regulation Percentile for Gene ' + gene_name
            instance.update();
        })

    }
    $('#prev_btn').click(function (e) {
        e.preventDefault();
        console.log('fefefe')
        Chart.helpers.each(Chart.instances, function(instance){
            //console.log(instance.canvas.id);

            if ((instance.canvas.id == 'myChart-meta-ind')) {
              // chnage chart js dataset
              window.showing_index = window.showing_index - 1
              if (window.showing_index < 0) {
                window.showing_index = 0
              }
              update_right_basic(instance);
            }

          });
    })

    $('#next_btn').click(function (e) {
        // try to query the gene based on the conditions (independent ajax call to hide latency)
        e.preventDefault();
        
        console.log('next')
        Chart.helpers.each(Chart.instances, function(instance){
            //console.log(instance.canvas.id);

            if ((instance.canvas.id == 'myChart-meta-ind')) {
              // chnage chart js dataset
              window.showing_index = window.showing_index + 1
              if (window.showing_index >= window.all_meta.length) {
                window.showing_index = (window.all_meta.length - 1)
              }
              
              // TODO: make an ajax call here and get back data
              // get window conditions
              update_right_basic(instance);

            }

          });

          

          
    })

    function createDownloadLink(anchorSelector, str, fileName){
        if(window.navigator.msSaveOrOpenBlob) {
            var fileData = [str];
            blobObject = new Blob(fileData);
            $(anchorSelector).click(function(){
                window.navigator.msSaveOrOpenBlob(blobObject, fileName);
            });
        } else {
            var url = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
            $(anchorSelector).attr("download", fileName);
            $(anchorSelector).attr("href", url);
        }
    }

    $(function () {
        var str = "hi,file";
        createDownloadLink("#export",str,"file.txt");
    });


    
    function getWindowFilter() {
        var celllines = ""
        if (window.focus_set['cellline'].length > 0) {
            for (i in window.focus_set['cellline']) {
                var cell_i = $('#' + window.focus_set['cellline'][i]).html()
                celllines += cell_i
                console.log(celllines)
                celllines += ";"
            }
        }


        var durations = ""
        if (window.focus_set['duration'].length > 0) {
            for (i in window.focus_set['duration']) {
                var cell_i = $('#' + window.focus_set['duration'][i]).html()
                durations += cell_i
                durations += ";"
            }
        }

        var doses = ""
        if (window.focus_set['dose'].length > 0) {
            for (i in window.focus_set['dose']) {
                var cell_i = $('#' + window.focus_set['dose'][i]).html()
                doses += cell_i
                doses += ";"
            }
        }
        return [celllines, durations, doses];
    }
    
    function prepare_download_file() {
        // ajax call with no limits
        var top_percent = $('#fname3').val();
        var upordown = $('#fname4').val();
        var disply_percent = -1;
        
        // filtering
        var filter_results = getWindowFilter();

        var celllines = filter_results[0];
        var durations = filter_results[1];
        var doses = filter_results[2];

        $.getJSON("/tools/get_meta_stats/", {
            celllines: celllines,
            durations: durations,
            doses: doses,
            top_percent: top_percent,
            upordown: upordown,
            disply_percent: disply_percent
        }).done(function (processResult) {
            var data_mata = processResult[1];
            window.str_download = "Gene\tCount\n"
            for (i in data_mata) {
                window.str_download += data_mata[i].Name
                window.str_download += "\t"
                window.str_download += data_mata[i].Counts
                window.str_download += "\n"
            } 
            console.log(window.str_download);
            document.getElementById("download_meta").innerHTML = `<i class="fa fa-download" style="font-size:26px;color:black"></i>`
            
        })
    }


    $('#download_meta').click(function (e) {
        // e.preventDefault();
        console.log("download_meta - download_meta call")
        // document.getElementById("processtip4").innerHTML = "<span class='ld ld-ring ld-spin'></span>"
        
        createDownloadLink(`#download_meta`, window.str_download, "E2DB-meta-statistics.txt");
        
    });

   


    function process_submit3(processResult) {
        document.getElementById('meta_results_id').classList.remove("hidden");
        document.getElementById('prevnextbutton').classList.remove("hidden");
        document.getElementById("prev_btn").classList.remove("hidden");
        document.getElementById("next_btn").classList.remove("hidden");
        document.getElementById("download_meta").classList.remove("hidden");
        console.log(processResult);
        // prepare download data 
        

        // For left chart, see function draw_left_bar_plot
        draw_left_bar_plot(processResult);
        // For right chart individual one
        window.showing_index = 0;
        window.all_meta_dataset = processResult[2];
        window.all_meta = processResult[1];

        negative_data = []
        for (i in window.all_meta_dataset[window.showing_index]['down']) {
            negative_data.push(-1 * window.all_meta_dataset[window.showing_index]['down'][i])
        }
        const data_ind = {
            labels: ["0-5", "5-10", "10-15", "15-20", "20-25", "25-30", "30-35",
                    "35-40", "40-45", "45-50", "50-55", "55-60", "60-65", "65-70", "70-75",
                    "75-80", "80-85", "85-90", "90-95", "95-100"],
            datasets: [{
                label: 'Up Regulated',
                data: window.all_meta_dataset[window.showing_index]['up'],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)',
                ],
                borderWidth: 1
            }, {
                label: 'Down Regulated',
                data: negative_data,
                backgroundColor: [
                    'rgba(0, 0, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)',
                ],
                borderWidth: 1
            }]
        };

        const config_ind = {
            type: 'bar',
            data: data_ind,
            options: {
                plugins: {
                    tooltip: {
                        enabled: false // <-- this option disables tooltips
                      },
                    
                    title: {
                        display: true,
                        text: 'Regulation Percentile for Gene ' + window.all_meta_dataset[window.showing_index].gene_name
                    }
                },
                scales: {

                y: {
                    beginAtZero: true,
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, ticks) {
                            return Math.abs(value);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Number of comparisons that fit the cutoff'
                      }
                },
                x: {
                    ticks: {
                        autoSkip: false
                    }
                }


                }
            }
        };

        // render init block
        const myChart_ind = new Chart(
            document.getElementById('myChart-meta-ind'),
            config_ind
        );

        prepare_download_file();

        

        // processing tooltip
        $('#processtip3').html(`<div id='processtip3' style='margin-left: 10px; margin-top: 7px;'></div>`)


    }
    $('#submit3').click(function (e) {
        e.preventDefault();
        document.getElementById("processtip3").innerHTML = "<span class='ld ld-ring ld-spin'></span>"

        Chart.helpers.each(Chart.instances, function(instance){
            instance.destroy();
        });
        document.getElementById("meta_results_id").classList.add("hidden");
        document.getElementById("prevnextbutton").classList.add("hidden");
        document.getElementById("prev_btn").classList.add("hidden");
        document.getElementById("next_btn").classList.add("hidden");

        
        document.getElementById("download_meta").classList.add("hidden");
        document.getElementById("download_meta").innerHTML = `<span class='ld ld-ring ld-spin' style='font-size:26px; color: gray'></span>`

        
        document.getElementById("myChart-meta").innerText = "";
        $('#myChart-meta-div').html(`<div id="myChart-meta-div">
        <canvas id="myChart-meta" width="500" height="350"></canvas>
      </div>`)

        var top_percent = $('#fname3').val();
        var upordown = $('#fname4').val();
        var disply_percent = $('#fname5').val();
        console.log(top_percent, upordown, disply_percent)

        // filtering
        var filter_results = getWindowFilter();

        var celllines = filter_results[0];
        var durations = filter_results[1];
        var doses = filter_results[2];


        // var celllines = ""
        // for (i in window.focus_set['cellline']) {
        //     var cell_i = $('#' + window.focus_set['cellline'][i]).html()
        //     celllines += cell_i
        //     celllines += ";"
        // }

        // var durations = ""
        // for (i in window.focus_set['duration']) {
        //     var cell_i = $('#' + window.focus_set['duration'][i]).html()
        //     durations += cell_i
        //     durations += ";"
        // }

        // var doses = ""
        // for (i in window.focus_set['dose']) {
        //     var cell_i = $('#' + window.focus_set['dose'][i]).html()
        //     doses += cell_i
        //     doses += ";"
        // }

        console.log(celllines)
        console.log(durations)
        console.log(doses)
        console.log("HHHHHHHHHHH")
        $.getJSON("/tools/get_meta_stats/", {
            celllines: celllines,
            durations: durations,
            doses: doses,
            top_percent: top_percent,
            upordown: upordown,
            disply_percent: disply_percent
        }).done(function (processResult) {
            process_submit3(processResult);
            
        }).failed(function (){
            $('#processtip1').html('<p>Server timeout, please <a id="refresher" onclick="location.reload()"><i>refresh</i><i class="fas fa-redo-alt ml-1"></i></a></p>');
        });
    });




    $('#submit1').click(function (e) {
        e.preventDefault();
        document.getElementById("post_table_1").classList.add("hidden");


        var start_time = Date.now();
        //e.stopPropagation();
        console.log(start_time, );

        document.getElementById("processtip1").innerHTML = "<span class='ld ld-ring ld-spin'></span>"

        // ajax call
        var up_percent = $('#fname1').val();
        var logfc = $('#fname1_1').val();
        var adj_p_value = $('#fname1_2').val();
        console.log("adj_p_value " + adj_p_value)

        var celllines = ""
        for (i in window.focus_set['cellline']) {
            var cell_i = $('#' + window.focus_set['cellline'][i]).html()
            celllines += cell_i
            celllines += ";"
        }

        var durations = ""
        for (i in window.focus_set['duration']) {
            var cell_i = $('#' + window.focus_set['duration'][i]).html()
            durations += cell_i
            durations += ";"
        }

        var doses = ""
        for (i in window.focus_set['dose']) {
            var cell_i = $('#' + window.focus_set['dose'][i]).html()
            doses += cell_i
            doses += ";"
        }

        // var cellline = $('#ss_elem_SKBR3').html();
        console.log("cellline" + celllines);

        $.getJSON("/tools/get_stats/", {
            celllines: celllines,
            durations: durations,
            doses: doses,
            adj_p_value: adj_p_value,
            logfc: logfc,
            up_percent: up_percent.toString(),
            down_percent: "-1"
        }).done(function(processResult) {
            stats_process_result(processResult, 'up');

        }).fail(
            function () {
                $('#processtip1').html('<p>Server timeout, please <a id="refresher" onclick="location.reload()"><i>refresh</i><i class="fas fa-redo-alt ml-1"></i></a></p>');

            }
        );
    });

    $('#submit2').click(function (e) {
        e.preventDefault();
        document.getElementById("post_table_2").classList.add("hidden");
        var start_time = Date.now();
        //e.stopPropagation();
        console.log(start_time, );

        document.getElementById("processtip2").innerHTML = "<span class='ld ld-ring ld-spin'></span>"

        // ajax call
        var down_percent = $('#fname2').val();
        var logfc = $('#fname2_1').val();
        var adj_p_value = $('#fname2_2').val();
        console.log("adj_p_value " + adj_p_value)

        var celllines = ""
        for (i in window.focus_set['cellline']) {
            var cell_i = $('#' + window.focus_set['cellline'][i]).html()
            celllines += cell_i
            celllines += ";"
        }

        var durations = ""
        for (i in window.focus_set['duration']) {
            var cell_i = $('#' + window.focus_set['duration'][i]).html()
            durations += cell_i
            durations += ";"
        }

        var doses = ""
        for (i in window.focus_set['dose']) {
            var cell_i = $('#' + window.focus_set['dose'][i]).html()
            doses += cell_i
            doses += ";"
        }

        // var cellline = $('#ss_elem_SKBR3').html();
        console.log("cellline" + celllines);

        $.getJSON("/tools/get_stats/", {
            celllines: celllines,
            durations: durations,
            doses: doses,
            adj_p_value: adj_p_value,
            logfc: logfc,
            up_percent: "-1",
            down_percent: down_percent.toString(),
        }).done(function(processResult) {
            stats_process_result(processResult, 'down');

        }).fail(
            function () {
                $('#processtip2').html('<p>Server timeout, please <a id="refresher" onclick="location.reload()"><i>refresh</i><i class="fas fa-redo-alt ml-1"></i></a></p>');

            }
        );
    });

    function stats_process_result (processResult, mode) {

        if (mode == 'up') {
            var id_mode = 1
        } else {
            var id_mode = 2
        }
        document.getElementById(`post_table_${id_mode}`).classList.remove("hidden");
        $(`#processtip${id_mode}`).html(`<div id='processtip${id_mode}' style='margin-left: 10px; margin-top: 7px;'></div>`)

        console.log("processResult")
        console.log(processResult)


        var microarray_response_num = processResult[0].length
        console.log("microarray_response_num " + microarray_response_num)
        $(`#num_genes_${id_mode}`).html(`<div id="num_genes_${id_mode}" style="padding-bottom: 1em;"><b>MicroArray: </b>Got <u>${microarray_response_num}</u> Significant Genes
        (only show top 50 genes, click <a id='export_${id_mode}' color="black" download="" href="#"><u><span style="color:red">here</u></span></a> to export all significants)
        <br>
        <u>Note:</u> For data sets with replicates, we consider both Adjusted P-Value and Log Fold Change; for datasets without replicates, we only consider Log Fold Change.
        </div>`)
        // Convert to microarray data
        var str_micro = "GeneName\tNumOfData\tSignifiLogFCPercent\n"
        var microarray_table_html = `<table id="microarray_table_up_${id_mode}">
        <thead>
          <tr>
            <th scope="col">GeneName</th>
            <th scope="col">Num. of Data</th>
            <th scope="col">Significant LogFC Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
        `;
        var data_plot_micro_sign = []
        var data_plot_micro_non_sign = []
        var highest = 0
        for (i in processResult[0]) {
            if (i == 3) {
                microarray_table_html += `<tr  class="header${id_mode}">
                    <th colspan="3">Show the rest results <span>+</span></th>
                    </tr>`
            }
            var ins_count = processResult[0][i].ins_count;
            var genename = processResult[0][i].genename;
            var logfc_percent =  processResult[0][i].logfc_percent

            microarray_table_html += `
                <tr>
                    <th scope="row">${genename}</th>
                    <td>${ins_count}</td>
                    <td>${logfc_percent}</td>
                </tr>
            `
            str_micro += `${genename}\t${ins_count}\t${logfc_percent}\n`

            var sign_count_i = Math.round(parseFloat(processResult[0][i].logfc_percent) / 100 * processResult[0][i].ins_count);
            var non_sign_count_i = processResult[0][i].ins_count - sign_count_i;

            if (data_plot_micro_sign.length < 50) {
                data_plot_micro_sign.push({
                    x: processResult[0][i].genename,
                    y: sign_count_i,
                });

                data_plot_micro_non_sign.push({
                    x: processResult[0][i].genename,
                    y: non_sign_count_i,
                });

                if (highest < (sign_count_i + non_sign_count_i)) {
                    highest = sign_count_i + non_sign_count_i
                }
            }
        }


        microarray_table_html += `
                </tbody>
            </table>
        `
        $(`#microarray_table_up_${id_mode}`).html(microarray_table_html);

        // MicroArray - plot
        var data_plot_micro = [
            {
                name: 'Altered',
                values: data_plot_micro_sign
            },
            {
                name: 'Unaltered',
                values: data_plot_micro_non_sign
            }
        ]

        drawStackPlot(data_plot_micro, mode, 'micro', highest);


        // RNA-seq //
        var rna_response_num = processResult[1].length
        console.log("rna_response_num " + rna_response_num)
        $(`#num_genes_${id_mode}_rna`).html(`<div id="num_genes_${id_mode}_rna" style="padding-bottom: 1em;"><b>RNA-seq: </b>Got <u>${rna_response_num}</u> Significant Genes (only show top 50 genes, click <a id='export_${id_mode}_rna' download="" href="#"><u><span style="color:red">here</u></span></u></a> to export all significants)
        <br>
        <u>Note:</u> For data sets with replicates, we consider both Adjusted P-Value and Log Fold Change; for datasets without replicates, we only consider Log Fold Change.
        </div>
        `)
        var str_rna = "GeneName\tNumOfData\tSignifiLogFCPercent\n"
        var rnaseq_table_html = `<table id="rnaseq_table_up_${id_mode}">
        <thead>
          <tr>
            <th scope="col">GeneName</th>
            <th scope="col">Num. of Data</th>
            <th scope="col">Significant LogFC Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
        `;

        var data_plot_rnaseq_sign = []
        var data_plot_rnaseq_non_sign = []
        var highest = 0;
        for (i in processResult[1]) {
            if (i == 3) {
                rnaseq_table_html += `<tr  class="header${id_mode}">
                    <th colspan="3">Show the rest results <span>+</span></th>
                    </tr>`
            }
            var ins_count = processResult[1][i].ins_count;
            var genename = processResult[1][i].genename;
            var logfc_percent =  processResult[1][i].logfc_percent

            rnaseq_table_html += `
                <tr>
                    <th scope="row">${genename}</th>
                    <td>${ins_count}</td>
                    <td>${logfc_percent}</td>
                </tr>
            `
            str_rna += `${genename}\t${ins_count}\t${logfc_percent}\n`

            var sign_count_i = Math.round(parseFloat(processResult[1][i].logfc_percent) / 100 * processResult[1][i].ins_count);
            var non_sign_count_i = processResult[1][i].ins_count - sign_count_i;

            if (data_plot_rnaseq_sign.length < 50) {
                data_plot_rnaseq_sign.push({
                    x: processResult[1][i].genename,
                    y: sign_count_i,
                });

                data_plot_rnaseq_non_sign.push({
                    x: processResult[1][i].genename,
                    y: non_sign_count_i,
                });

                if (highest < (sign_count_i + non_sign_count_i)) {
                    highest = sign_count_i + non_sign_count_i
                }
            }
        }

        rnaseq_table_html += `
                </tbody>
            </table>
        `
        $(`#rnaseq_table_up_${id_mode}`).html(rnaseq_table_html)

        $(`tr.header${id_mode}`).nextUntil(`tr.header${id_mode}`).slideToggle(100);
        $(`tr.header${id_mode}`).click(function(){
            $(this).find('span').text(function(_, value){return value=='-'?'+':'-'});
            $(this).nextUntil(`tr.header${id_mode}`).slideToggle(100, function(){
            });
        });

        // RNA-seq - plot
        var data_plot_rnaseq = [
            {
                name: 'Altered',
                values: data_plot_rnaseq_sign
            },
            {
                name: 'Unaltered',
                values: data_plot_rnaseq_non_sign
            }
        ]

        drawStackPlot(data_plot_rnaseq, mode, 'rnaseq', highest);


        // download
        createDownloadLink(`#export_${id_mode}_rna`,str_rna,"RNA-seq-genelist.txt");
        createDownloadLink(`#export_${id_mode}`,str_micro,"MicroArray-genelist.txt");
    };


    // main
    window.preload = JSON.parse(window.preload)
    process_submit3(window.preload)



});
