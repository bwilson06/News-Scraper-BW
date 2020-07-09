$("#comment").on("click", function(e){
    console.log('hi')
})

function modal(element) {
   var id = $(element).data('id')
   $(this).attr('article_id', id)
   console.log($(this).attr('article_id'))
   $.get(`/comment/${id}`).then(function(data){
    $('.modal').modal()
    if(data){
        console.log(typeof data)
        if(typeof data == "object"){
            $("#comment_val").val("")
        } else {
            $("#comment_val").val(data)
        }
    }
    console.log(data)
   })
}

function myFunction(element){
    var article_id = $(this).attr('article_id')
    var comment = $('#comment_val').val()
    $.ajax("/comment", {
        type: "POST",
        data: { 
            comment: comment,
            _id: article_id
         },
      }).then(function(data) {
        console.log(data);
      });
    $("#comment_val").val("")
    location.reload();
}