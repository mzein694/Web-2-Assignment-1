let currentSelectedSymbol='';
let selectedCompanayName='';
let selectedCompanayDesc='';
let closePrices =[];
let volums =[];
let x = [];

let map ;
let lat ;
let lng;

window.addEventListener("load",function(){   
    
const url='https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
let allLinks = document.getElementsByTagName("div");    
for (let i = 0; i < allLinks.length-1; i++) {
    let status = allLinks[i].className;
    let spanTag = allLinks[i].firstElementChild;
    if (status=='label'){  
        spanTag.style.display = 'none';
        allLinks[i].addEventListener("mouseover",function(){
            setTimeout(function() {
                spanTag.style.display = 'none';
            }, 5000);
        if (spanTag.style.display == 'none') {
                spanTag.style.display = 'block';
          }
        });
   }
}
 
//check if the load Storge    
let localData;
 
if (localStorage.getItem('companies') == null && localStorage.getItem('companies')!='') {
      fetch(url) //fetching the url and see loadStorge has the JSON  or not 
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
} else {
    localData = localStorage.getItem('companies');
    displayList();
    
}
    
// Enable search on company Symbol
//--------------------------------
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
  
            
//-------------------------------------------------------------------
// Functions definitions
//-------------------------------------------------------------------
function displayList(filter=''){
    let ul = document.getElementById("StockList");
    ul.innerHTML = "";
    
    let companies = [];
    document.querySelector(".b section").style.display = "block";
    companies = JSON.parse(localData);

    // filter if require
    //------------------
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
        lnk.appendChild(linkText);// adding the symbol to the img
        dv.className='myDiv';
        spn.appendChild(lnk);
        dv.appendChild(spn);
        li.appendChild(hr);
        li.appendChild(dv);
        ul.appendChild(li);
        if (companies[i].symbol != null){
                dv.addEventListener('click',function(){
                   // console.log(companies[i].symbol)
                   //console.log(companies[i]);
                    //liClick(companies[i]);
                    getCompanyData(companies[i].symbol);
                    getCompanyDatachart(companies[i].symbol);
                    
                });
        }
    }
    
}   

//Passing the symbol to the url and see if the data is store in the localstorage  
function getCompanyData(cmpny){

 
    let companyURL="https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php?symbol=" + cmpny;
   // console.log(companyURL)
    let companyLocalData= localStorage.getItem("["+cmpny+"]");

    if (companyLocalData==null || companyLocalData=='') {
          
           fetch(companyURL) // fetching the url
           .then(companyResponse => {
               return companyResponse.json();
            })
            .then(companyData => { //if data isn't found in localstorage then adding the  data in the localstorage 
                localStorage.setItem("["+cmpny+"]",JSON.stringify(companyData));   
                companyLocalData = localStorage.getItem("["+cmpny+"]");
                console.log(companyLocalData)
                displayInfo(companyLocalData);
           })
            .catch(function (error) {
                console.log(error)
        });
    } else {
       // console.log(companyLocalData)
        companyLocalData = localStorage.getItem("["+cmpny+"]"); //Data is found
   
        displayInfo(companyLocalData);
    }
    
}
    
// Display the symbol with its logo    
function displayInfo(cmpny){   
    console.log(cmpny)
    companyInfoData=JSON.parse(cmpny);
    console.log(companyInfoData)
    document.querySelector("div.a section").style.display = "grid";
    let imgC = document.getElementById("imgC"); 
    imgC.src = './logos/' + ((companyInfoData.symbol != '') ? companyInfoData[0].symbol : companyInfoData.symbol) + '.svg';
    imgC.className ='divImg';
    document.getElementById("infoSymbol").innerHTML = companyInfoData[0].symbol// ((companyInfoData.symbol != '') ? companyInfoData[0].symbol : companyInfoData.symbol); 
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

     //console.log(companyInfoData)  
     
    lat = ((companyInfoData.latitude != '') ? companyInfoData[0].latitude : companyInfoData.latitude);
    lng = ((companyInfoData.longitude != '') ? companyInfoData[0].longitude : companyInfoData.longitude);

    //console.log(lat + lng)
    initMap();
    createMarker(map, lat, lng);
    
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
            //title: city,
            map: map
        });

    }   


             
function getCompanyDatachart(cmpny){  //passing the symbol to the url and see if the data is store  in the localstorage   
    let companychartLocalData=localStorage.getItem(cmpny);
   
    const companyChartURL="http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=" + cmpny ;
  
    if (companychartLocalData==null || companychartLocalData=='') {
          
           fetch(companyChartURL)
           .then(companyCResponse => {
               return companyCResponse.json();
            })
            .then(companyCData => { //if data isn't found in localstorage then adding the  data in the localstorage
            
                if (companyCData.length>0) {
                    localStorage.setItem(cmpny,JSON.stringify(companyCData));
                    companychartLocalData = localStorage.getItem(cmpny);

                    
                }
           })
            .catch(function (error) {
               console.log(error);
        });
    } else { //Data found
         
        companychartLocalData = localStorage.getItem(cmpny);        
    }
    console.log("Loaded...........");                
    
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
    closePrices =[];
    volums =[];
    x = [];
   
    for (let i = 0; i < companiescharts.length; i++){
     
        // add row
        (i==0) ? minClose=companiescharts[i]['close'] : console.log(''); 
        
        var tr = document.createElement("tr");
        tbl.appendChild(tr);

        //add data items
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
    
    //calculating the information 
    document.getElementById("averageClose").innerHTML = (avgClose/companiescharts.length); 
    document.getElementById("minimumClose").innerHTML = (minClose); 
    document.getElementById("averageVolume").innerHTML = (avgVol/companiescharts.length);
    document.getElementById("totalVolume").innerHTML = (totalVol);
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
                    document.querySelector("div.f ").style.visibility='visible';
                    document.querySelector("div.e ").style.visibility='visible';
                    document.querySelector("div.e section").style.display = "grid";
                    document.querySelector("div.e section").style.display = "block";

                    displayChart(closePrices,volums,x); // passing the value to draw the chart

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

//SpeechSynthesis functiion     
function speakText(txt){

    let msg = new SpeechSynthesisUtterance();

        msg.text = txt;
        window.speechSynthesis.speak(msg);
}
   
// Display the vlums and close prices and the date on the chart 
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
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
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
                document.querySelector("div.f ").style.visibility='hidden';
                document.querySelector("div.e").style.visibility ='hidden';                     
        });
}
    
});