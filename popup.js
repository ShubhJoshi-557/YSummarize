document.getElementById("summarize").addEventListener("click", function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var activeTab = tabs[0];
        var div = document.createElement("div");             // Create a <div> element
        div.className = "loader"; 
        div.id = "loader";              // Insert text
        document.getElementById("myDiv").appendChild(div); 
        chrome.tabs.sendMessage(activeTab.id, {command: "generate", url: activeTab.url});
    });
});

chrome.runtime.onMessage.addListener(   
    function(request, sender, sendResponse){
        var loader = document.getElementById("loader");
        loader.remove();
        var para = document.getElementById("summary_para");
        var h1 = document.getElementById("summary_header");
        var hr = document.getElementById("summary_hr");
        if(para){
            para.remove();
            h1.remove();
            hr.remove();
        }
        var para = document.createElement("p");
        var h1 = document.createElement("h1");
        var hr = document.createElement("hr");
        para.id = "summary_para";
        para.className = "para";
        h1.id = "summary_header";
        hr.id = "summary_hr"
        para.innerHTML = request.txt;
        h1.innerHTML = "Summary";
        document.getElementById("myDiv").appendChild(h1);
        document.getElementById("myDiv").appendChild(para);
        document.getElementById("myDiv").appendChild(hr);
        console.log(request.txt);
});