let currentSelectedSymbol='';
document.addEventListener("DOMContentLoaded",function(){  
    const url='https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';

    let links = document.getElementsByTagName("div");    
    for (let i = 0; i < links.length-1; i++) {  
        let position = links[i].className;
        let sp = links[i].firstElementChild;
        if (position == 'label'){  
            sp.style.display = 'none';
            links[i].addEventListener("mouseover",function(){
                setTimeout(function() {
                    sp.style.display = 'none';
                }, 5000);
            if (sp.style.display == 'none') {
                    sp.style.display = 'block';
            }
            });
        }
    }
 
//storage load   
let localData;
if (localStorage.getItem('companies') == null && localStorage.getItem('companies')!='') {
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            localStorage.setItem('companies',JSON.stringify(data));
            localData = localStorage.getItem('companies');
            showList();
        })
        .catch(function (error) {
            console.log(error)
        });
} 
else {
    localData = localStorage.getItem('companies');
    showList();
}
    
document.querySelector("div.f ").style.visibility='hidden';
document.querySelector("div.e ").style.visibility='hidden';
document.querySelector("div.h ").style.visibility='hidden';
speakBtns();
defaultViewBtn();
viewChartBtn();
            

function showList(filter=''){
    let ul = document.getElementById("StockList");
    ul.innerHTML = "";
    let companies = [];
    document.querySelector(".b section").style.display = "block";
    companies = JSON.parse(localData);

    //filter
    if (filter!=''){
        let filterItems = (filter) => {
            return companies.filter(el => el.symbol.startsWith(filter));
        };
        companies= filterItems(filter);
    }
    
    //logo and image 
    for (let i = 0; i < companies.length; i++) {
        let ul = document.getElementById("StockList");
        let li = document.createElement("li");
        let img = document.createElement('img');
            img.src = './logos/' + companies[i].symbol + '.svg';
            img.className ='divImg';
        let hr = document.createElement('hr');
        let dv = document.createElement('div');
        let spn = document.createElement('span');
        let lnk = document.createElement('a');
        let linkText = document.createTextNode(companies[i].symbol);

        lnk.appendChild(img); 
        // symbol is added to logo
        lnk.appendChild(linkText);
        dv.className='myDiv';
        spn.appendChild(lnk);
        dv.appendChild(spn);
        li.appendChild(hr);
        li.appendChild(dv);
        ul.appendChild(li);
        if (companies[i].symbol != null){
                dv.addEventListener('click',function(){
                    fetchCompData(companies[i].symbol);                    
                    fetchCompDatachart(companies[i].symbol);
                });
        }
    }
}   

//checks for stored data is local storage after symbol is passed 
let selectedCompanayName='';
let selectedCompanayDesc='';
function fetchCompData(cmpny){
    let companyURL="https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php?symbol=" + cmpny;
    var companyLocalData= localStorage.getItem("["+cmpny+"]");
    if (companyLocalData==null || companyLocalData=='') {
            //fetches the url using link
            getCompany(companyURL);
            async function getCompany(companyURL) {
               try {
                   let data = await fetch(companyURL);
                   let copmanyData = await data.json(); 
                   companyLocalData = JSON.stringify(copmanyData );
                   localStorage.setItem("["+cmpny+"]",companyLocalData);                    
                   await fetchCompData(cmpny);
        
               } catch (e) {
                   console.error(e);
               }
            }
    } 
    else {
        companyLocalData = localStorage.getItem("["+cmpny+"]"); //Data is found
        showInformation(companyLocalData);
    } 
}
    
// Symbol and logo is shown 
let map ;
let lat ;
let lng;  
function showInformation(cmpny){   
    companyInfoData=JSON.parse(cmpny);
    document.querySelector("div.a section").style.display = "grid";
    let pic = document.getElementById("pic"); 
    pic.src = './logos/' + ((companyInfoData.symbol != '') ? companyInfoData[0].symbol : companyInfoData.symbol) + '.svg';
    pic.className ='divImg';
    document.getElementById("infoSymbol").innerHTML = companyInfoData[0].symbol;
    document.getElementById("infocompanyName").innerHTML = ((companyInfoData.name != '') ? companyInfoData[0].name : companyInfoData.name);
    document.getElementById("infoexchange").innerHTML = ((companyInfoData.exchange != '') ? companyInfoData[0].exchange : companyInfoData.exchange);
    document.getElementById("infoindustry").innerHTML = ((companyInfoData.subindustry != '') ? companyInfoData[0].subindustry : companyInfoData.subindustry);
    document.getElementById("infoAddress").innerHTML = ((companyInfoData.address != '') ? companyInfoData[0].address : companyInfoData.address);
    document.getElementById("infoDescription").innerHTML = ((companyInfoData.description != '') ? companyInfoData[0].description : companyInfoData.description);
    document.getElementById("infowebsite").innerHTML = ((companyInfoData.website != '') ?  companyInfoData[0].description : companyInfoData.description);
    document.getElementById("infosector").innerHTML = ((companyInfoData.sector != '') ? companyInfoData[0].description : companyInfoData.description) ;
     
    // chart box with company stats
    document.getElementById("chartCompanySymbol").innerHTML = ((companyInfoData.symbol != '') ? companyInfoData[0].symbol : companyInfoData.symbol); 
    document.getElementById("chartCompanyName").innerHTML =  ((companyInfoData.name != '') ? companyInfoData[0].name : companyInfoData.name);
    document.getElementById("chartCompanyDesc").innerHTML =((companyInfoData.website != '') ?  companyInfoData[0].description : companyInfoData.description);
    selectedCompanayName=((companyInfoData.name != '') ? companyInfoData[0].name : companyInfoData.name);
    selectedCompanayDesc=((companyInfoData.website != '') ?  companyInfoData[0].description : companyInfoData.description);
     
    lat = ((companyInfoData.latitude != '') ? companyInfoData[0].latitude : companyInfoData.latitude);
    lng = ((companyInfoData.longitude != '') ? companyInfoData[0].longitude : companyInfoData.longitude);

    initMap();
    createMarker(map, lat, lng);
    Chart2(companyInfoData);
    finicalTable(companyInfoData[0].financials);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: lat,
            lng: lng
        },
        zoom: 18
    });
}

function createMarker(map, latitude, longitude, city) {
    let stocksLatLong = {
        lat: latitude,
        lng: longitude
    };
    let marker = new google.maps.Marker({
        position: stocksLatLong,
        map: map
    });
}   

//checks local storage for data 
function fetchCompDatachart(cmpny){   
    var companychartLocalData=localStorage.getItem(cmpny);
    const companyChartURL="https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=" + cmpny ;
  
    if (companychartLocalData==null || companychartLocalData=='') {
            getHistory(companyChartURL);
             async function getHistory(companyChartURL) {
                try {
                    let data = await fetch(companyChartURL);
                    let history  = await data.json();
                    companychartLocalData = JSON.stringify(history);
                    localStorage.setItem(cmpny,companychartLocalData);
                    await fetchCompDatachart(cmpny);
                    
      
                } catch (e) {
                    console.error(e);
                }
             }
       
  }  else { 
        companychartLocalData = localStorage.getItem(cmpny);    
        displaychartInfo(companychartLocalData);    
  }
    
}
  
// shows charts stats
function displaychartInfo(charts){
    document.querySelector("div.d  section").style.display = "grid";
    document.querySelector("div  #dchart").style.display = "grid";
    document.querySelector("div #viewChartBtn").style.display = "grid";
    let companiescharts =[];
    companiescharts=JSON.parse(charts);
    let tbl = document.getElementById('stockData');
    tbl.innerHTML = "";
        
    var tr = document.createElement("tr");
    tbl.appendChild(tr);

    //data items are added
    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Date"));
    tr.appendChild(th);

    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Open"));
    tr.appendChild(th);

    var th = document.createElement("th");
    th.appendChild(document.createTextNode("High"));
    tr.appendChild(th);

    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Low"));
    tr.appendChild(th);

    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Close"));
    tr.appendChild(th);

    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Volume"));
    tr.appendChild(th);
    
    //variables  for the calculaation process
    let avgClose=0;
    let avgVol=0;
  
    //arrays for the charts
    openCalc =[];
    closeCalc =[];
    highCal =[];
    lowCalc =[];
    volumeCalc =[];
    closePrices =[];
   
    for (let i = 0; i < companiescharts.length; i++){
        openCalc.push(companiescharts[i].open);
        closeCalc.push(companiescharts[i].close);
        highCal.push(companiescharts[i].high);
        lowCalc.push(companiescharts[i].low);
        volumeCalc.push(companiescharts[i].volume);
    }
    openCalc.sort(function(a, b){return b-a});
    closeCalc.sort(function(a, b){return b-a});
    lowCalc.sort(function(a, b){return b-a});
    highCal.sort(function(a, b){return b-a});
    volumeCalc.sort(function(a, b){return b-a});
   
    avgClose =  average(closeCalc);
    avgVol   = average(volumeCalc);
    

    document.getElementById("averageOpen").innerHTML = average(openCalc);
    document.getElementById("minimumOpen").innerHTML = parseInt(openCalc.slice(-1)[0]);
    document.getElementById("maxOpen").innerHTML = parseInt(openCalc[0]);

    document.getElementById("averageClose").innerHTML = avgClose;
    document.getElementById("minimumClose").innerHTML = parseInt(closeCalc.slice(-1)[0]);
    document.getElementById("maxClose").innerHTML = parseInt(closeCalc[0])

    document.getElementById("averagelow").innerHTML = average(lowCalc);
    document.getElementById("minimumLow").innerHTML = parseInt(lowCalc.slice(-1)[0]);
    document.getElementById("maxLow").innerHTML = parseInt(lowCalc[0])
    
    document.getElementById("averageHigh").innerHTML = average(highCal);
    document.getElementById("minimumHigh").innerHTML = parseInt(highCal.slice(-1)[0]);
    document.getElementById("maxHigh").innerHTML = parseInt(highCal[0]);

    document.getElementById("averageVolume").innerHTML = avgVol;
    document.getElementById("minimumVolume").innerHTML = parseInt(volumeCalc.slice(-1)[0]);
    document.getElementById("maxVolume").innerHTML = parseInt(volumeCalc[0]);
     
    let minClose=0;
    let totalVol=0

    closePrices =[];
    volumes =[];
    x = [];

    for (let i = 0; i < companiescharts.length; i++){
        // adds row      
        var tr = document.createElement("tr");
        tbl.appendChild(tr);

        //adding data items
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(companiescharts[i]['date']));
        tr.appendChild(td);
        x.push(companiescharts[i]['date']);

        var td = document.createElement("td");
        td.appendChild(document.createTextNode(parseInt(companiescharts[i]['open'])));
        tr.appendChild(td);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(parseInt(companiescharts[i]['high'])));
        tr.appendChild(td);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(parseInt(companiescharts[i]['low'])));
        tr.appendChild(td);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(parseInt(companiescharts[i]['close'])));
        tr.appendChild(td);
        closePrices.push(companiescharts[i]['close']);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(parseInt(companiescharts[i]['volume'])));
        tr.appendChild(td);

        volumes.push(companiescharts[i]['volume']/10000);

        avgClose = avgClose + companiescharts[i]['close'];
         (companiescharts[i]['close'] < minClose) ? minClose = companiescharts[i]['close'] : console.log('');
         avgVol = avgVol + companiescharts[i]['volume'];
         totalVol = totalVol + companiescharts[i]['volume'];
    }
}

function finicalTable(finData){
     
    var sec = document.getElementById("hchart");  
    sec.innerHTML = "";
    
    
    if (finData != null) {
        $table = "<table><tr><th>Year</th><th>Assets</th><th>Earning</th><th>Revenue</th><th>Liabilities</th><th></tr>";
        for (let i = 0; i < finData.revenue.length; i++){
            $table += "<tr><td>" + ((finData.years[i]!=null) ? finData.years[i] : '') +
                    "</td><td>"+ ((finData.assets[i]!=null) ? finData.assets[i] : '') + 
                    "</td><td>" + ((finData.earnings[i]!=null) ? finData.earnings[i] : '') +  
                    "</td><td>"+ ((finData.revenue[i]!=null) ? finData.revenue[i] : '') + 
                    "</td><td>"+ ((finData.liabilities[i]!=null) ? finData.liabilities[i] : '') + 
                    "</td></tr>";
        }
    
    sec.innerHTML= $table + "</table";
    } else {
        sec.innerHTML= "No Financial Data";
    }
}

function average(nums) {
    let avg =0.0;
    for (let i=0; i<nums.length; i++){
        avg += parseFloat(nums[i]);
    }  
    return (parseInt(avg / nums.length));
   
}

// button to change the view of website
function viewChartBtn() {
    let viewChartBtn = document.getElementById("viewChartBtn");
    let textBtn = document.createTextNode('View Chart');
    viewChartBtn.appendChild(textBtn);
    viewChartBtn.addEventListener('click', function(){
        // shows charts and speak buttons when clicked
        document.querySelector("div.a ").style.visibility='hidden';
        document.querySelector("div.b ").style.visibility='hidden';
        document.querySelector("div.c ").style.visibility='hidden';
        document.querySelector("div.d ").style.visibility='hidden';
        document.querySelector("div.g ").style.visibility='hidden';
        document.querySelector("div.f ").style.visibility='visible';
        document.querySelector("div.e ").style.visibility='visible';
        document.querySelector("div.h ").style.visibility='visible';
        document.querySelector("div.e section").style.display = "grid";
        document.querySelector("div.e section").style.display = "block";
        // chart values are shown when the values are passed
        displayChart(closePrices,volumes,x); 
    }); 
}
    
//text speech is heard when button is clicked   
function speakBtns() {
    let compDescSpeakBtn = document.getElementById("compDescSpeakBtn");
    let textBtn2 = document.createTextNode('Speak');
    compDescSpeakBtn.appendChild(textBtn2);
    
    compDescSpeakBtn.addEventListener("click",function(){
        speakText(selectedCompanayDesc);
    });
}

//Speak functiion     
function speakText(txt){
    let message = new SpeechSynthesisUtterance();
    message.text = txt;
    window.speechSynthesis.speak(message);
}
   
// Displays the volumes, close prices and the date on the chart 
let closePrices =[];
let volumes =[];
let x = [];
function displayChart(closePrices,volumes,x){
    let chartData = document.getElementById("myChart");
    let myChart = echarts.init(chartData);
    
    option = null;
    option = {
        title: {
        text: 'Price History Chart'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['Close Price','Volumes']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        show : true,
        hoverable: true,
        containLabel: true,
        backgroundColor : 'white',
        borderColor : 'grey',
        borderWidth : '2px',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x
            
        },
        yAxis: {
            type: 'value',
            splitNumber: 15
        },
        series: [
            {
                data: closePrices,
                type: 'line',
                name:'Close Price'
            },
            {
                data: volumes,
                type: 'line',
                name:'Volumes'
            }         
        ]
    };
    
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function Chart2(companyInfo){
    if (companyInfo[0].financials != null) {
    const contain = document.querySelector("#columns");
    const Chart2 = new Chart(contain, {
        type: "bar",
        data: {
            labels: companyInfo[0].financials.years,
            datasets: [
                {
                    label: "Revenue",
                    backgroundColor: "#0000FF",
                    data: companyInfo[0].financials.revenue
                },
                {
                    label: "Earnings",
                    backgroundColor: "#008000",
                    data: companyInfo[0].financials.earnings
                },
                {
                    label: "Assets",
                    backgroundColor: "#FFFF00",
                    data: companyInfo[0].financials.assets
                },
                {
                    label: "Liabilities",
                    backgroundColor: "#FF0000",
                    data: companyInfo[0].financials.liabilities
                }
            ]
        }
    });
    }
}

function defaultViewBtn() {
    let defaultBtn = document.getElementById("defaultBtn");
    let textBtn = document.createTextNode('Close');
    defaultBtn.appendChild(textBtn);
    defaultBtn.style.background = 'lightgrey';
    defaultBtn.style.width = '85px';
    defaultBtn.style.height = '30px';
    defaultBtn.addEventListener('click', function(){
        document.querySelector("div.a ").style.visibility='visible';
        document.querySelector("div.b ").style.visibility='visible';
        document.querySelector("div.c ").style.visibility='visible';
        document.querySelector("div.d ").style.visibility='visible';
        document.querySelector("div.g ").style.visibility='visible';
        document.querySelector("div.f ").style.visibility='hidden';
        document.querySelector("div.e").style.visibility ='hidden'; 
        document.querySelector("div.h").style.visibility='hidden';                    
    });
}

btnGo.addEventListener('click', function() {
    //document.getElementById("filterList").value ="";
    var filter = document.getElementById("filterList").value;
    console.log(filter);
    showList(filter);
})
    
btnClear.addEventListener('click', function() {
    document.getElementById("filterList").value ="";
    showList();
}) 
});
