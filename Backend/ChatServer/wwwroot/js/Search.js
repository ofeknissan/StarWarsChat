
$('#searcher').submit(async e => {
    e.preventDefault();
    const searchVal = $('#query').val();
    var resultList = await fetch('/Ratings/Search?query=' + searchVal);
    var resultJson = await resultList.json();
    const injectRes = $('#injectSearchRes').html();
    let result = '';
    for (var listItem in resultJson) {
        let row = injectRes;
        for (var jsonKey in resultJson[listItem]) {
            row = row.replaceAll('{' + jsonKey + '}', resultJson[listItem][jsonKey]);
            row = row.replaceAll('%7B' + jsonKey + '%7D', resultJson[listItem][jsonKey]);
        }
        result += row;
    }
    $('tbody').html(result);
    $(".raiting-score").each(function (index) {
        var fill = "<i class='bi bi-star-fill' ></i>";
        var empty = "<i class='bi bi-star'></i>";
        $(this).html(fill.repeat($(this).text()) + empty.repeat(5 - $(this).text()));
    });

});
