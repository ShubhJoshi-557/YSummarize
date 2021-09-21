let final_url = ""

chrome.runtime.onMessage.addListener(   
    function(request, sender, sendResponse){
        console.log("Hello ! ", request.url);
        if (request.command == "generate"){
            let s1 = "http://127.0.0.1:5000/api/summarize?youtube_url=";
            let final_url = s1.concat(request.url);
            console.log(final_url);
            let xhr = new XMLHttpRequest();
            xhr.open("GET",final_url);
            xhr.send();
            xhr.onload = ()=>{
                console.log(xhr);
                chrome.runtime.sendMessage({txt: xhr.response});
            }
        }
});