/////////////////
// function linkedToggleBoxLegend() {
//   $('.box').on('click', function(e){
//     e.preventDefault();
//     var toggle = (this_block) => {
//         // var new_opacity;
//         if (this_block.style.opacity == 0.1) {
//             var new_opacity = 1
//             var new_text_decoration = ""
//         } else {
//             var new_opacity = 0.1
//             var new_text_decoration = "line-through"
//         }
  
//         // gene name
//         var gene_name = this_block.children[0].innerText;
//         // console.log($(`.box-chipseq-legend-gene-${gene_name}`))
//         var box_genes_div = $(`.box-chipseq-legend-gene-${gene_name}`)
//         var label_genes_div = $(`.label-chipseq-legend-gene-${gene_name}`)
//         console.log(gene_name)
//         box_genes_div.css('opacity', new_opacity)
//         label_genes_div.css('text-decoration', new_text_decoration)
        
//     };
    
  
//     // box-chipseq-legend-gene-${gene_name}
  
//     toggle($(this)[0]);
//     // $(this).css('opacity', '0.1');
//     // console.log($(this)[0].children[0].innerText);
//   });

 
  
// }


function linkedToggleCircleLegend() {
  $('.toggle-box-switch').on('click', function(e){
    e.preventDefault();
    var toggle_circle = (this_block) => {
      // gene name
      var condition_name = this_block.children[0].innerText;
      // circle
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

      // label celline
      var gene_name = condition_name;
      var label_gene_name_div = $(`.label-chipseq-legend-gene-${gene_name}`)
      if (label_gene_name_div.css('text-decoration') == 'none solid rgb(33, 37, 41)') {
        label_gene_name_div.css('text-decoration', "line-through")  
      } else {
        label_gene_name_div.css('text-decoration', "")  
      }
    
      // box celline
      var box_genes_div = $(`.box-chipseq-legend-gene-${gene_name}`)
      if (box_genes_div.css('opacity') == '0.1') {
        box_genes_div.css('opacity', "1")  
      } else {
        box_genes_div.css('opacity', "0.1")  
      };
    
      return condition_name;
    }
    
    var condition_name = toggle_circle($(this)[0]);
    console.log(condition_name);
  });
  

  // use the switch to change data


  // distribution plot

  // main chipseq plot

  // sites count plot

}


