$(document).ready(function () {

})

function openDoc () {
    getDocs();
}

function closeDoc () {
    $("#saved-documents-container").css("display", "none");
}

function getDocs () {
    fetch(`${BASE_URL}/history`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response => response.json())
    .then(data => {
        if(data.length === 0){
            alert("There is no document")
        }else{
            $("#saved-documents-container").css("display", "flex");
            $(".saved-document-content").empty();
            data.forEach(function(item, i){
                var item = `<a class="saved-document" href="${item.uniqueLink}" target="_blank">
                    <i class="fa fa-solid fa-file-lines"></i>
                    <span>Document ${i + 1}</span>
                </a>`;
                $(".saved-document-content").append(item);
            })   
        }
    })
}