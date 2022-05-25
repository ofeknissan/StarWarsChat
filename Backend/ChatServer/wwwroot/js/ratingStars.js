$(".raiting-score").each(function (index) {
    var fill = "<i class='bi bi-star-fill' ></i>";
    var empty = "<i class='bi bi-star'></i>";
    $(this).html(fill.repeat($(this).text()) + empty.repeat(5-$(this).text()));
});
