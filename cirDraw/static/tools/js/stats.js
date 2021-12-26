$(document).ready(function () {
    window.click_once = false;
    const button = document.querySelector('button');

    $('#button').click(function (e) {
        e.preventDefault();
        $('#fname1').html('GREB1');
    });
    

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

    function drawSVGplot(block_id) {
        var margin = {top: 20, right: 160, bottom: 35, left: 30};

        var width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        /* Data in strings like it would be if imported from a csv */

        var data = [
            { year: "2006", totalnum: "10", mcintosh: "15"},
            { year: "2007", totalnum: "12", mcintosh: "18"},
            { year: "2008", totalnum: "05", mcintosh: "20"},
            { year: "2009", totalnum: "01", mcintosh: "15"},
            { year: "2010", totalnum: "02", mcintosh: "10"},
            { year: "2011", totalnum: "03", mcintosh: "12"},
            { year: "2012", totalnum: "04", mcintosh: "15"},
            { year: "2013", totalnum: "06", mcintosh: "11"},
            { year: "2014", totalnum: "10", mcintosh: "13"},
            { year: "2015", totalnum: "16", mcintosh: "19"},
            { year: "2016", totalnum: "19", mcintosh: "17"},
        ];

        var parse = d3.time.format("%Y").parse;


        // Transpose the data into layers
        var dataset = d3.layout.stack()(["totalnum", "mcintosh"].map(function(fruit) {
        return data.map(function(d) {
            return {x: parse(d.year), y: +d[fruit]};
        });
        }));

        // Set x, y and colors
        var x = d3.scale.ordinal()
        .domain(dataset[0].map(function(d) { return d.x; }))
        .rangeRoundBands([10, width-10], 0.02);

        var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
        .range([height, 0]);

        var colors = ["#072A6C", "#ff0000"];


        // Define and draw axes
        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickSize(-width, 0, 0)
        .tickFormat( function(d) { return d } );

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"));

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


        // Create groups for each series, rects for each segment 
        var groups = svg.selectAll("g.cost")
        .data(dataset)
        .enter().append("g")
        .attr("class", "cost")
        .style("fill", function(d, i) { return colors[i]; });
        var rect = groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .attr("width", x.rangeBand())
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(d.y);
        });

        // Prep the tooltip bits, initial display is hidden
        var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
        
        tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

        tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");


        // Draw legend
        var legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
        
        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {return colors.slice().reverse()[i];});
        
        legend.append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) { 
            switch (i) {
            case 0: return "Anjou pears";
            case 1: return "Naval oranges";
            }
        });
    }
    // drawSVGplot("id");
    drawStackPlot();

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
        console.log(processResult)


        var microarray_response_num = processResult[0].length
        console.log("microarray_response_num " + microarray_response_num)
        $(`#num_genes_${id_mode}`).html(`<div id="num_genes_${id_mode}" style="padding-bottom: 1em;">Got <u>${microarray_response_num}</u> Significant Genes for <b>MicroArray</b> <a id='export_${id_mode}' color="black" download="" href="#"><u><span style="color:red">(export)</u></span></a>:</div>`)
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
        var data_plot_1 = []
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

            data_plot_1.push({
                x: i,
                y: processResult[0][i].logfc_percent,
                r: processResult[0][i].ins_count * 0.1
            })
        }

        data_plot_1 = {
            datasets: [{
              label: 'First Dataset',
              data: data_plot_1,
              backgroundColor: 'rgb(255, 99, 132)'
            }]
          };

        microarray_table_html += `
                </tbody>
            </table>
        `
        $(`#microarray_table_up_${id_mode}`).html(microarray_table_html);
        
        // Adding plots
        // Setup svg using Bostock's margin convention



        // RNA-seq 
        var rna_response_num = processResult[1].length
        console.log("rna_response_num " + rna_response_num)
        $(`#num_genes_${id_mode}_rna`).html(`<div id="num_genes_${id_mode}_rna" style="padding-bottom: 1em;">Got <u>${rna_response_num}</u> Significant Genes for <b>RNA-seq</b> <a id='export_${id_mode}_rna' download="" href="#"><u><span style="color:red">(export)</u></span></u></a>:</div>
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

        // download 
        
        createDownloadLink(`#export_${id_mode}_rna`,str_rna,"RNA-seq-genelist.txt");
        createDownloadLink(`#export_${id_mode}`,str_micro,"MicroArray-genelist.txt");
    }
});