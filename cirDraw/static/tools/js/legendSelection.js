/////////////////
function linkedToggleBoxLegend() {
  $('.box').on('click', function(e){
    e.preventDefault();
    var toggle = (this_block) => {
        // var new_opacity;
        if (this_block.style.opacity == 0.1) {
            var new_opacity = 1
            var new_text_decoration = ""
        } else {
            var new_opacity = 0.1
            var new_text_decoration = "line-through"
        }
  
        // gene name
        var gene_name = this_block.children[0].innerText;
        // console.log($(`.box-chipseq-legend-gene-${gene_name}`))
        var box_genes_div = $(`.box-chipseq-legend-gene-${gene_name}`)
        var label_genes_div = $(`.label-chipseq-legend-gene-${gene_name}`)
        console.log(gene_name)
        box_genes_div.css('opacity', new_opacity)
        label_genes_div.css('text-decoration', new_text_decoration)
        
    };
    
  
    // box-chipseq-legend-gene-${gene_name}
  
    toggle($(this)[0]);
    // $(this).css('opacity', '0.1');
    // console.log($(this)[0].children[0].innerText);
  });

  $('.box').on('click', function(e){
    e.preventDefault();
  });
  
}


function linkedToggleCircleLegend() {
  $('.box-contain').on('click', function(e){
    e.preventDefault();
    var toggle_circle = (this_block) => {
      // gene name
      var condition_name = this_block.children[0].innerText;
      console.log(this_block.children[0].innerText)
      console.log($(`.chipseq-legend-condition-${condition_name}`))
      var circle_condition_div = $(`.chipseq-legend-condition-${condition_name}`)
      console.log(circle_condition_div.css('text-decoration') == 'none solid rgb(33, 37, 41)')
    
      if (circle_condition_div.css('text-decoration') == 'none solid rgb(33, 37, 41)') {
          console.log("Change from white")
          // console.log(circle_condition_div)
          circle_condition_div.css('text-decoration', "line-through")  
      } else {
        console.log("Change from not white")
        circle_condition_div.css('text-decoration', "")  
      }
        
        
    };
    
  
    // box-chipseq-legend-gene-${gene_name}
  
    toggle_circle($(this)[0]);
    // $(this).css('opacity', '0.1');
    // console.log($(this)[0].children[0].innerText);
  });
  

  // use the switch to change data

  // distribution plot

  // main chipseq plot

  // sites count plot

}

