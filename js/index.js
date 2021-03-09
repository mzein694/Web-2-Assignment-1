document.addEventListener("DOMContentLoaded",function(){   
    const url='http://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';

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
 
//checks for the load storage    
let localData;
if (localStorage.getItem('companies') == null && localStorage.getItem('companies')!='') {
    fetch(url) //fetches the url to check loadStorge for JSON 
        .then(response => {
            return response.json();
        })
        .then(data => {
            localStorage.setItem('companies',JSON.stringify(data));
            localData = localStorage.getItem('companies');
            displayList();
        })
        .catch(function (error) {
            console.log(error)
        });
} 
else {
    localData = localStorage.getItem('companies');
    displayList();
}
    
// Search for company Symbol
const searchBox = document.querySelector('.search');
searchBox.addEventListener('keyup', function() {
        let searchText = document.querySelector('.search').value;
        displayList(searchText);
});
document.querySelector("div.f ").style.visibility='hidden';
document.querySelector("div.e ").style.visibility='hidden';
displaySpeakButtoms();
displayButtonDefaultview();
displayButtonViewChart();
  
            
// Functions definitions
function displayList(filter=''){
    let ul = document.getElementById("StockList");
    ul.innerHTML = "";
    let companies = [];
    document.querySelector(".b section").style.display = "block";
    companies = JSON.parse(localData);

    // perform filter if it is needed
    if (filter!=''){
        let filterItems = (filter) => {
            return companies.filter(el => el.symbol.startsWith(filter));
        };
        companies= filterItems(filter);
    }
    
    // creating the img and its logo 
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
        // adds the symbol to the img
        lnk.appendChild(linkText);
        dv.className='myDiv';
        spn.appendChild(lnk);
        dv.appendChild(spn);
        li.appendChild(hr);
        li.appendChild(dv);
        ul.appendChild(li);
        if (companies[i].symbol != null){
                dv.addEventListener('click',function(){
                    getCompanyData(companies[i].symbol);
                    getCompanyDatachart(companies[i].symbol);
                });
        }
    }
    
}   

//Pass symbol to the url to check if the data is stored in the localstorage  
let currentSelectedSymbol='';
let selectedCompanayName='';
let selectedCompanayDesc='';
function getCompanyData(cmpny){
    let companyURL="http://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php?symbol=" + cmpny;
    let companyLocalData= localStorage.getItem("["+cmpny+"]");
    if (companyLocalData==null || companyLocalData=='') {
            // fetching the url
           fetch(companyURL) 
           .then(companyResponse => {
               return companyResponse.json();
            })
            //if data isn't found in localstorage then adds the  data to localstorage 
            .then(companyData => { 
                localStorage.setItem("["+cmpny+"]",JSON.stringify(companyData));   
                companyLocalData = localStorage.getItem("["+cmpny+"]");
                console.log(companyLocalData)
                displayInfo(companyLocalData);
           })
            .catch(function (error) {
                console.log(error)
        });
    } 
    else {
        companyLocalData = localStorage.getItem("["+cmpny+"]"); //Data is found
        displayInfo(companyLocalData);
    }
}
    
// Display the symbol with its logo  
let map ;
let lat ;
let lng;  
function displayInfo(cmpny){   
    companyInfoData=JSON.parse(cmpny);

    document.querySelector("div.a section").style.display = "grid";
    let pic = document.getElementById("pic"); 
    pic.src = './logos/' + ((companyInfoData.symbol != '') ? companyInfoData[0].symbol : companyInfoData.symbol) + '.svg';
    pic.className ='divImg';
    document.getElementById("infoSymbol").innerHTML = companyInfoData[0].symbol // ((companyInfoData.symbol != '') ? companyInfoData[0].symbol : companyInfoData.symbol); 
    document.getElementById("infocompanyName").innerHTML = ((companyInfoData.name != '') ? companyInfoData[0].name : companyInfoData.name);
    document.getElementById("infoexchange").innerHTML = ((companyInfoData.exchange != '') ? companyInfoData[0].exchange : companyInfoData.exchange);
    document.getElementById("infoindustry").innerHTML = ((companyInfoData.subindustry != '') ? companyInfoData[0].subindustry : companyInfoData.subindustry);
    document.getElementById("infoAddress").innerHTML = ((companyInfoData.address != '') ? companyInfoData[0].address : companyInfoData.address);
    document.getElementById("infoDescription").innerHTML = ((companyInfoData.description != '') ? companyInfoData[0].description : companyInfoData.description);
    document.getElementById("infowebsite").innerHTML = ((companyInfoData.website != '') ?  companyInfoData[0].description : companyInfoData.description);
    document.getElementById("infosector").innerHTML = ((companyInfoData.sector != '') ? companyInfoData[0].description : companyInfoData.description) ;
     
    // Display company statictis in Chart box
    document.getElementById("chartCompanySymbol").innerHTML = ((companyInfoData.symbol != '') ? companyInfoData[0].symbol : companyInfoData.symbol); 
    document.getElementById("chartCompanyName").innerHTML =  ((companyInfoData.name != '') ? companyInfoData[0].name : companyInfoData.name);
    document.getElementById("chartCompanyDesc").innerHTML =((companyInfoData.website != '') ?  companyInfoData[0].description : companyInfoData.description);
    selectedCompanayName=((companyInfoData.name != '') ? companyInfoData[0].name : companyInfoData.name);
    selectedCompanayDesc=((companyInfoData.website != '') ?  companyInfoData[0].description : companyInfoData.description);
     
    lat = ((companyInfoData.latitude != '') ? companyInfoData[0].latitude : companyInfoData.latitude);
    lng = ((companyInfoData.longitude != '') ? companyInfoData[0].longitude : companyInfoData.longitude);

    initMap();
    createMarker(map, lat, lng);
    Chart2(companyInfoData)
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

//passing the symbol to the url and see if the data is store  in the localstorage  
function getCompanyDatachart(cmpny){   
    let companychartLocalData=localStorage.getItem(cmpny);
    const companyChartURL="http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=" + cmpny ;
  
    if (companychartLocalData==null || companychartLocalData=='') {
           fetch(companyChartURL)
           .then(companyCResponse => {
               return companyCResponse.json();
            })
            //if data isn't found in localstorage then adding the  data in the localstorage
            .then(companyCData => { 
                if (companyCData.length>0) {
                    localStorage.setItem(cmpny,JSON.stringify(companyCData));
                    companychartLocalData = localStorage.getItem(cmpny);
                }
           })
            .catch(function (error) {
               console.log(error);
        });
    } 
    //If data is found 
    else { 
        companychartLocalData = localStorage.getItem(cmpny);        
    }
    if (companychartLocalData.length>0) {
        displaychartInfo(companychartLocalData);
    }
}
  
// Display the charts statictis 
function displaychartInfo(charts){
    document.querySelector("div.d  section").style.display = "grid";
    document.querySelector("div  #dchart").style.display = "grid";
    document.querySelector("div #btnViewChart").style.display = "grid";
    let companiescharts =[];
    companiescharts=JSON.parse(charts);
    let tbl = document.getElementById('stockData');
    tbl.innerHTML = "";
        
    var tr = document.createElement("tr");
    tbl.appendChild(tr);

    //add data items
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
    var avgClose=0;
    var minClose=0;
    var avgVol=0;
    var totalVol=0;

    //arrays for the charts
    openCalc =[];
    closeCalc =[];
    highCal =[];
    lowCalc =[];
    volumeCalc =[];
    closePrices =[];
    volums =[];
    x = [];

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

    document.getElementById("averageOpen").innerHTML = average(openCalc)
    document.getElementById("minimumOpen").innerHTML = openCalc.slice(-1)[0]
    document.getElementById("maxOpen").innerHTML = openCalc[0]

    document.getElementById("averageClose").innerHTML = average(closeCalc)
    document.getElementById("minimumClose").innerHTML = closeCalc.slice(-1)[0]
    document.getElementById("maxClose").innerHTML = closeCalc[0]

    document.getElementById("averagelow").innerHTML = average(lowCalc)
    document.getElementById("minimumLow").innerHTML = lowCalc.slice(-1)[0]
    document.getElementById("maxLow").innerHTML = lowCalc[0]
    
    document.getElementById("averageHigh").innerHTML = average(highCal)
    document.getElementById("minimumHigh").innerHTML = highCal.slice(-1)[0]
    document.getElementById("maxHigh").innerHTML = highCal[0]

    document.getElementById("averageVolume").innerHTML = average(volumeCalc)
    document.getElementById("minimumVolume").innerHTML = volumeCalc.slice(-1)[0]
    document.getElementById("maxVolume").innerHTML = volumeCalc[0]
    

    for (let i = 0; i < companiescharts.length; i++){
        // adds row
        (i==0) ? minClose=companiescharts[i]['close'] : console.log(''); 
        
        var tr = document.createElement("tr");
        tbl.appendChild(tr);

        //adding data items
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(companiescharts[i]['date']));
        tr.appendChild(td);
        x.push(companiescharts[i]['date']);

        var td = document.createElement("td");
        td.appendChild(document.createTextNode(companiescharts[i]['open']));
        tr.appendChild(td);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(companiescharts[i]['high']));
        tr.appendChild(td);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(companiescharts[i]['low']));
        tr.appendChild(td);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(companiescharts[i]['close']));
        tr.appendChild(td);
        closePrices.push(companiescharts[i]['close']);
        
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(companiescharts[i]['volume']));
        tr.appendChild(td);
        volums.push(companiescharts[i]['volume']/10000);

         avgClose = avgClose + companiescharts[i]['close'];
         (companiescharts[i]['close'] < minClose) ? minClose = companiescharts[i]['close'] : '';
         avgVol = avgVol + companiescharts[i]['volume'];
         totalVol = totalVol + companiescharts[i]['volume'];
    }
    
    //Average, Min close and volume calculation 
    document.getElementById("averageClose").innerHTML = (avgClose/companiescharts.length); 
    document.getElementById("minimumClose").innerHTML = (minClose); 
    document.getElementById("averageVolume").innerHTML = (avgVol/companiescharts.length);
    document.getElementById("totalVolume").innerHTML = (totalVol);
}


function average(nums) {
    return nums.reduce((p,c,_,a) => p + c/a.length,0);
}

// Creating a buttom that change the view of the website 
function displayButtonViewChart() {
    let btnViewChart = document.getElementById("btnViewChart");
    let textbtn = document.createTextNode('View Chart');
    btnViewChart.appendChild(textbtn);
    btnViewChart.style.background = 'grey';
    btnViewChart.style.width = '95px';
    btnViewChart.style.height = '35px';
    btnViewChart.style.borderRadius = "30px"

    btnViewChart.addEventListener('click', function(){
        // when the buttom is clicked it hide a, b,c,d and display e and f
        document.querySelector("div.a ").style.visibility='hidden';
        document.querySelector("div.b ").style.visibility='hidden';
        document.querySelector("div.c ").style.visibility='hidden';
        document.querySelector("div.d ").style.visibility='hidden';
        document.querySelector("div.g ").style.visibility='hidden';
        document.querySelector("div.f ").style.visibility='visible';
        document.querySelector("div.e ").style.visibility='visible';
        document.querySelector("div.e section").style.display = "grid";
        document.querySelector("div.e section").style.display = "block";
        // passing the value to draw the chart
        displayChart(closePrices,volums,x); 
    });
    
}
    
//Having two clicked buttom to speck the content on th screen.    
function displaySpeakButtoms() {
    let BtnCompanyNameSpeak = document.getElementById("BtnCompanyNameSpeak");
    let textbtn = document.createTextNode('Speak');
    BtnCompanyNameSpeak.appendChild(textbtn);
    BtnCompanyNameSpeak.addEventListener("click",function(){
         speakText(selectedCompanayName);
    });
         
    let BtnCompanydescSpeak = document.getElementById("BtnCompanydescSpeak");
    let textbtn2 = document.createTextNode('Speak');
    BtnCompanydescSpeak.appendChild(textbtn2);
    
    BtnCompanydescSpeak.addEventListener("click",function(){
        speakText(selectedCompanayDesc);
    });
}

//Speak functiion     
function speakText(txt){
    let msg = new SpeechSynthesisUtterance();
    msg.text = txt;
    window.speechSynthesis.speak(msg);
}
   
// Displays the volumes, close prices and the date on the chart 
let closePrices =[];
let volums =[];
let x = [];
function displayChart(closePrices,volums,x){
    let dom = document.getElementById("myChart");
    let myChart = echarts.init(dom);
    let app = {};
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
                data: volums,
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

function displayButtonDefaultview() {
    let BtnDefalut = document.getElementById("BtnDefalut");
    let textbtn = document.createTextNode('Close');
    BtnDefalut.appendChild(textbtn);
    BtnDefalut.style.background = 'grey';
    BtnDefalut.style.width = '95px';
    BtnDefalut.style.height = '35px';
    BtnDefalut.style.borderRadius = "30px"
    BtnDefalut.addEventListener('click', function(){
        document.querySelector("div.a ").style.visibility='visible';
        document.querySelector("div.b ").style.visibility='visible';
        document.querySelector("div.c ").style.visibility='visible';
        document.querySelector("div.d ").style.visibility='visible';
        document.querySelector("div.g ").style.visibility='visible';
        document.querySelector("div.f ").style.visibility='hidden';
        document.querySelector("div.e").style.visibility ='hidden';                     
    });
}
});
