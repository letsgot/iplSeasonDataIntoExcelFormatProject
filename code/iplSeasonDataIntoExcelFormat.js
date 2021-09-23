const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const xlsx = require("xlsx");

let id =  "series/ipl-2018-1131611/"

let url = "https://www.espncricinfo.com/"+id+"match-results";

// console.log(url);

request(url,callback);

let batsmanprofile = [];
let bowlerprofile = [];
// let count = 0;
function callback(err,res,html){
    const $ = cheerio.load(html);
    let anchortagsmatches = $("[data-hover=Scorecard]");

    // console.log(anchortagsmatches.length);

    for(let i=0;i<anchortagsmatches.length;i++){
        let scorecardUrl = $(anchortagsmatches[i]).attr("href");
        scorecardUrl = "https://www.espncricinfo.com/" + scorecardUrl;
        // console.log(scorecardUrl);
        // request(scorecardUrl,fetchtable);
        
        request(scorecardUrl,cb1.bind(this,i));
        request(scorecardUrl,cb2.bind(this,i));
        request(scorecardUrl,cb3.bind(this,i));
        request(scorecardUrl,cb4.bind(this,i));
    }
}


async function cb1(index,err,res,html){
    const $ = cheerio.load(html);
    let playerobjects = $("table.table.batsman tbody tr a");
    // console.log(playerobjects.length);
    
    let inningsec = $("table.table.batsman");
    inningsec = $(inningsec[0]).find("tbody a.small");
    console.log(inningsec.length);
    for(let i =0;i<inningsec.length;i++){
        // console.log(i);
       batsmanprofile.push({
         name : $($("table.table.batsman tbody tr a.small")[i]).text(),
         url : "https://www.espncricinfo.com/" + $($("table.table.batsman tbody tr a")[i]).attr("href"),
         runScored : $($("table.table.batsman tbody tr:not(.extras) td.font-weight-bold")[i]).text(),
         bowlPlayed : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(4)")[i]).text(),
         "No of 4_s" : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(6)")[i]).text(),
         "No of 6_s" : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(7)")[i]).text(),
         "Strike Rate" : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(8)")[i]).text()
       });
       

    }
    let extras = $(".text-right.font-weight-bold");
    extras = $(extras[0]).text();
    // console.log(extras);

    let secondTotal = $(".text-right.font-weight-bold");
    secondTotal = $(secondTotal[1]).text();
    // console.log(secondTotal);
    let venue = $(".description");
    let venue1 = $(venue[0]).text().split(",");
    venue = venue1[1];
    let date = venue1[2];
    // console.log(venue);
    // console.log(date);
    batsmanprofile.push({
        "Extras" : extras,
        "Total" : secondTotal,
        "Venue" : venue,
        "Date" : date
    })
    index = index + ".1"
    let filename = $("h5.header-title.label");
    filename = $(filename[0]).text().split("INNINGS");
    // console.log(filename);
    filename = filename[0];
    let match = $(".description");
    match = $(match[0]).text().split(" ");
    match = match[0] + match[1];
    // console.log(match);
    // await fs.writeFileSync(`${match}1stInning${filename}.json`,JSON.stringify(batsmanprofile));
    // batsmanprofile.pop();
    

    let newwb = xlsx.utils.book_new();

    let newws = xlsx.utils.json_to_sheet(batsmanprofile);

    xlsx.utils.book_append_sheet(newwb,newws,`sheet ${match}.1`);

    xlsx.writeFile(newwb,`${match}1stInningBatsman${filename}.xlsx`);

    while(batsmanprofile.length!=0){
        batsmanprofile.pop();
    }
}   
   
async function cb2(index,err,res,html){
    const $ = cheerio.load(html);
    let playerobjects = $("table.table.bowler tbody tr a");
    // console.log(playerobjects.length);
    let inningsec = $("table.table.bowler");
    inningsec = $(inningsec[0]).find(".text-nowrap");
    console.log(inningsec.length);
     

    for(let i =0;i<inningsec.length;i++){
        console.log(i);
       bowlerprofile.push({
         name : $($("table.table.bowler tbody tr a.small")[i]).text(),
         url : "https://www.espncricinfo.com/" + $($("table.table.bowler tbody tr a")[i]).attr("href"),
         Over : $($(".table.bowler tbody tr td:nth-child(2)")[i]).text(),
          Maiden : $($(".table.bowler tbody tr td:nth-child(3)")[i]).text(),
          Runs : $($(".table.bowler tbody tr td:nth-child(4)")[i]).text(),
          Wicket : $($(".table.bowler tbody tr td:nth-child(5)")[i]).text(),
          Economy : $($(".table.bowler tbody tr td:nth-child(6)")[i]).text(),
          "No of 0's" : $($(".table.bowler tbody tr td:nth-child(7)")[i]).text(),
          "No of 0's" : $($(".table.bowler tbody tr td:nth-child(8)")[i]).text(),
          "No of 0's" : $($(".table.bowler tbody tr td:nth-child(9)")[i]).text(),
          Wide : $($(".table.bowler tbody tr td:nth-child(10)")[i]).text(),
         "No ball" : $($(".table.bowler tbody tr td:nth-child(11)")[i]).text(),
       });
    }

    let venue = $(".description");
    let venue1 = $(venue[0]).text().split(",");
    venue = venue1[1];
    let date = venue1[2];
    // console.log(venue);
    // console.log(date);
    bowlerprofile.push({
        "Venue" : venue,
        "Date" : date
    })

    let filename = $("h5.header-title.label");
    filename = $(filename[0]).text().split("INNINGS");
    // console.log(filename);
    filename = filename[0];
    let match = $(".description");
    match = $(match[0]).text().split(" ");
    match = match[0] + match[1];
    // console.log(match);
    // await fs.writeFileSync(`${match}1stInningBowler${filename}.json`,JSON.stringify(bowlerprofile));
    
    let newwb = xlsx.utils.book_new();

    let newws = xlsx.utils.json_to_sheet(bowlerprofile);

    xlsx.utils.book_append_sheet(newwb,newws,`sheet ${match}.2`);

    xlsx.writeFile(newwb,`${match}1stInningBowler${filename}.xlsx`);  
  
    while(bowlerprofile.length!=0){
        bowlerprofile.pop();
    }
}   
   

async function cb3(index,err,res,html){
    const $ = cheerio.load(html);
    let playerobjects = $("table.table.batsman tbody tr a");
    // console.log(playerobjects.length);
    
    let inningsec = $("table.table.batsman");
    inningsec = $(inningsec[0]).find("tbody a.small");
    // console.log(inningsec.length);
    for(let i =inningsec.length;i<playerobjects.length;i++){
       batsmanprofile.push({
         name : $($("table.table.batsman tbody tr a.small")[i]).text(),
         url : "https://www.espncricinfo.com/" + $($("table.table.batsman tbody tr a")[i]).attr("href"),
         runScored : $($("table.table.batsman tbody tr:not(.extras) td.font-weight-bold")[i]).text(),
         bowlPlayed : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(4)")[i]).text(),
         "No of 4_s" : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(6)")[i]).text(),
         "No of 6_s" : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(7)")[i]).text(),
         "Strike Rate" : $($("table.table.batsman tbody tr:not(.extras) td:nth-child(8)")[i]).text()
       });
       

    }
    let extras = $(".text-right.font-weight-bold");
    extras = $(extras[2]).text();
    // console.log(extras);
    let secondTotal = $(".text-right.font-weight-bold");
    secondTotal = $(secondTotal[3]).text();
    // console.log(secondTotal);
    let venue = $(".description");
    let venue1 = $(venue[0]).text().split(",");
    venue = venue1[1];
    let date = venue1[2];
    // console.log(venue);
    // console.log(date);
    batsmanprofile.push({
        "Extras" : extras,
        "Total" : secondTotal,
        "Venue" : venue,
        "Date" : date
    })
    let filename = $("h5.header-title.label");
    filename = $(filename[1]).text().split("INNINGS");
    // console.log(filename);
    filename = filename[0];
    let match = $(".description");
    match = $(match[0]).text().split(" ");
    
    match = match[0] + match[1];
    // console.log(match);
    index = index + ".3"

    let newwb = xlsx.utils.book_new();

    let newws = xlsx.utils.json_to_sheet(batsmanprofile);

    xlsx.utils.book_append_sheet(newwb,newws,`sheet ${match}.3`);

    xlsx.writeFile(newwb,`${match}2ndInning${filename}.xlsx`);
    // await fs.writeFileSync(`${match}2ndInning${filename}.json`,JSON.stringify(batsmanprofile));
    // batsmanprofile.pop();

    while(batsmanprofile.length!=0){
        batsmanprofile.pop();
    }
}   
   
  
async function cb4(index,err,res,html){
    const $ = cheerio.load(html);
    let playerobjects = $("table.table.bowler tbody tr a");
    // console.log(playerobjects.length);
    let inningsec = $("table.table.bowler");
    inningsec = $(inningsec[0]).find(".text-nowrap");
    // console.log(inningsec.length);
     

    for(let i =inningsec.length;i<playerobjects.length;i++){
        // console.log(i);
       bowlerprofile.push({
         name : $($("table.table.bowler tbody tr a.small")[i]).text(),
         url : "https://www.espncricinfo.com/" + $($("table.table.bowler tbody tr a")[i]).attr("href"),
         Over : $($(".table.bowler tbody tr td:nth-child(2)")[i]).text(),
          Maiden : $($(".table.bowler tbody tr td:nth-child(3)")[i]).text(),
          Runs : $($(".table.bowler tbody tr td:nth-child(4)")[i]).text(),
          Wicket : $($(".table.bowler tbody tr td:nth-child(5)")[i]).text(),
          Economy : $($(".table.bowler tbody tr td:nth-child(6)")[i]).text(),
          "No of 0's" : $($(".table.bowler tbody tr td:nth-child(7)")[i]).text(),
          "No of 0's" : $($(".table.bowler tbody tr td:nth-child(8)")[i]).text(),
          "No of 0's" : $($(".table.bowler tbody tr td:nth-child(9)")[i]).text(),
          Wide : $($(".table.bowler tbody tr td:nth-child(10)")[i]).text(),
         "No ball" : $($(".table.bowler tbody tr td:nth-child(11)")[i]).text(),
       });
    }

    let venue = $(".description");
    let venue1 = $(venue[0]).text().split(",");
    venue = venue1[1];
    let date = venue1[2];
    // console.log(venue);
    // console.log(date);
    bowlerprofile.push({
        "Venue" : venue,
        "Date" : date
    })

    let filename = $("h5.header-title.label");
    filename = $(filename[0]).text().split("INNINGS");
    // console.log(filename);
    filename = filename[0];
    let match = $(".description");
    match = $(match[0]).text().split(" ");
    match = match[0] + match[1];
    // console.log(match);
    // await fs.writeFileSync(`${match}-2ndInning-Bowler-${filename}.json`,JSON.stringify(bowlerprofile));
    let newwb = xlsx.utils.book_new();

    let newws = xlsx.utils.json_to_sheet(bowlerprofile);

    xlsx.utils.book_append_sheet(newwb,newws,`sheet ${match}.4`);

    xlsx.writeFile(newwb,`${match}2ndInningBowler${filename}.xlsx`);  
  

    while(bowlerprofile.length!=0){
        bowlerprofile.pop();
    }
}  


