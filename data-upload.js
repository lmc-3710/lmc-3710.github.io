function salesInputs() {
  $("#data-form").show();
  var y = document.getElementById('attendanceData');
  y.style.display = "none";
  var x = document.getElementById('vendorCategory');
  x.style.display = "block";
  var z = document.getElementById('saleData');
  z.style.display = "block";
  var a = document.getElementById('vc');
  var b = document.getElementById('attendance');
  var c = document.getElementById('sales');
  a.required = true;
  b.required = false;
  c.required = true;
}

function attendanceInputs() {
  $("#data-form").show();
  var x = document.getElementById('vendorCategory');
  var y = document.getElementById('attendanceData');
  var z = document.getElementById('saleData');
  var a = document.getElementById('vc');
  var b = document.getElementById('attendance');
  var c = document.getElementById('sales');
  z.style.display = "none";
  c.required = false;
  x.style.display = "none";
  a.required = false;
  y.style.display = "block";
  b.required = true;
}

function saveTo() {
  var sale = document.getElementById('r1');
  var att = document.getElementById('r2');
  if (sale.checked) {
    if (document.getElementById('markets').options.selectedIndex !== 0
      && document.getElementById('vc').options.selectedIndex
      && document.getElementById('sales').value !== ''
      && document.getElementById('date').value !== '') {
      var market = document.getElementById('markets');
      var sm = market.options[market.selectedIndex].value;
      var vendor = document.getElementById('vc');
      var sv = vendor.options[vendor.selectedIndex].value;
      var dataNum = document.getElementById('sales').value;
      var date = document.getElementById('date').value;
      date = date.toString();
      date = reformatDate(date);
      dataNum = parseInt(dataNum);
      addSaleData(sm, sv, dataNum, date);
    } else {
      alert('Please fill in all fields.');
    }
  } else if (att.checked) {
    if (document.getElementById('markets').options.selectedIndex !== 0
      && document.getElementById('attendance').value !== ''
      && document.getElementById('date').value !== '') {
      var market = document.getElementById('markets');
      var sm = market.options[market.selectedIndex].value;
      var dataNum = document.getElementById('attendance').value;
      var date = document.getElementById('date').value;
      date = date.toString();
      date = reformatDate(date);
      dataNum = parseInt(dataNum);
      addAttendanceData(sm, dataNum, date);
    } else {
      alert('Please fill in all fields.');
    }
  }
}

function reformatDate(dateString) {
  return dateString.substring(5, 7) + "/" + dateString.substr(8, 2) + "/" + dateString.substring(0, 4);
}

function addSaleData(m, v, s, d) {
    //Get weather data for date
    var key = '363fe27ca294d5fff2376e54e6a3b2d5';
    var lat = 33.7537;
    var lng = -84.3863;
    var time = new Date(d).getTime().toString().slice(0, -3);
    var uri = 'https://api.darksky.net/forecast/' + key + '/' + lat + ',' + lng + ',' + time + '?exclude=currently,flags';
  
    $.getJSON('https://cors.io/?' + uri, function(forecast) {
      //Create new sale object
      var newSale = {
        timestamp: d,
        market: m,
        vendorCategory: v,
        sales: s,
        date: d,
        high: forecast.daily.data[0].temperatureHigh,
        low: forecast.daily.data[0].temperatureLow,
        precip: forecast.daily.data[0].precipProbability
      };

      if (localStorage.getItem('salesData') == null) {
        $.getJSON("sales.json", function (data) {
          localStorage.setItem('salesData', JSON.stringify(data, null, '\t'));
          var temp = JSON.parse(localStorage.getItem('salesData'));
          temp.push(newSale);
          temp.sort(function(a, b) { return new Date(a.date) - new Date(b.date)});
          localStorage.setItem('salesData', JSON.stringify(temp, null, '\t'));
        });
      } else {
        var temp = JSON.parse(localStorage.getItem('salesData'));
        temp.push(newSale);
        temp.sort(function(a, b) { return new Date(a.date) - new Date(b.date)});
        localStorage.setItem('salesData', JSON.stringify(temp, null, '\t'));
      }

      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
    });
}

function addAttendanceData(m, a, d) {
  //Get weather data for date
  var key = '363fe27ca294d5fff2376e54e6a3b2d5';
  var lat = 33.7537;
  var lng = -84.3863;
  var time = new Date(d).getTime().toString().slice(0, -3);
  var uri = 'https://api.darksky.net/forecast/' + key + '/' + lat + ',' + lng + ',' + time + '?exclude=currently,flags';

  $.getJSON('https://cors.io/?' + uri, function(forecast) {
    //Create new attendance object
    var newAttendance = {
      timestamp: d,
      market: m,
      attendance: a,
      date: d,
      month: parseInt(d.substr(0, 2)),
      day: parseInt(d.substr(3, 2)),
      year: parseInt(d.substr(6, 4)),
      temperature: "",
      high: forecast.daily.data[0].temperatureHigh,
      low: forecast.daily.data[0].temperatureLow,
      precip: forecast.daily.data[0].precipProbability
    };

    if (localStorage.getItem('attendanceData') == null) {
      $.getJSON("attendance.json", function (data) {
        localStorage.setItem('attendanceData', JSON.stringify(data, null, '\t'));
        var temp = JSON.parse(localStorage.getItem('attendanceData'));
        temp.push(newAttendance);
        temp.sort(function (a, b) { return new Date(a.date) - new Date(b.date) });
        localStorage.setItem('attendanceData', JSON.stringify(temp, null, '\t'));
      });
    } else {
      var temp = JSON.parse(localStorage.getItem('attendanceData'));
      temp.push(newAttendance);
      temp.sort(function (a, b) { return new Date(a.date) - new Date(b.date) });
      localStorage.setItem('attendanceData', JSON.stringify(temp, null, '\t'));
    }
  });

    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
}