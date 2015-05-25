$(function(){
  $('.del').click(function(){
    var id = $(this).data('id');
    var tr = $(".item-id-"+id);
    $.ajax({
      type: 'DELETE', 
      url: '/admin/movie/list?id=' + id
    })
    .done(function(data){
      if (data.success === 1){
        if(tr.length > 0) {
          tr.remove();
        }
      }
    });
  });


});