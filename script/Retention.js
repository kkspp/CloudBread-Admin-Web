var Dormant15_list = new Array();
var Dormant30_list = new Array();

//Dormant15 Data
var pro_dormant15 = new Promise(function (resolve, reject) {
  $.ajax({
    type: "GET",
    url: host + "odata/StatsDatas?$filter=CategoryName%20eq%20'Dormant15'&$orderby=Fields%20asc",
    dataType: "text",
    error: function() {
      reject(Error("Fail"));
      //handled error
    },
    success: function(data) {
      //anything
    }
  }).done(function(data) {
    var i = 1;
    var pars = JSON.parse(data);
    var value = pars['value'];

    var field_fst = value[0]['Fields'];
    var count_max = Number(value[0]['CountNum']);

    for (; i < value.length; i++) {
      if (field_fst != value[i]['Fields']) {
        var dataset = {
          'Field': field_fst,
          'Count': count_max
        };
        Dormant15_list.push(dataset);
        field_fst = value[i]['Fields'];
      }
      count_max = Number(value[i]['CountNum']);
    }
    var dataset = {
      'Field': field_fst,
      'Count': count_max
    };
    Dormant15_list.push(dataset);
    resolve("Complete");
  });
});

//Dormant30 Data
var pro_dormant30 = new Promise(function (resolve, reject) {
  $.ajax({
    type: "GET",
    url: host + "odata/StatsDatas?$filter=CategoryName%20eq%20'Dormant30'&$orderby=Fields%20asc",
    dataType: "text",
    error: function() {
      reject(Error("Fail"));
      //handled error
    },
    success: function(data) {
      //anything
    }
  }).done(function(data) {
    var i = 1;
    var pars = JSON.parse(data);
    var value = pars['value'];

    var field_fst = value[0]['Fields'];
    var count_max = Number(value[0]['CountNum']);

    for (; i < value.length; i++) {
      if (field_fst != value[i]['Fields']) {
        var dataset = {
          'Field': field_fst,
          'Count': count_max
        };
        Dormant30_list.push(dataset);
        field_fst = value[i]['Fields'];
      }
      count_max = Number(value[i]['CountNum']);
    }
    var dataset = {
      'Field': field_fst,
      'Count': count_max
    };
    Dormant30_list.push(dataset);
    resolve("Complete");
  });
});

Promise.all([pro_Dormant15, pro_Dormant30]).then(function() {
  google.charts.setOnLoadCallback(drawDormantGraph);
  $("#graph_loading").empty();
});

function drawDormantGraph() {
  var Dormant_data = new google.visualization.DataTable();
  Dormant_data.addColumn('string', 'Time of Day');
  Dormant_data.addColumn('number', '30일 휴면유저');
  Dormant_data.addColumn('number', '15일 휴면유저');

  for (i = 0; i < Dormant15_list.length; i++) {
    var hour = Dormant15_list[i]['Field'].substring(8, 10);
    var day = Dormant15_list[i]['Field'].substring(6, 8);
    Dormant_data.addRows([
      [{
        v: day + "." + hour
      }, Number(Dormant30_list[i]['Count']), Number(Dormant15_list[i]['Count'])]
    ]);
  }
  var Dormant_options = {
    title: 'Dormant 휴면유저',
    isStacked: true,
    hAxis: {
      title: 'Day'
    },
    vAxis: {
      title: 'Dormant (명)'
    },
    backgroundColor: '#FFF'
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('Dormant_div'));
  chart.draw(Dormant_data, Dormant_options);
}

$(window).resize(function() {
  drawDormantGraph();
});