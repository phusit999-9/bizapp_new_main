
$('#save,#update').on("click",function (e) {
	var base_url=$("#base_url").val();
    //Initially flag set true
    var flag=true;

    function check_field(id)
    {
      if(!$("#"+id).val() ) //Also check Others????
        {
            $('#'+id+'_msg').fadeIn(200).show().html('Required Field').addClass('required');
            $('#'+id).css({'background-color' : '#E8E2E9'});
            flag=false;
        }
        else
        {
             $('#'+id+'_msg').fadeOut(200).hide();
             $('#'+id).css({'background-color' : '#FFFFFF'});    //White color
        }
    }

    //Validate Input box or selection box should not be blank or empty	
	check_field("template_name");	
	check_field("content");	

	
    if(flag==false)
    {

		toastr["warning"]("มีข้อมูลบางรายการหายไป !")
		return;
    }

    var this_id=this.id;

    if(this_id=="save")  //Save start
    {
					//swal({ title: "Are you sure?",icon: "warning",buttons: true,dangerMode: true,}).then((sure) => {
					  if(confirm("Are you sure ?")) {//confirmation start
						$(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
						$("#"+this_id).attr('disabled',true);  //Enable Save or Update button
						e.preventDefault();
						data = new FormData($('#template-form')[0]);//form name
						$.ajax({
						type: 'POST',
						url: base_url+'templates/newtemplate',
						data: data,
						cache: false,
						contentType: false,
						processData: false,
						success: function(result){
             // alert(result);return;
							if(result=="success")
							{
								//alert("Record Saved Successfully!");
								window.location=base_url+"templates/sms";
								return;
							}
							else if(result=="failed")
							{
								toastr["error"]("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง!");
							   //	return;
							}
							else
							{
								toastr["error"](result);
							}
							$("#"+this_id).attr('disabled',false);  //Enable Save or Update button
							$(".overlay").remove();
					   }
					   });
				} //confirmation sure
			//	}); //confirmation end

				//e.preventDefault


    }//Save end
	
	else if(this_id=="update")  //Save start
    {
				

					//swal({ title: "Are you sure?",icon: "warning",buttons: true,dangerMode: true,}).then((sure) => {
					  if(confirm("Are you sure ?")) {//confirmation start
						$(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
						$("#"+this_id).attr('disabled',true);  //Enable Save or Update button
						e.preventDefault();
						data = new FormData($('#template-form')[0]);//form name
						$.ajax({
						type: 'POST',
						url: base_url+'templates/update_template',
						data: data,
						cache: false,
						contentType: false,
						processData: false,
						success: function(result){
              //alert(result);return;
							if(result=="success")
							{
								//toastr["success"]("Record Updated Successfully!");
								window.location=base_url+"templates/sms";
							}
							else if(result=="failed")
							{
								toastr["error"]("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง !");
							   //alert("Sorry! Failed to save Record.Try again");
							   //	return;
							}
							else
							{
								toastr["error"](result);
							}
							$("#"+this_id).attr('disabled',false);  //Enable Save or Update button
							$(".overlay").remove();
					   }
					   });
				} //confirmation sure
				//}); //confirmation end

				//e.preventDefault


    }//Save end
	

});


//On Enter Move the cursor to desigtation Id
function shift_cursor(kevent,target){

    if(kevent.keyCode==13){
		$("#"+target).focus();
    }
	
}

//update status start
function update_status(id,status)
{
	var base_url=$("#base_url").val();
	
	$.post(base_url+"templates/update_status",{id:id,status:status},function(result){
		if(result=="success")
				{
				  toastr["success"]("อัพเดทข้อมูล เรียบร้อย!");
				  success.currentTime = 0; 
				  success.play();
				  if(status==0)
				  {
					  status="Inactive";
					  var span_class="label label-danger";
					  $("#span_"+id).attr('onclick','update_status('+id+',1)');
				  }
				  else{
					  status="Active";
					   var span_class="label label-success";
					   $("#span_"+id).attr('onclick','update_status('+id+',0)');
					  }

				  $("#span_"+id).attr('class',span_class);
				  $("#span_"+id).html(status);
				 
				}
				else if(result=="failed"){
				  toastr["error"]("อัพเดทไม่สำเร็จ พยายามอีกครั้ง !");
				  failed.currentTime = 0; 
				  failed.play();
				}
				else{
				 toastr["error"](result);
				 failed.currentTime = 0; 
				 failed.play();
				}
				 return false;
	});
}
//update status end

//Delete Record start
function delete_template(q_id)
{
	var base_url=$("#base_url").val();
	if(confirm("Are you sure ?")) {//confirmation start
   //swal({ title: "Are you sure?",icon: "warning",buttons: true,dangerMode: true,}).then((sure) => {
  	//if(sure) {//confirmation start
   	$(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
   $.post(base_url+"templates/delete_template",{q_id:q_id},function(result){
   //alert(result);return;
	   if(result=="success")
				{
					toastr["success"]("ลบข้อมูล เรียบร้อย!");
					$('#example2').DataTable().ajax.reload();
				}
				else if(result=="failed"){
				  	toastr["error"]("ลบไม่สำเร็จ  พยายามอีกครั้ง !");
				}
				else{
					toastr["error"](result);
				}
				$(".overlay").remove();
				return false;
   });
}
  // } //confirmation sure
//  }); //confirmation end
}
//Delete Record end

