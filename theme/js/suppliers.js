/*Email validation code*/
function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,9}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}
/*Email validation code end*/

/*$(document).submit(function(event) {
	event.preventDefault();
	if(document.getElementById('save')){
		$("#save").trigger('click');
	}
	else{
		$("#update").trigger('click');	
	}
});*/

$('#save,#update').on("click",function (e) {
	var base_url=$("#base_url").val();
    /*Initially flag set true*/
    var flag=true;

    function check_field(id)
    {

      if(!$("#"+id).val() ) //Also check Others????
        {

            $('#'+id+'_msg').fadeIn(200).show().html('Required Field').addClass('required');
            //$('#'+id).css({'background-color' : '#E8E2E9'});
            flag=false;
        }
        else
        {
             $('#'+id+'_msg').fadeOut(200).hide();
            // $('#'+id).css({'background-color' : '#FFFFFF'});    //White color
        }
    }


    //Validate Input box or selection box should not be blank or empty
	check_field("supplier_name");
	//check_field("mobile");
	//check_field("state");

    var email=$("#email").val();
    if (email!='' && !validateEmail(email)) {
            $("#email_msg").html("Invalid Email!").show();
             flag=false;
        }
        else{
        	$("#email_msg").html("Invalid Email!").hide();
        }

	if(flag==false)
    {
		toastr["warning"]("มีข้อมูลบางรายการหายไป !")
		return;
    }

    var this_id=this.id;

    if(this_id=="save")  //Save start
    {

					//if(confirm("Do You Wants to Save Record ?")){
						
						e.preventDefault();
						data = new FormData($('#suppliers-form')[0]);//form name
						/*Check XSS Code*/
						if(!xss_validation(data)){ return false; }
						
						$(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
						$("#"+this_id).attr('disabled',true);  //Enable Save or Update button
						$.ajax({
						type: 'POST',
						url: base_url+'suppliers/newsuppliers',
						data: data,
						cache: false,
						contentType: false,
						processData: false,
						success: function(result){
              //alert(result);return;
							if(result=="success")
							{
								//alert("Record Saved Successfully!");
								window.location=base_url+"suppliers";
							}
							else if(result=="failed")
							{
							   toastr['error']("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง ");
							   //	return;
							}
							else
							{
								toastr['error'](result);
							}
							$("#"+this_id).attr('disabled',false);  //Enable Save or Update button
							$(".overlay").remove();
					   }
					   });
			//	}

				//e.preventDefault


    }//Save end
	
	else if(this_id=="update")  //Update start
    {
							
					//if(confirm("Do You Wants to Save Record ?")){
						e.preventDefault();
						data = new FormData($('#suppliers-form')[0]);//form name
						/*Check XSS Code*/
						if(!xss_validation(data)){ return false; }
						
						$(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
						$("#"+this_id).attr('disabled',true);  //Enable Save or Update button
						$.ajax({
						type: 'POST',
						url: base_url+'suppliers/update_suppliers',
						data: data,
						cache: false,
						contentType: false,
						processData: false,
						success: function(result){
              //alert(result);return;
							if(result=="success")
							{
								//toastr["success"]("Record Updated Successfully!");
								window.location=base_url+"suppliers";
							}
							else if(result=="failed")
							{
							   toastr["error"]("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง !");
							}
							else
							{
								 toastr["error"](result);
							}
							$("#"+this_id).attr('disabled',false);  //Enable Save or Update button
							$(".overlay").remove();
							return;
					   }
					   });
			//	}

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
	$.post(base_url+"suppliers/update_status",{id:id,status:status},function(result){
		if(result=="success")
				{
					 toastr["success"]("อัพเดท เรียบร้อย!");
				  //alert("Status Updated Successfully!");
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
				  return false;
				}
				else if(result=="failed"){
					toastr["error"]("ดัพเดทไม่สำเร็จ พยายามอีกครั้ง !");
				  failed.currentTime = 0; 
				  failed.play();

				  return false;
				}
				else{
					toastr['error'](result);
				  failed.currentTime = 0; 
				  failed.play();
				  return false;
				}
	});
}
//update status end


//Delete Record start
function delete_suppliers(q_id)
{
	var base_url=$("#base_url").val();
   if(confirm("Do You Wants to Delete Record ?")){
   	$(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
   $.post(base_url+"suppliers/delete_suppliers",{q_id:q_id},function(result){
   //alert(result);return;
	   if(result=="success")
				{
				  toastr["success"]("ลบข้อมูล เรียบร้อย!");
				  $('#example2').DataTable().ajax.reload();
				}
				else if(result=="failed"){
				  toastr["error"]("ลบไม่สำเร็จ พยายามอีกครั้ง !");
				}
				else{
				  toastr["error"](result);
				}
				$(".overlay").remove();
				return false;
   });
   }//end confirmation
}
//Delete Record end
//Delete Record end
function multi_delete(){
	var base_url=$("#base_url").val();
    var this_id=this.id;
    
		if(confirm("Are you sure ?")){
			$(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
			$("#"+this_id).attr('disabled',true);  //Enable Save or Update button
			
			data = new FormData($('#table_form')[0]);//form name
			$.ajax({
			type: 'POST',
			url: base_url+'suppliers/multi_delete',
			data: data,
			cache: false,
			contentType: false,
			processData: false,
			success: function(result){
				result=result;
  //alert(result);return;
				if(result=="success")
				{
					toastr["success"]("ลบข้อมูล เรียบร้อย !");
					success.currentTime = 0; 
				  	success.play();
					$('#example2').DataTable().ajax.reload();
					$(".delete_btn").hide();
					$(".group_check").prop("checked",false).iCheck('update');
				}
				else if(result=="failed")
				{
				   toastr["error"]("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง !");
				   failed.currentTime = 0; 
				   failed.play();
				}
				else
				{
					toastr["error"](result);
					failed.currentTime = 0; 
				  	failed.play();
				}
				$("#"+this_id).attr('disabled',false);  //Enable Save or Update button
				$(".overlay").remove();
		   }
		   });
	}
	//e.preventDefault
}

function pay_now(supplier_id){

  $.post($("#base_url").val()+'suppliers/show_pay_now_modal', {supplier_id: supplier_id}, function(result) {
    $(".pay_now_modal").html('').html(result);
    //Date picker
    $('.datepicker').datepicker({
      autoclose: true,
    format: 'dd-mm-yyyy',
     todayHighlight: true
    });
    $('#pay_now').modal('toggle');

  });
}
function save_payment(supplier_id){
  var base_url=$("#base_url").val();




    //Initially flag set true
    var flag=true;

    function check_field(id)
    {

      if(!$("#"+id).val() ) //Also check Others????
        {

            $('#'+id+'_msg').fadeIn(200).show().html('Required Field').addClass('required');
           // $('#'+id).css({'background-color' : '#E8E2E9'});
            flag=false;
        }
        else
        {
             $('#'+id+'_msg').fadeOut(200).hide();
             //$('#'+id).css({'background-color' : '#FFFFFF'});    //White color
        }
    }


   //Validate Input box or selection box should not be blank or empty
    check_field("amount");
    check_field("payment_date");


    var payment_date=$("#payment_date").val();
    var amount=$("#amount").val();
    var payment_type=$("#payment_type").val();
    var payment_note=$("#payment_note").val();
    var account_id=$("#account_id").val();

    if(amount == 0){
      toastr["error"]("กรุณาป้อนจำนวนเงินที่ถูกต้อง!");
      return false; 
    }

    if(amount > parseFloat($("#amount").attr('data-due-amt'))){
      toastr["error"](" จำนวนเงินที่ป้อนไม่ควรมากกว่าจำนวนเงินที่ค้างชำระ !");
      return false;
    }

    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    $(".payment_save").attr('disabled',true);  //Enable Save or Update button
    $.post(base_url+'suppliers/save_payment', {account_id:account_id,supplier_id: supplier_id,payment_type:payment_type,amount:amount,payment_date:payment_date,payment_note:payment_note}, function(result) {
      result=result;
  //alert(result);return;
        if(result=="success")
        {
          $('#pay_now').modal('toggle');
          toastr["success"]("บันทึกการชำระเงิน เรียบร้อย!");
          success.currentTime = 0; 
          success.play();
          $('#example2').DataTable().ajax.reload();
        }
        else if(result=="failed")
        {
           toastr["error"]("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง !");
           failed.currentTime = 0; 
           failed.play();
        }
        else
        {
          toastr["error"](result);
          failed.currentTime = 0; 
          failed.play();
        }
        $(".payment_save").attr('disabled',false);  //Enable Save or Update button
        $(".overlay").remove();
    });
}

function pay_return_due(supplier_id){

  $.post($("#base_url").val()+'suppliers/show_pay_return_due_modal', {supplier_id: supplier_id}, function(result) {
    $(".pay_return_due_modal").html('').html(result);
    //Date picker
    $('.datepicker').datepicker({
      autoclose: true,
    format: 'dd-mm-yyyy',
     todayHighlight: true
    });
    $('#pay_return_due').modal('toggle');

  });
}
function save_return_due_payment(supplier_id){
  var base_url=$("#base_url").val();




    //Initially flag set true
    var flag=true;

    function check_field(id)
    {

      if(!$("#"+id).val() ) //Also check Others????
        {

            $('#'+id+'_msg').fadeIn(200).show().html('Required Field').addClass('required');
           // $('#'+id).css({'background-color' : '#E8E2E9'});
            flag=false;
        }
        else
        {
             $('#'+id+'_msg').fadeOut(200).hide();
             //$('#'+id).css({'background-color' : '#FFFFFF'});    //White color
        }
    }


   //Validate Input box or selection box should not be blank or empty
    check_field("return_due_amount");
    check_field("return_due_payment_date");


    var payment_date=$("#return_due_payment_date").val();
    var amount=$("#return_due_amount").val();
    var payment_type=$("#return_due_payment_type").val();
    var payment_note=$("#return_due_payment_note").val();
    var account_id=$("#account_id").val();

    if(amount == 0){
      toastr["error"]("กรุณากรอกจำนวนเงินที่ถูกต้อง !");
      return false; 
    }

    if(amount > parseFloat($("#return_due_amount").attr('data-due-amt'))){
      toastr["error"]("จำนวนเงินที่ป้อนไม่ควรมากกว่าจำนวนเงินที่ค้างชำระ !");
      return false;
    }

    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    $(".payment_save").attr('disabled',true);  //Enable Save or Update button
    $.post(base_url+'suppliers/save_return_due_payment', {account_id:account_id,supplier_id: supplier_id,payment_type:payment_type,amount:amount,payment_date:payment_date,payment_note:payment_note}, function(result) {
      result=result;
  //alert(result);return;
        if(result=="success")
        {
          $('#pay_return_due').modal('toggle');
          toastr["success"]("บันทึกการชำระเงินเรียบร้อย !");
          success.currentTime = 0; 
          success.play();
          $('#example2').DataTable().ajax.reload();
        }
        else if(result=="failed")
        {
           toastr["error"]("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง !");
           failed.currentTime = 0; 
           failed.play();
        }
        else
        {
          toastr["error"](result);
          failed.currentTime = 0; 
          failed.play();
        }
        $(".return_due_payment_save").attr('disabled',false);  //Enable Save or Update button
        $(".overlay").remove();
    });
}
function delete_opening_balance_entry(entry_id){
 if(confirm("Do You Wants to Delete Record ?")){
    var base_url=$("#base_url").val();
    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
   $.post(base_url+"suppliers/delete_opening_balance_entry",{entry_id:entry_id,supplier_id:$("#q_id").val()},function(result){
   //alert(result);//return;
   result=result;
     if(result=="success")
        { 
          location.reload(true);
        }
        else if(result=="failed"){
          toastr["error"]("Failed to Delete .Try again!");
          failed.currentTime = 0; 
          failed.play();
        }
        else{
          toastr["error"](result);
          failed.currentTime = 0; 
          failed.play();
        }
        $(".overlay").remove();
   });
   }//end confirmation   
  }