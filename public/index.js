window.onload = function(){
    fetch('/getwxconfig'+'?url='+location.origin+location.pathname)
    .then(function(data){
        console.log("config data:",data);
    })
}