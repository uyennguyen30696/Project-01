var input = document.querySelector('.input')
//  MY ZOMATO API KEY: c61ed7f7b90c2b61c273faede7a9d47c


$('.searchBtn').on('click', function(event) {
    event.preventDefault()
    var searched = input.value
    console.log(searched)

    var queryUrl = "https://developers.zomato.com/api/v2.1/search?q=" + searched + "&user-key=c61ed7f7b90c2b61c273faede7a9d47c"

    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function(response){
        console.log(response)
    })
})