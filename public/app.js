
const loader = document.getElementById("loader")
document.getElementById("btnSearch").addEventListener("click", async () => {

const resultsDiv = document.getElementById("results")

const keyword = document.getElementById("keyword").value;

resultsDiv.innerHTML = '' //clean previous content
loader.classList.remove("hidden") //iniatializes loader before the request is sent

const response = await fetch(`/search?q=${keyword}`)

const data = await response.json().then(loader.classList.add("hidden")) //hides loader after receving the response


if(response.status == 503){
    resultsDiv.innerHTML = `
        <p class="failed">
            Unfortunately Amazon has returned a status code of 503. 
            This usually means amazons has blocked our request due to bot-like activity. These blocks usually last several minutes 
            please try another search or try again later
        </p>
    `
}
else if(keyword === ""){
    resultsDiv.innerHTML = `
        <p class="failed">
            Please use a valid keyword for the search
        </p>
    `
}
else{

    if(data.total == 0){
        resultsDiv.innerHTML = `
        <p class="failed">
            No results found
        </p>
        `
    }
    
    if(response.status == 500){
        resultsDiv.innerHTML = `
        <p class="failed">
            Connection error, please try again later
        </p>
        `
    }

    data.results.forEach(result => {

        const item = document.createElement('div')
        item.classList.add("product_card")

        const words = result.title.split(' ')

        const url = results.productLink;

        if(words.length > 20)
            result.title = words.slice(0,20).join(' ') + "..." //limit number of words in big titles

        item.innerHTML = `
        <a href="https://www.amazon.com${result.productLink}" target="_blank">
        <h3>${result.title}</h3>
        </a>
        <div class="img_wrapper">
            <img src="${result.imgLink}" width="100"/>
        </div>
        <p>Price: ${result.price}</p>
        <p>Rating: ${result.rating} stars - ${result.reviewNumber} reviews</p>
        `;
        resultsDiv.appendChild(item)
    }

    )
}

})