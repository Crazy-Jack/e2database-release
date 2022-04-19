// import calculateDatasetStats from '/static/tools/js/select.js';

$(document).ready(function () {
    window.click_once = false;


    $('.demo').tipso({
        // OPTIONS
        background  :'#333333',
        size: 'small',
        titleBackground   : '#f70c0c',
        titleContent: 'Hello',
        position: 'top-right',

    });


    const button = document.querySelector('button');

    $('#button').click(function (e) {
        e.preventDefault();
        $('#fname').html('GREB1');
    });
    function fillCanvasBackgroundWithColor(canvas, color) {
        // Get the 2D drawing context from the provided canvas.
        const context = canvas.getContext('2d');
      
        // We're going to modify the context state, so it's
        // good practice to save the current state first.
        context.save();
      
        // Normally when you draw on a canvas, the new drawing
        // covers up any previous drawing it overlaps. This is
        // because the default `globalCompositeOperation` is
        // 'source-over'. By changing this to 'destination-over',
        // our new drawing goes behind the existing drawing. This
        // is desirable so we can fill the background, while leaving
        // the chart and any other existing drawing intact.
        // Learn more about `globalCompositeOperation` here:
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
        context.globalCompositeOperation = 'destination-over';
      
        // Fill in the background. We do this by drawing a rectangle
        // filling the entire canvas, using the provided color.
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
      
        // Restore the original context state from `context.save()`
        context.restore();
    }

    function process_local_result (raw_data) {
        return raw_data;
    }
    function display_box (mydatasets_chipseq) {

        
        boxplot_chipseq_canvas_height = 300;
        document.getElementById('boxplot_chipseq_canvas').setAttribute("style","height:" + boxplot_chipseq_canvas_height + "px");

        var data_boxplotData = Array(4).fill([]);


        var boxlabel = [];
        for (var i in mydatasets_chipseq) {
            boxlabel.push(mydatasets_chipseq[i].label);


            var dosecount = Array(4).fill(0);
            for (var j in mydatasets_chipseq[i].data) {
                var dataij = mydatasets_chipseq[i].data[j];
                var dose = dataij.dose;
                if (dataij.multi_duration) {
                    dosecount[3] += 1;
                } else if (dose <= 1) {
                    dosecount[0] += 1;
                } else if (dose <= 100) {
                    dosecount[1] += 1;
                } else if (dose <= 1000) {
                    dosecount[2] += 1;
                }
            }
            data_boxplotData[i] = dosecount;
        }
        var colors_boxplot = [];
        for (var i in mydatasets_chipseq) {
            colors_boxplot.push(mydatasets_chipseq[i].backgroundColor)
        }

        //console.log("boxplot")
        //console.log(data_boxplotData)

        var boxplotData = {
            // define label tree
            labels: boxlabel,
            datasets: [{
                label: boxlabel,
                backgroundColor: "white",
                borderColor: colors_boxplot,
                borderWidth: 2,
                outlierColor: colors_boxplot,
                padding: 0,
                itemRadius: [0, 1, 2, 3],
                data: data_boxplotData,
            }]
        };

        var canva5 = document.getElementById("myChart_chipseq_datasetdetail");
        var ctx5 = canva5.getContext('2d');
        var chartbox = new Chart(ctx5, {
            type: 'boxplot',
            data: boxplotData,
            options: {
            maintainAspectRatio: false,

            // title: {
            //     display: true,
            //     text: 'Chart.js Box Plot Chart'
            // },
            tooltips: {enabled: false},
            hover: {mode: null},
            plugins: {
                legend: {
                    display: false,

                },
                title: {
                    display: true,
                    align: "center",
                    text: '           ER binding sites counts by data sets',
                    padding: {
                        top: 20,
                        bottom: 20,
                    },
                   
                    }
                },
                tooltips: {
                    callbacks: {
                    label: function(tooltipItem) {
                            return "";
                    }
                    },
                    showTooltips: false,

                }
            ,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Dataset'
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Peak Counts'
                    },
                    
                }
            

            },
            }
        });

    };

    

    // ===================== Submit ===============
    $('#submit').click(function (e) {
        e.preventDefault();
        var start_time = Date.now();
        //e.stopPropagation();

        // //console.log($('#fname').val());

        document.getElementById("processtip").innerHTML = "<span class='ld ld-ring ld-spin'></span>"

            var gene_name = $('#fname').val();
            if (window.click_once) {
                resetPage();
            }
            $.getJSON("/tools/search", {
                'gene_name': gene_name
            }).done(function(processResult) {
                console.log(processResult)
                return main_process_result(processResult);
            }).fail(
                function () {
                    $('#processtip').html('<p>Server timeout, please <a id="refresher" onclick="location.reload()"><i>refresh</i><i class="fas fa-redo-alt ml-1"></i></a></p>');
                    $('#aftersubmit').html('<p>Gene within the same clusters: <a href="/tools/">link text</a></p>')
                    $('#myChart').html('<canvas id="myChart"></canvas>');
                }
            );

    })


    function main_process_result (processResult){
        // //console.log("I'm done loading data")
        console.log(processResult)
        var start_time = Date.now();
        var mydatasets = [];
        //console.log("Network response " + (Date.now() - start_time)/1000 + " s")
        document.getElementById("processtip").innerHTML = "";
        window.click_once = true;

        // //console.log(processResult);
        console.log("=============")
        processResult = process_local_result(processResult);
        // $('#myChart').html("<canvas id='myChart'></canvas>")
        // //console.log(processResult);
        // for microArray
        var stats1 = processResult[2];
        var stats2 = processResult[3];

        var canvas = document.getElementById("myChart");
        var ctx = canvas.getContext('2d');
        
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Define the data

        // Add data values to array

        var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#53FA04', '#00B3E6',
                        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];



            data = processResult[0];
            //console.log("data" + processResult)
            //console.log("mydataset processing start time " + Date.now())
            mydatasets = [];
            var count = 0
            var max_len = 0
            for (var i in data) {
                var item_radius = [];
                var pointstyles = [];
                var fills = [];
                for (var k=0; k < data[i].length; k ++) {
                    item_radius.push(data[i][k].duration * 2);
                    // get dose
                    var dose_k = data[i][k].dose;
                    if (dose_k == 1) {
                        var pointstyle = 'circle';
                    } else if (dose_k == 10) {
                        var pointstyle = 'triangle';
                    } else if (dose_k == 1000) {
                        var pointstyle = 'rect';
                    }

                    pointstyles.push(pointstyle);

                    fills.push(data[i][k].multi_duration)
                }
                var item = {
                    radius: item_radius,
                    label: i,
                    data: data[i],
                    borderColor: colorArray[count],
                    backgroundColor: colorArray[count],
                    pointStyle: pointstyles,
                    fill: fills
                }
                mydatasets.push(item);
                count += 1;
                // max data len
                if (data[i].length > max_len) {
                    max_len = data[i].length;
                }
            };
            //console.log(mydatasets)
            console.log("====2=========")
            // sort
            mydatasets.sort((a, b) => (a.data.length < b.data.length) ? 1 : -1);
            window.mydatasets = mydatasets;

            // reset
            document.getElementById("legend_container").innerText = "";
            document.getElementById("duration_container").innerText = "";
            document.getElementById("legend_stats").innerText = "";
            document.getElementById("aftersubmit1").innerText = "";

            document.getElementById("legend_container_rna").innerText = "";
            document.getElementById("duration_container_rna").innerText = "";
            document.getElementById("legend_stats_rna").innerText = "";
            document.getElementById("myChart_rna").innerText = "";
            document.getElementById("aftersubmit2").innerText = "";

            document.getElementById("legend_container_chipseq").innerText = "";
            document.getElementById("duration_container_chipseq").innerText = "";
            document.getElementById("legend_stats_chipseq").innerText = "";
            document.getElementById("aftersubmit3").innerText = "";


            

            if (mydatasets.length == 0) {
                // // //console.log("len 0");

                document.getElementById("aftersubmit1").innerHTML = "Gene " + $('#fname').val() + " Not found in MicroArray database..."
            }
            else {
                // //console.log("mydataset len > 0")
                var colorList = mydatasets;
                colorize = function(colorList, stats) {
                    var container = document.getElementById('legend_container');
                    // //console.log(colorList)
                    for (var item in colorList) {
                        // //console.log(item);
                        var boxContainer = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        // dataset len

                        label.innerHTML = colorList[item]['label'] + "                                ";
                        box.className = "box";
                        box.style.backgroundColor = colorList[item]['backgroundColor'];
                        box.style.borderColor = colorList[item]['borderColor'];
                        box.style.textIndent = '20em';


                        boxContainer.className = "box-contain";
                        label.className = "label";
                        boxContainer.appendChild(box);
                        boxContainer.appendChild(label);

                        container.appendChild(boxContainer);

                    }

                    var container = document.getElementById('legend_stats');

                    for (var item in colorList) {
                        // // //console.log(item);
                        var boxContainer = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        // dataset len
                        var gene_name = colorList[item]['label']
                        var tooltip_stats = " up " + Math.round(stats[gene_name][1]*100) +"% ; down: " + Math.round(stats[gene_name][0]*100) + "% "
                        label.innerHTML =  "<span class='tooltips_my' title='hello' data-tipso='" + tooltip_stats + "'>" + colorList[item]['data'].length + "</span>";

                        var explain_text = "Taken significant p-value as 0.05, percentage of up/down regulated experiments are shown for each cell line when hover on the left number"
                        if (item == 0) {
                            label.innerHTML +="&nbsp;&nbsp;<span class='tooltips_info' title='hello' data-tipso='" + explain_text + "'><i class='fas fa-question-circle'></i></span>"
                        }
                        box.className = "box";
                        box.style.backgroundColor = colorList[item]['backgroundColor'];
                        box.style.borderColor = colorList[item]['borderColor'];
                        box.style.textIndent = '20em';
                        var width = Math.round(colorList[item]['data'].length / max_len * 120);
                        box.style.width = width+"px";

                        boxContainer.className = "stats-contain";
                        label.className = "label";
                        boxContainer.appendChild(box);
                        boxContainer.appendChild(label);

                        container.appendChild(boxContainer);

                    }


                }

                colorize(colorList, stats1);


                // =========================================================
                // duration container
                // var colorList_dose = {'1h': "10px", '2h': "10px", '3h': "30%", '4h': "40%",
                //                     '6h': 0.5, '8h': 0.6, '12h': 0.7, '16h': 0.8, '18h': 0.9, '24h': 0.95, '48h': 1};
                colorList_duration = [1, 2, 3, 4, 6, 8, 12, 16, 18, 24, 48];
                colorList_dose = [1, 10, 1000];
                colorize_duration = function(colorList, colorList_dose) {
                    var container = document.getElementById('duration_container');

                    for (var item in colorList) {
                        // // //console.log(item);
                        // // //console.log(colorList[item]);
                        var boxContainer2 = document.createElement("DIV");
                        var boxContainer = document.createElement("DIV");
                        var boxContainer_t = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        label.innerHTML = colorList[item] + " h  ";
                        box.className = "circle";
                        var size = Math.log10(colorList[item] + 1) * 10;
                        box.style.height = size + "px";
                        box.style.width = size + "px";

                        box.style.textIndent = '20em';

                        boxContainer2.className = "box-contain";
                        boxContainer.className = "circle-contain";
                        boxContainer_t.className = "label-contain";
                        label.className = "label";
                        boxContainer.appendChild(box);

                        boxContainer2.appendChild(boxContainer);

                        boxContainer_t.appendChild(label)
                        boxContainer2.appendChild(boxContainer_t);

                        container.appendChild(boxContainer2);

                    }

                    for (var item in colorList_dose) {
                        var boxContainer2 = document.createElement("DIV");
                        var boxContainer = document.createElement("DIV");
                        var boxContainer_t = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        if (colorList_dose[item] == 1) {
                            var dose = '1 nM';
                            var shape = 'circle';
                        } else if (colorList_dose[item] == 10) {
                            var dose = '10 nM';
                            var shape = 'triangle';
                        } else if (colorList_dose[item] == 1000) {
                            var dose = '1000 nM';
                            var shape = 'box';
                        }
                        label.innerHTML = dose;
                        box.className = shape;
                        if (shape == 'box' || shape == 'circle') {
                            var size = Math.log10(24 + 1) * 14;
                            box.style.height = size + "px";
                            box.style.width = size + "px";
                            box.style.textIndent = '20em';
                            box.style.backgroundColor = "#FA1304";
                            box.style.borderColor = "#FA1304";
                        }





                        boxContainer2.className = "box-contain";
                        boxContainer.className = "circle-contain";
                        boxContainer_t.className = "label-contain";
                        boxContainer2.style.width = "120px";
                        label.className = "label";
                        boxContainer.appendChild(box);

                        boxContainer2.appendChild(boxContainer);

                        boxContainer_t.appendChild(label)
                        boxContainer2.appendChild(boxContainer_t);

                        container.appendChild(boxContainer2);
                    }
                }

                colorize_duration(colorList_duration, colorList_dose);


                // =========================================================
                // Define Chart
                

                // //console.log(mydatasets)
                var myChart1 = new Chart(ctx, {
                    type: 'ScatterWithLine',
                    data: {
                        datasets: mydatasets
                    },
                    options: {
                        // responsive: true,
                        // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                        legend: {
                            display: false
                         },
                        parsing: {
                            xAxisKey: 'logfc',
                            yAxisKey: 'logp',
                        },
                        'onClick' : function (evt, item) {
                            // //console.log ('legend onClick', evt);
                            // //console.log('legd item', item);
                            var dataset_index = item['0']['datasetIndex']
                            var innerIndex = item['0']['index'];
                            // //console.log(dataset_index)
                            // //console.log(innerIndex);
                            var GSE = mydatasets[dataset_index]['data'][innerIndex]['GSE'];
                            // //console.log(GSE);
                            var myurl = "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc="+GSE;
                            // //console.log(myurl);
                            window.open(
                                myurl, "_blank");
                        },

                        // animation: {
                        //     onComplete: function() {
                        //         var a = document.createElement('a');
                        //         a.href = myChart1.toBase64Image();
                        //         a.download = 'my_file_name.png';
                                
                        //         // Trigger the download
                        //         a.click();
                        //     }
                        //   },
                        


                    plugins: {
                        legend: {
                            position: 'right',
                            display: false
                        },
                        // title: {
                        //     display: true,
                        //     text: 'MicroArray Analysis ' ,
                        // },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    var dur = Math.round(Math.exp(context.raw.duration) - 1);
                                    return context.raw.name + ': Duration: ' + dur + ' H ; logfc: ' + Number.parseFloat(context.raw.logfc).toPrecision(2) + '; '
                                           + '-log adj p value: ' + Number.parseFloat(context.raw.logp).toPrecision(2)
                                },

                            }
                        }
                        },
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: '- Log Adjusted p value'
                                },
                                ticks: {
                                    // Include a dollar sign in the ticks
                                    callback: function(value, index, values) {
                                        return '' + value;
                                    }
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Log2 fold change (E2/Control)'
                                },
                                ticks: {
                                    // Include a dollar sign in the ticks
                                    callback: function(value, index, values) {
                                        return '' + value;
                                    }
                                }
                            }
                        }
                    },
                }); // ERAL1 DNM3
                

            
                //Download Chart Image
                // document.getElementById("download1").addEventListener('click', function(){
                //     /*Get image of canvas element*/
                //     var canvas = document.getElementById("myChart");
                //     fillCanvasBackgroundWithColor(canvas, 'white');
                //     var url_base64jp = canvas.toDataURL("image/jpg");
                //     /*get download button (tag: <a></a>) */
                //     var a =  document.getElementById("download1");
                //     /*insert chart image url to download button (tag: <a></a>) */
                //     a.href = url_base64jp;
                //     a.download = $('#fname').val() + "-microarray.jpg";
                // });
                document.getElementById("download1").addEventListener('click', function(e){
                    /*Get image of canvas element*/
                    // e.preventDefault()
                    var canvas = document.getElementById("myChart");
                    fillCanvasBackgroundWithColor(canvas, 'white');
                    var url_base64jp = canvas.toDataURL("image/jpg");
                    /*get download button (tag: <a></a>) */
                    var a =  document.getElementById("download1");
                    /*insert chart image url to download button (tag: <a></a>) */
                    a.href = url_base64jp;
                    a.download = $('#fname').val() + "-microarray.jpg";

                    
                });
                console.log("---------check3------------")

                



                document.getElementById("chart1-title-id").innerHTML = "<span><h3>MicroArray Analysis</h3></span></br><span>" + calculateDatasetStats(mydatasets, 0.5)+"</span>";
                //console.log("microarray processing end time " + Date.now())
            }


        // ////////////////////////////////////////////
        // RNA seq
        var canvas = document.getElementById("myChart_rna");
        var ctx2 = canvas.getContext('2d');

        data = processResult[1];
        mydatasets_rna = [];
        var count = 0
        var max_len = 0
        for (var i in data) {
            var item_radius = [];
            var pointstyles = [];
            for (var k=0; k < data[i].length; k ++) {
                item_radius.push(data[i][k].duration * 2);
                // get dose
                var dose_k = data[i][k].dose;
                if (dose_k == 1) {
                    var pointstyle = 'circle';
                } else if (dose_k == 10) {
                    var pointstyle = 'triangle';
                } else if (dose_k == 1000) {
                    var pointstyle = 'square';
                }

                pointstyles.push(pointstyle)
                fills.push(data[i][k].multi_duration)
            }
            var item = {
                radius: item_radius,
                label: i,
                data: data[i],
                borderColor: colorArray[count],
                backgroundColor: colorArray[count],
                pointStyle: pointstyles,
                showLine: fills
            }
            mydatasets_rna.push(item);
            count += 1;
            // max data len
            if (data[i].length > max_len) {
                max_len = data[i].length;
            }
        };
        mydatasets_rna.sort((a, b) => (a.data.length < b.data.length) ? 1 : -1);
        window.mydatasets_rna = mydatasets_rna;
            // //console.log(mydatasets_rna.length)
            if (mydatasets_rna.length == 0) {
                // //console.log("len 0");

                    document.getElementById("aftersubmit2").innerHTML = "Gene " + $('#fname').val() + " Not found in RNA-seq database..."

            }
            else {

                // //console.log(mydatasets_rna);
                // clear clf
                $('#legend_container_rna').html("<div id='legend_container_rna'></div>");
                $('#duration_container_rna').html("<div id='duration_container_rna'></div>");
                // =========================================================
                // create legends
                // var colorList = [{'backgroundColor': '#FF6633', 'borderColor': '#FF6633', 'label': 'MCF7'},
                //                 {'backgroundColor': '#FFB399', 'borderColor': '#FFB399', 'label': 'MM231'}]
                // {t1: 'red', t2: 'green', t3: 'blue'};
                var colorList = mydatasets_rna;
                colorize = function(colorList, stats) {
                    var container = document.getElementById('legend_container_rna');

                    for (var item in colorList) {
                        // //console.log(item);
                        var boxContainer = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        // dataset len

                        label.innerHTML = colorList[item]['label'] + "                                ";
                        box.className = "box";
                        box.style.backgroundColor = colorList[item]['backgroundColor'];
                        box.style.borderColor = colorList[item]['borderColor'];
                        box.style.textIndent = '20em';


                        boxContainer.className = "box-contain";
                        label.className = "label";
                        boxContainer.appendChild(box);
                        boxContainer.appendChild(label);

                        container.appendChild(boxContainer);

                    }

                    var container = document.getElementById('legend_stats_rna');

                    for (var item in colorList) {
                        // //console.log(item);
                        var boxContainer = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        // dataset len
                        var gene_name = colorList[item]['label']
                        var tooltip_stats = " up " + Math.round(stats[gene_name][1]*100)+"% ; down: " + Math.round(stats[gene_name][0]*100) + "% "
                        label.innerHTML =  "<span class='tooltips_my' title='hello' data-tipso='" + tooltip_stats + "'>" + colorList[item]['data'].length + "</span>";

                        var explain_text = "Taken significant p-value as 0.05, percentage of up/down regulated experiments are shown for each cell line when hover on the left number"
                        if (item == 0) {
                            label.innerHTML +="&nbsp;&nbsp;<span class='tooltips_info' title='hello' data-tipso='" + explain_text + "'><i class='fas fa-question-circle'></i></span>"
                        }

                        box.className = "box";
                        box.style.backgroundColor = colorList[item]['backgroundColor'];
                        box.style.borderColor = colorList[item]['borderColor'];
                        box.style.textIndent = '20em';
                        var width = Math.round(colorList[item]['data'].length / max_len * 120);
                        box.style.width = width+"px";

                        boxContainer.className = "stats-contain";
                        label.className = "label";
                        boxContainer.appendChild(box);
                        boxContainer.appendChild(label);

                        container.appendChild(boxContainer);

                    }


                }

                colorize(colorList, stats2);


                // =========================================================
                // duration container
                // var colorList_dose = {'1h': "10px", '2h': "10px", '3h': "30%", '4h': "40%",
                //                     '6h': 0.5, '8h': 0.6, '12h': 0.7, '16h': 0.8, '18h': 0.9, '24h': 0.95, '48h': 1};
                colorList_duration = [1, 2, 3, 4, 6, 8, 12, 16, 18, 24, 48];
                colorList_dose = [1, 10, 1000];
                colorize_duration = function(colorList, colorList_dose) {
                    var container = document.getElementById('duration_container_rna');

                    for (var item in colorList) {
                        // // //console.log(item);
                        // // //console.log(colorList[item]);
                        var boxContainer2 = document.createElement("DIV");
                        var boxContainer = document.createElement("DIV");
                        var boxContainer_t = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        label.innerHTML = colorList[item] + " h  ";
                        box.className = "circle";
                        var size = Math.log10(colorList[item] + 1) * 10;
                        box.style.height = size + "px";
                        box.style.width = size + "px";

                        box.style.textIndent = '20em';

                        boxContainer2.className = "box-contain";
                        boxContainer.className = "circle-contain";
                        boxContainer_t.className = "label-contain";
                        label.className = "label";
                        boxContainer.appendChild(box);

                        boxContainer2.appendChild(boxContainer);

                        boxContainer_t.appendChild(label)
                        boxContainer2.appendChild(boxContainer_t);

                        container.appendChild(boxContainer2);

                    }

                    for (var item in colorList_dose) {
                        var boxContainer2 = document.createElement("DIV");
                        var boxContainer = document.createElement("DIV");
                        var boxContainer_t = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");

                        if (colorList_dose[item] == 1) {
                            var dose = '1 nM';
                            var shape = 'circle';
                        } else if (colorList_dose[item] == 10) {
                            var dose = '10 nM';
                            var shape = 'triangle';
                        } else if (colorList_dose[item] == 1000) {
                            var dose = '1000 nM';
                            var shape = 'box';
                        }
                        label.innerHTML = dose;
                        box.className = shape;
                        if (shape == 'box' || shape == 'circle') {
                            var size = Math.log10(24 + 1) * 14;
                            box.style.height = size + "px";
                            box.style.width = size + "px";
                            box.style.textIndent = '20em';
                            box.style.backgroundColor = "#FA1304";
                            box.style.borderColor = "#FA1304";
                        }





                        boxContainer2.className = "box-contain";
                        boxContainer.className = "circle-contain";
                        boxContainer_t.className = "label-contain";
                        boxContainer2.style.width = "120px";
                        label.className = "label";
                        boxContainer.appendChild(box);

                        boxContainer2.appendChild(boxContainer);

                        boxContainer_t.appendChild(label)
                        boxContainer2.appendChild(boxContainer_t);

                        container.appendChild(boxContainer2);
                    }
                }

                colorize_duration(colorList_duration, colorList_dose);


                // =========================================================
                // Define Chart
                
                var myChart2 = new Chart(ctx2, {
                    type: 'ScatterWithLine',
                    data: {
                        datasets: mydatasets_rna
                    },
                    options: {
                        // responsive: true,
                        // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                        legend: {
                            display: false
                         },
                        parsing: {
                            xAxisKey: 'logfc',
                            yAxisKey: 'logp',
                        },
                        'onClick' : function (evt, item) {
                            // //console.log ('legend onClick', evt);
                            // //console.log('legd item', item);
                            var dataset_index = item['0']['datasetIndex']
                            var innerIndex = item['0']['index'];
                            // //console.log(dataset_index)
                            // //console.log(innerIndex);
                            var GSE = mydatasets_rna[dataset_index]['data'][innerIndex]['GSE'];
                            // //console.log(GSE);
                            var myurl = "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc="+GSE;
                            // //console.log(myurl);
                            window.open(
                                myurl, "_blank");
                        },


                    plugins: {
                        legend: {
                            position: 'right',
                            display: false
                        },
                        // title: {
                        //     display: true,
                        //     text: 'RNA-seq Analysis ' + mydatasets_rna.length
                        // },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    var dur = Math.round(Math.exp(context.raw.duration) - 1);
                                    if (context.raw.multi_duration) {
                                        var dur = 'Multiple/Missing';
                                    }
                                    return context.raw.name + ': Duration: ' + dur + ' H ; logfc: ' + Number.parseFloat(context.raw.logfc).toPrecision(2) + '; '
                                           + '-log adj p value: ' + Number.parseFloat(context.raw.logp).toPrecision(2)
                                },

                            }
                        }
                        },
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: '- Log Adjusted p value'
                                },
                                ticks: {
                                    // Include a dollar sign in the ticks
                                    callback: function(value, index, values) {
                                        return '' + value;
                                    }
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Log2 fold change (E2/Control)'
                                },
                                ticks: {
                                    // Include a dollar sign in the ticks
                                    callback: function(value, index, values) {
                                        return '' + value;
                                    }
                                }
                            }
                        }
                    },
                }); // END of RNAseq
                document.getElementById("download2").addEventListener('click', function(){
                    /*Get image of canvas element*/
                    var canvas = document.getElementById("myChart_rna");
                    fillCanvasBackgroundWithColor(canvas, 'white');
                    var url_base64jp = canvas.toDataURL("image/jpg");
                    /*get download button (tag: <a></a>) */
                    var a =  document.getElementById("download2");
                    /*insert chart image url to download button (tag: <a></a>) */
                    a.href = url_base64jp;
                    a.download = $('#fname').val() + "-rnaseq.jpg";
                });
            }

                // ////////////////////////////////////////////
        // Chip seq
        var canva3 = document.getElementById("myChart_chipseq");
        var ctx3 = canva3.getContext('2d');

        data = processResult[4];
        
        mydatasets_chipseq = [];
        var count = 0
        var max_len = 0
        for (var i in data) {
            var item_radius = [];
            var pointstyles = [];
            var borders = [];
            for (var k=0; k < data[i].length; k ++) {
                if (data[i][k].dose <= 1.) {
                    var radius = 1;
                } else if (data[i][k].dose <= 10.) {
                    var radius = 4;
                } else if (data[i][k].dose <= 1000.) {
                    var radius = 8;
                }
                item_radius.push(radius);

                fills.push(data[i][k].multi_duration)
                if (data[i][k].multi_duration) {
                    borders.push('black');
                } else {
                    borders.push(colorArray[count+4]);
                }
            }
            var item = {
                radius: item_radius,
                label: i,
                data: data[i],
                borderColor: borders,
                backgroundColor: colorArray[count+4],
                pointStyle: 'circle',
                showLine: fills
            }
            mydatasets_chipseq.push(item);
            count += 1;
            // max data len
            if (data[i].length > max_len) {
                max_len = data[i].length;
            }
        };
        mydatasets_chipseq.sort((a, b) => (a.data.length < b.data.length) ? 1 : -1);
        window.mydatasets_chipseq = mydatasets_chipseq;




        ////////
        if (mydatasets_chipseq.length == 0) {
            // //console.log("len 0");
            document.getElementById("aftersubmit3").innerHTML = "Gene " + $('#fname').val() + " Not found in Chip-seq database..."

        }
        else {
            $('#legend_container_chipseq').html("<div id='legend_container_chipseq'></div>");
            $('#duration_container_chipseq').html("<div id='duration_container_chipseq'></div>");
            
            
            var colorList = mydatasets_chipseq;
                colorize = function(colorList) {
                    var container = document.getElementById('legend_container_chipseq');

                    for (var item in colorList) {
                        // //console.log(item);
                        
                        var boxContainer = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");
                        var label_invisible = document.createElement("DIV");

                        var gene_name = colorList[item]['label']
                        label_invisible.className = "hidden click-toggle"
                        label_invisible.innerHTML = `<span>CEL-${gene_name}</span>`

                        // dataset len

                        label.innerHTML = colorList[item]['label'] + "                                ";
                        box.className = `box box-chipseq-legend-gene-CEL-${gene_name}`;
                        
                        box.style.backgroundColor = colorList[item]['backgroundColor'];
                        box.style.borderColor = colorList[item]['backgroundColor'];
                        box.style.textIndent = '20em';
                        box.style.opacity = 1;

                        boxContainer.className = "box-contain toggle-box-switch";
                        label.className = `label label-chipseq-legend-gene-CEL-${gene_name}`;
                        label.style.textDecoration = ""

                        label.appendChild(label_invisible)
                        box.appendChild(label_invisible)

                        boxContainer.appendChild(label_invisible)
                        boxContainer.appendChild(box);
                        boxContainer.appendChild(label);

                        container.appendChild(boxContainer);

                    }


                    var container = document.getElementById('legend_stats_chipseq');

                    for (var item in colorList) {
                        // //console.log(item);
                        var boxContainer = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");
                        var label_invisible = document.createElement("DIV");

                        // dataset len
                        var gene_name = colorList[item]['label']
                        // var tooltip_stats = " up " + Math.round(stats[gene_name][1]*100)+"% ; down: " + Math.round(stats[gene_name][0]*100) + "% "
                        label.innerHTML =  "<span>" + colorList[item]['data'].length + "</span>";

                        // var explain_text = "Taken significant p-value as 0.05, percentage of up/down regulated experiments are shown for each cell line when hover on the left number"
                        // if (item == 0) {
                        //     label.innerHTML +="&nbsp;&nbsp;<span class='tooltips_info' title='hello' data-tipso='" + explain_text + "'><i class='fas fa-question-circle'></i></span>"
                        // }

                        box.className = `box box-chipseq-legend-gene-CEL-${gene_name}`;
                       
                        box.style.backgroundColor = colorList[item]['backgroundColor'];
                        box.style.borderColor = colorList[item]['backgroundColor'];
                        box.style.textIndent = '20em';
                        var width = Math.round(colorList[item]['data'].length / max_len * 120);
                        box.style.width = width+"px";
                        box.style.opacity = 1;

                        boxContainer.className = "stats-contain toggle-box-switch";
                        label.className = `label label-chipseq-legend-gene-CEL-${gene_name}`;
                        label.style.textDecoration = ""

                        label_invisible.className = "hidden click-toggle"
                        label_invisible.innerHTML = `<span>CEL-${gene_name}</span>`

                        label.appendChild(label_invisible);
                        box.appendChild(label_invisible);
                        boxContainer.appendChild(label_invisible)

                        boxContainer.appendChild(box);
                        boxContainer.appendChild(label);
                        

                        container.appendChild(boxContainer);
                        

                    }


                }

                colorize(colorList);


                colorList_dose = [-1, 1, 10, 100];
                colorize_dose = function(colorList_dose) {
                    var container = document.getElementById('duration_container_chipseq');

                    for (var item in colorList_dose) {
                        // // //console.log(item);
                        // // //console.log(colorList[item]);
                        var boxContainer2 = document.createElement("DIV");
                        var boxContainer = document.createElement("DIV");
                        var boxContainer_t = document.createElement("DIV");
                        var box = document.createElement("DIV");
                        var label = document.createElement("DIV");
                        var label_invisible = document.createElement("DIV");

                        if (colorList_dose[item] == -1) {
                            label.innerHTML = "FullMedium"
                        }
                        else {
                            label.innerHTML = "CSS" + colorList_dose[item] + "nM";
                        }

                        if (colorList_dose[item] == -1) {
                            box.className = `circle-nosolid`;
                        } else {
                            box.className = `circle`;
                        }

                        
                        if (colorList_dose[item] == -1) {
                            var size = 8;
                        }
                        else if (colorList_dose[item] <= 1.) {
                            var size = 4;
                        } else if (colorList_dose[item] <= 10.) {
                            var size = 8;
                        } else if (colorList_dose[item] <= 100.) {
                            var size = 16;
                        }

                        box.style.height = size + "px";
                        box.style.width = size + "px";

                        box.style.textIndent = '40em';
                        

                        boxContainer2.className = `box-contain toggle-box-switch`;
                        boxContainer2.style.width = "120px";
                        
                        
                        boxContainer.className = "circle-contain";
                        boxContainer_t.className = "label-contain";

                        label.className = `label chipseq-legend-condition-CON-${label.innerHTML}`;
                        label.style.textDecoration = ""

                        label_invisible.className = "hidden click-toggle"
                        label_invisible.innerHTML = `<span>CON-${label.innerHTML}</span>`

                        boxContainer2.appendChild(label_invisible);

                        boxContainer.appendChild(box);

                        boxContainer2.appendChild(boxContainer);

                        boxContainer_t.appendChild(label)
                        boxContainer2.appendChild(boxContainer_t);

                        container.appendChild(boxContainer2);

                        

                    }
                };
                colorize_dose(colorList_dose);


                // linkedToggleBoxLegend(); 
                linkedToggleCircleLegend();
              
            window.chipseq_mainChart = new Chart(ctx3, {
                type: 'ScatterWithLine',
                data: {
                    datasets: mydatasets_chipseq
                },
                options: {
                    // responsive: true,
                    // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                     },
                    parsing: {
                        xAxisKey: 'tss',
                        yAxisKey: 'log2score',
                    },
                    'onClick' : function (evt, item) {
                        // //console.log ('legend onClick', evt);
                        // //console.log('legd item', item);
                        var dataset_index = item['0']['datasetIndex']
                        var innerIndex = item['0']['index'];
                        // //console.log(dataset_index)
                        // //console.log(innerIndex);
                        var GSE = mydatasets_chipseq[dataset_index]['data'][innerIndex]['GSE'];
                        // //console.log(GSE);
                        var myurl = "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc="+GSE;
                        // //console.log(myurl);
                        window.open(
                            myurl, "_blank");
                    },

                    


                plugins: {
                    legend: {
                        position: 'right',
                        display: false
                    },
                    // title: {
                    //     display: true,
                    //     text: 'RNA-seq Analysis ' + mydatasets_rna.length
                    // },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var dose = context.raw.dose;

                                return context.raw.name + ': Dose: ' + dose + ' H ; log2 score: ' + Number.parseFloat(context.raw.log2score).toPrecision(2) + '; position: '+Number.parseFloat(context.raw.tss).toPrecision(2)
                            },

                        }
                    }
                },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Log2 Peak Intensity Score'
                            },
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function(value, index, values) {
                                    return '' + value;
                                }
                            },
                            afterSetDimensions: (scale) => {
                                scale.maxWidth = 50;
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'TSS position (kb)'
                            },
                            min: -210,
                            max: 210,
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function(value, index, values) {
                                    return '' + value;
                                }
                            }
                        }
                    }
                },
            }); // ERAL1 DNM3

            // data for histogram
            //console.log("NOW______CHIPSEQ");
            //console.log(mydatasets_chipseq)
            var hist_chipseq_data = Array(40).fill(0);
            for (var i in mydatasets_chipseq) {
                for (var j in mydatasets_chipseq[i].data) {
                    var dataij = mydatasets_chipseq[i].data[j];
                    var location = dataij.tss;
                    var index = Math.round((location + 200) / 10)
                    if (index > 39) {
                        index = 39;
                    } else if (index < 0) {
                        index = 0;
                    }
                    hist_chipseq_data[index] += 1
                }
            }

            //console.log(hist_chipseq_data)
            var canva4 = document.getElementById("myChart_chipseq_distribution");
            var ctx4 = canva4.getContext('2d');
            
            
            var myChart4 = new Chart(ctx4, {
                type: 'bar',
                data: {
                    labels: range(0, 40),
                    datasets: [{
                      label: 'Numbers', // delete numbers
                      data: hist_chipseq_data,
                      backgroundColor: 'green',
                    }]
                  },
                  options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
    
                        },
                        title: {
                            display: true,
                            text: 'TSS position distribution',
                            padding: {
                                top: 5,
                                bottom: 5
                                }
                            }
                    
                    },
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: false,
                                text: 'TSS position distribution'
                            },
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function(value, index, values) {
                                    return '';
                                }
                            }
                        },
                        y: {
                            min: 0,
                            suggestedMax: Math.max(hist_chipseq_data),
                            title: {
                                display: true,
                                text: 'Peak Numbers'
                            },
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function(value, index, values) {
                                    var value_S = `${value}`
                                    return value_S.padStart(4,'\t\n\r');
                                },
                                
                            },
                            afterSetDimensions: (scale) => {
                                scale.maxWidth = 50;
                            },
                        },
                    }
                  },
            }); // ERAL1 DNM3

            document.getElementById("download3").addEventListener('click', function(){
                /*Get image of canvas element*/
                var canvas = document.getElementById("myChart_chipseq");
                fillCanvasBackgroundWithColor(canvas, 'white');
                var url_base64jp = canvas.toDataURL("image/jpg");
                /*get download button (tag: <a></a>) */
                var a =  document.getElementById("download3");
                /*insert chart image url to download button (tag: <a></a>) */
                a.href = url_base64jp;
                a.download = $('#fname').val() + "-chipseq.jpg";
                // let c = document.getElementById("figure3"); // or document.getElementById('canvas');
                // html2canvas(c).then((canvas)=>{
                //     var t = canvas.toDataURL().replace("data:image/png;base64,", "");
                //     downloadBase64File('image/png',t,'image.jpg');
                // })
                // window.open('', document.getElementById('chipseq-big').toDataURL());
            });
            
            


        }

            
                    // create filter table
                InitFilter();
                // $('#chart-title-id').html('<div id="chart-title-id" style="text-align: center;">hello</div>');

                document.getElementById("chart2-title-id").innerHTML = "<span><h3>RNA-seq Analysis</h3></span></br><span>" + calculateDatasetStats(mydatasets_rna, 2)+"</span>";
                // document.getElementById("chart3-title-id").innerHTML = "<span><b>ChIP-seq Analysis</b></span></br><span>";

                $('.tooltips_my').tipso({
                    // OPTIONS
                background  :'#333333',
                size: 'small',
                titleBackground   : '#0033cc',
                titleContent: 'Significant (p < 0.05)',
                position: 'top-right',

                    });
                $('.tooltips_info').tipso({
                    // OPTIONS
                    background  :'#0033cc',
                    size: 'small',
                    position: 'bottom-right',

                });
                // dash line

                $("#dashline2").html('<div id="dashline2"><hr style="border: 1px dashed black;" /></div>')
                $("#dashline3").html('<div id="dashline3"><hr style="border: 1px dashed black;" /></div>')
                $("#dashline4").html('<div id="dashline4"><hr style="border: 1px dashed black;" /></div>')

                showPage();
                var end_time = Date.now();
                var delta_time = (end_time-start_time)/1000;
                //console.log('total time ' + delta_time + ' s')


            
        setTimeout(display_box(mydatasets_chipseq), 10000);
        

        return mydatasets_chipseq;


    }

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }


    function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }

    function InitFilter() {
        // //console.log("OGH");
        // //console.log(window.mydatasets);

        // modify the content of gene name
        var input_html_genename = '';
        for (let i = 0; i < window.mydatasets.length; i++) {
            var name = window.mydatasets[i]['label'];
            input_html_genename += "<li id='" + name + "_id'" + " role='option'>" + name + "</li>"
          }
        // input_html_genename += "<li id='all_id' role='option'>ALL</li>"
        // // //console.log(input_html_genename);
        $("#ss_elem_list1").html(input_html_genename);

        var input_html_genename = '';
        for (let i = 0; i < window.mydatasets_chipseq.length; i++) {
            var name = window.mydatasets_chipseq[i]['label'];
            input_html_genename += "<li id='" + name + "_id'" + " role='option'>" + name + "</li>"
        }
        // input_html_genename += "<li id='all_id' role='option'>ALL</li>"
        // // //console.log(input_html_genename);
        $("#ss_elem_list1_c").html(input_html_genename);


        $("#myfilterbox").removeClass("hidden");
        $("#myfilterbox-chipseq").removeClass("hidden");
        
        // //console.log("OGH33333");

    }

    function resetPage() {
        Chart.helpers.each(Chart.instances, function(instance){
            instance.destroy();
        });

        document.getElementById("myfilterbox").classList.add("hidden");
        
        // document.getElementById("figure1").classList.add("hidden");
        $('#figure1').html(`
        <div id="figure1" class="horizon-flex-contain">
        <div class="chart-container">
          <div id="chart1-title-id" style="text-align: center; margin-top: 1em;"></div>
          <canvas id="myChart" width="663" height="350"></canvas> 
          <a id="download1"
            href=""
            class="btn btn-primary float-right bg-flat-color-1"
            title="Descargar Gráfico">
  
                    <!-- Download Icon -->
            <i class="fa fa-download"></i>
          </a>
        </div>
  
        <div>
          <div style="height: 5vh;"></div>
          <div style="display: flex; margin-left: 3em;">
            <div id="duration_container"></div>
            <div id="legend_container"></div>
            <div id="legend_stats"></div>
          </div>
        </div>
    </div>
        `)

        
        document.getElementById("dashline2").classList.add("hidden");
        $('#figure2').html(`
        <div id="figure2" class="horizon-flex-contain">
            <div class="chart-container">
            <div id="chart2-title-id" style="text-align: center; margin-top: 1em;"></div>
            <canvas id="myChart_rna" width="663" height="350"></canvas> 
            <a id="download2"
                href=""
                class="btn btn-primary float-right bg-flat-color-1"
                title="Descargar Gráfico">

                        <!-- Download Icon -->
                <i class="fa fa-download"></i>
                </a>
            </div>

            <div> 
            <div style="height: 5vh;"></div>
            <div style="display: flex;margin-left: 3em;">
                <div id="duration_container_rna"></div>
                <div id="legend_container_rna"></div>
                <div id="legend_stats_rna"></div>
            </div>
            <div style="height: 4em;"></div>
            </div>
            
        </div>`)
        // document.getElementById("figure2").classList.add("hidden");
        document.getElementById("dashline3").classList.add("hidden");
        $('#figure3').html(`
        <div id="figure3" class="horizon-flex-contain">
        <div id="chart-container3" class="chart-container" style="width: 650px;height: 600px;">
          <div id="chart3-title-id" style="text-align: center;"></div>
      
          <div style="display: flex">
            <!-- <div style="width: 1em;"></div> -->
            <div>
              <canvas id="myChart_chipseq_distribution" width="650" height="120"></canvas> 
            </div>
          </div>
          
          
          <div id="chipseq-big" style="display: flex;">
            <!-- <div style="width: 6px;"></div> -->
            <div style="height: 44.5vh;" >
              <canvas id="myChart_chipseq" width="663" height="420"></canvas>
              <a id="download3"
              href=""
              class="btn btn-primary float-right bg-flat-color-1"
              title="Descargar Gráfico">
    
                      <!-- Download Icon -->
              <i class="fa fa-download"></i>
            </a>
            </div>
          </div>
          
          
        </div>
        <div style="width: 15vw;">
          <div style="height: 5vh;"></div>
          <div id="chipseq_legend_container" style="display: flex; margin-left: 3em;">
            <div id="duration_container_chipseq"></div>
            <div style="width: 20vw;" id="legend_container_chipseq"></div>
            <div style="width: 20vw;" id="legend_stats_chipseq"></div>
          </div>
    
          <div> 
            <div style="display: flex">
              <div style="width: 30vw"> </div>
              
            </div>
            <!-- <div style="height: 5%"></div> -->
          </div>
          <br><br>
          
          
          
        </div>
        
      </div>
        `)
        // document.getElementById("figure3").classList.add("hidden");
        document.getElementById("myfilterbox-chipseq").classList.add("hidden");
        document.getElementById("download1").classList.add("hidden");
        document.getElementById("download2").classList.add("hidden");
        document.getElementById("download3").classList.add("hidden");
        document.getElementById("chipseq-title-id").classList.add("hidden");
        

        window.current_focus = null;
        window.focus_set = {'cellline': [], 'duration': [], 'dose': [], 'adj_p_value': []}
        window.focus_set_chipseq = {'cellline_chipseq': [], 'condition_chipseq': []}
    }

    function showPage() {
        //console.log("IM SHOW PAGEGGGGGGG")

        document.getElementById("myfilterbox").classList.remove("hidden");
        

        document.getElementById("dashline2").classList.remove("hidden");

        document.getElementById("dashline3").classList.remove("hidden");

        document.getElementById("myfilterbox-chipseq").classList.remove("hidden");
        document.getElementById("download1").classList.remove("hidden");
        document.getElementById("download2").classList.remove("hidden");
        document.getElementById("download3").classList.remove("hidden");
        document.getElementById("chipseq-title-id").classList.remove("hidden");
    }

    

    // load example
    // window.preload = window.preload.replace(/'/g, '"')
    //console.log(window.preload);
    // setTimeout(main_process_result, 2000, window.preload);
    window.preload = JSON.parse(window.preload)


    function getZeroPosition(value1, position1, value2, position2) {
        var length_per_value = (position2 - position1) / (value2 - value1)
        return position1 - (value1 - 0) * length_per_value
    }
    class MyType extends Chart.ScatterController {
        draw() {
            super.draw(arguments);
        
            var points = this.getMeta().data;
            if (points.length > 1) {
                var value1 = points[0].parsed.x;
                var position1 = points[0].x
                var value2 = points[1].parsed.x;
                var position2 = points[1].x
                var zero_position = getZeroPosition(value1, position1, value2, position2);
                // // draw line
                this.chart.ctx.beginPath();
                this.chart.ctx.moveTo(zero_position, 0);
                this.chart.ctx.strokeStyle = '#ff0000';
                this.chart.ctx.lineTo(zero_position, 10000);
                this.chart.ctx.stroke();
            
            }
      
        }
    }
    MyType.id = 'ScatterWithLine';
    MyType.defaults = Chart.ScatterController.defaults;
    Chart.register(MyType);
    
    

    main_process_result(window.preload);
});