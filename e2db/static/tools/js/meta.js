// $(document).ready(function () {
//   function draw_meta_sum() {
//     const data = {
//         labels: ['0-5', '5-10', '10-15', '15-20', '20-25', '25-30', '30-35'],
//         datasets: [{
//           label: 'Up Regulated',
//           data: [18, 12, 6, 9, 12, 3, 9],
//           backgroundColor: [
//             'rgba(0, 0, 255, 0.7)',
//           ],
//           borderColor: [
//             'rgba(0, 0, 255, 1)',
//           ],
//           borderWidth: 1
//         }, {
//           label: 'Down Regulated',
//           data: [-18, -12, -6, -9, -12, -3, -9],
//           backgroundColor: [
//             'rgba(255, 0, 0, 0.7)',
//           ],
//           borderColor: [
//             'rgba(255, 0, 0, 1)',
//           ],
//           borderWidth: 1,
//           borderSkipped: false
//         }]
//     };

//     // config 
//     const config = {
//         type: 'bar',
//         data,
//         options: {

//           scales: {
//             x: {
//               // stacked: true,
//             },
//             y: {
//               beginAtZero: true
//             }
//           }

          
//         }
//     };

//     // render init block
//     const myChart = new Chart(
//         document.getElementById('myChart-meta'),
//         config
//     );
    
// };
// });