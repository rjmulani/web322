$(document).ready(function () {
    $(document).ready(function () {
        $("input[type='submit']").click(function (event) {
            event.preventDefault();
            let selectedImage = $("input[name='image']:checked").val();
            $(".selected-image").css("display", "block");
            $(".selected-image img").attr("src", "/images/" + selectedImage);
            $(".selected-image img").attr("alt", selectedImage);
        });
    });
});
