
//On Enter Move the cursor to desigtation Id
function shift_cursor(kevent,target){

    if(kevent.keyCode==13){
		$("#"+target).focus();
    }
	
}


$('#save,#update,#create').on("click",function (e) {
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
	  check_field("supplier_id");
    check_field("return_date");
    check_field("return_status");
    //check_field("warehouse_id");
	/*if(!isNaN($("#amount").val()) && parseInt($("#amount").val())==0){
        toastr["error"]("You have entered Payment Amount! <br>Please Select Payment Type!");
        return;
    }*/
	if(flag==false)
	{
		toastr["error"]("มีข้อมูลบางรายการหายไป !");
		return;
	}

	//Atleast one record must be added in purchase table 
    var rowcount=document.getElementById("hidden_rowcount").value;
	var flag1=false;
	for(var n=1;n<=rowcount;n++){
		if($("#td_data_"+n+"_3").val()!=null && $("#td_data_"+n+"_3").val()!=''){
			flag1=true;
		}	
	}
	
    if(flag1==false){
    	toastr["warning"]("โปรดเลือกสินค้า !!");
        $("#item_search").focus();
		return;
    }
    //end

    var tot_subtotal_amt=$("#subtotal_amt").text();
    var other_charges_amt=$("#other_charges_amt").text();//other_charges include tax calcualated amount
    var tot_discount_to_all_amt=$("#discount_to_all_amt").text();
    var tot_round_off_amt=$("#round_off_amt").text();
    var tot_total_amt=$("#total_amt").text();

    var this_id=this.id;
    
			//if(confirm("Do You Wants to Save Record ?")){
				e.preventDefault();
				data = new FormData($('#purchase-form')[0]);//form name
        /*Check XSS Code*/
        if(!xss_validation(data)){ return false; }
        
        $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
        $("#"+this_id).attr('disabled',true);  //Enable Save or Update button
				$.ajax({
				type: 'POST',
				url: base_url+'purchase_return/purchase_save_and_update?command='+this_id+'&rowcount='+rowcount+'&tot_subtotal_amt='+tot_subtotal_amt+'&tot_discount_to_all_amt='+tot_discount_to_all_amt+'&tot_round_off_amt='+tot_round_off_amt+'&tot_total_amt='+tot_total_amt+"&other_charges_amt="+other_charges_amt,
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				success: function(result){
         // alert(result);return;
				result=result.split("<<<###>>>");
					if(result[0]=="success")
					{
						location.href=base_url+"purchase_return/invoice/"+result[1];
					}
					else if(result[0]=="failed")
					{
					   toastr['error']("บันทึกข้อมูลไม่สำเร็จ พยายามอีกครั้ง ");
					}
					else
					{
						alert(result);
					}
					$("#"+this_id).attr('disabled',false);  //Enable Save or Update button
					$(".overlay").remove();

			   }
			   });
		//}
  
});

$("#item_search").bind("paste", function(e){
    $("#item_search").autocomplete('search');
} );

$("#item_search").autocomplete({
    source: function(data, cb){
        $.ajax({
        	autoFocus:true,
            url: $("#base_url").val()+'items/get_json_items_details',
            method: 'GET',
            dataType: 'json',
            /*showHintOnFocus: true,
			autoSelect: true, 
			
			selectInitial :true,*/
			
            data: {
                name: data.term,
                store_id:$("#store_id").val(),
                warehouse_id:$("#warehouse_id").val(),
                search_for:"purchase",
            },
            beforeSend: function() {
                if($("#warehouse_id").val()==''){
                  toastr['warning']("โปรดเลือก คลังเก็บสินค้า !");
                  $("#warehouse_id").select2('open');
                  $("#item_search").removeClass('ui-autocomplete-loading');
                  return;
                }
                $("#item_search").addClass('ui-autocomplete-loading');
            },
            success: function(res){
              //console.log(res);
                var result;
                result = [
                    {
                        //label: 'No Records Found '+data.term,
                        label: 'No Records Found ',
                        value: ''
                    }
                ];

                if (res.length) {
                    result = $.map(res, function(el){
                        return {
                            label: el.item_code +'--'+ el.label +' [STOCK:'+el.stock+']',
                            value: '',
                            id: el.id,
                            item_name: el.value,
                            stock: el.stock,
                            //customer_dob: el.customer_dob,
                            //address: el.address,
                        };
                    });
                }

                cb(result);
            }
        });
    },
        response:function(e,ui){
          if(ui.content.length==1){
            $(this).data('ui-autocomplete')._trigger('select', 'autocompleteselect', ui);
            $(this).autocomplete("close");
          }
          //console.log(ui.content[0].id);
        },
        
        //loader start
        search: function (e, u) {
        },
        select: function (e, ui) {

           if(typeof ui.content!='undefined'){
              if(isNaN(ui.content[0].id)){
                return;
              }
              var stock=ui.content[0].stock;
              var item_id=ui.content[0].id;
            }
            else{
              var stock=ui.item.stock;
              var item_id=ui.item.id;
            }

            if(parseFloat(stock)==0){
              toastr["warning"]("มีเพียง 0 รายการในสต็อก!!");
              return false;
            }

            
              return_row_with_data(item_id);  
            
            $("#item_search").val('');

        },   
        //loader end
});

function check_same_item(item_id){

  if($("#purchase_table tr").length>1){
    var rowcount=$("#hidden_rowcount").val();
    for(i=0;i<=rowcount;i++){
            if($("#tr_item_id_"+i).val()==item_id){
              increment_qty(i);
              failed.currentTime = 0;
              failed.play();
              return false;
            }
      }//end for
  }
  return true;
}

function return_row_with_data(item_id){
  //CHECK SAME ITEM ALREADY EXIST IN ITEMS TABLE 
  var item_check=check_same_item(item_id);
  if(!item_check){return false;}
  //END
  
  /*Check purchase id avaialable or not*/
  if(!document.getElementById("purchase_id")){
    var purchase_id='';
  }else{
    var purchase_id=$("#purchase_id").val()
  }
  /*end*/
  $("#item_search").addClass('ui-autocomplete-loader-center');
	var base_url=$("#base_url").val();
	var rowcount=$("#hidden_rowcount").val();
	$.post(base_url+"purchase_return/return_row_with_data/"+rowcount+"/"+item_id,{purchase_id:purchase_id},function(result){
        //alert(result);
        if(result=='item_not_exist'){
          toastr["error"](" สินค้าชิ้นนี้ไม่มี อยู่ในรายการซื้อนี้ !!");
         
        }
        else{
          $('#purchase_table tbody').append(result);
          $("#hidden_rowcount").val(parseInt(rowcount)+1);
          success.currentTime = 0;
          success.play();
          enable_or_disable_item_discount(); 
        }
        
        $("#item_search").removeClass('ui-autocomplete-loader-center');
    }); 
}
//INCREMENT ITEM
function increment_qty(rowcount){
  var flag = restrict_quantity($("#tr_item_id_"+rowcount).val());
  if(!flag){ return false;}

  var item_qty=$("#td_data_"+rowcount+"_3").val();
  var available_qty=$("#tr_available_qty_"+rowcount+"_13").val();
  //if(parseInt(item_qty)<parseInt(available_qty)){
    item_qty=parseFloat(item_qty)+1;
    $("#td_data_"+rowcount+"_3").val(format_qty(item_qty));
  //}
  calculate_tax(rowcount);
}
//DECREMENT ITEM
function decrement_qty(rowcount){
  var item_qty=parseFloat($("#td_data_"+rowcount+"_3").val());
  if(item_qty<=1){
    $("#td_data_"+rowcount+"_3").val(format_qty(1));
    return;
  }
  $("#td_data_"+rowcount+"_3").val(format_qty(item_qty-1));
  calculate_tax(rowcount);
}

function restrict_quantity(item_id) {
    var rowcount=$("#hidden_rowcount").val();
    var available_qty = 0;
    var count_item_qty = 0;
    var selected_item_id = 0;
      for(i=1;i<=rowcount;i++){
        if(document.getElementById("tr_item_id_"+i)){
          selected_item_id = $("#tr_item_id_"+i).val();
            if(parseInt(item_id)==parseInt(selected_item_id)){
               available_qty = parseFloat($("#tr_available_qty_"+i+"_13").val());
               count_item_qty += parseFloat($("#td_data_"+i+"_3").val());
          }
        }
      }//end for
      
      
      if(available_qty!=0 && count_item_qty>=available_qty){
        toastr["warning"]("Only "+available_qty+" สินค้าในสต็อกเพื่อส่งคืน!!");
        failed.currentTime = 0; 
        failed.play();
        return false;
      }
      return true;
  }

function update_paid_payment_total() {
  var rowcount=$("#paid_amt_tot").attr("data-rowcount");
  var tot=0;
  for(i=1;i<rowcount;i++){
    if(document.getElementById("paid_amt_"+i)){
      tot += parseFloat($("#paid_amt_"+i).html());
    }
  }
  $("#paid_amt_tot").html(to_Fixed(tot));
}
function delete_payment(payment_id){
 if(confirm("Do You Wants to Delete Record ?")){
    var base_url=$("#base_url").val();
    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
   $.post(base_url+"purchase_return/delete_payment",{payment_id:payment_id},function(result){
   //alert(result);return;
   result=result;
     if(result=="success")
        {
          toastr["success"]("ลบข้อมูล เรียบร้อย!");
          $("#payment_row_"+payment_id).remove();
          success.currentTime = 0; 
          success.play();
        }
        else if(result=="failed"){
          toastr["error"]("ลบไม่สำเร็จ พยายามอีกครั้ง!");
          failed.currentTime = 0; 
          failed.play();
        }
        else{
          toastr["error"](result);
          failed.currentTime = 0; 
          failed.play();
        }
        $(".overlay").remove();
        update_paid_payment_total();
   });
   }//end confirmation   
  }

  //Delete Record start
function delete_return(q_id)
{
  var base_url=$("#base_url").val();
   if(confirm("Do You Wants to Delete Record ?")){
    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    $.post(base_url+"purchase_return/delete_return",{q_id:q_id},function(result){
   //alert(result);return;
     if(result=="success")
        {
          toastr["success"]("ลบข้อมูลเรียบร้อย !");
          $('#example2').DataTable().ajax.reload();
        }
        else if(result=="failed"){
          toastr["error"]("ลบไม่สำเร็จ  พยายามอีกครั้ง!");
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
function multi_delete(){
  var base_url=$("#base_url").val();
    var this_id=this.id;
    
    if(confirm("Are you sure ?")){
      data = new FormData($('#table_form')[0]);//form name
      /*Check XSS Code*/
      if(!xss_validation(data)){ return false; }
      
      $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
      $("#"+this_id).attr('disabled',true);  //Enable Save or Update button
      $.ajax({
      type: 'POST',
      url: base_url+'purchase_return/multi_delete',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      success: function(result){
        result=result;
  //alert(result);return;
        if(result=="success")
        {
          toastr["success"]("ลบข้อมูลสำเร็จ !");
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

function pay_now(purchase_id){
  var base_url=$("#base_url").val();
  $.post(base_url+'purchase_return/show_pay_now_modal', {purchase_id: purchase_id}, function(result) {
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
function view_payments(purchase_id){
  var base_url=$("#base_url").val();
  $.post(base_url+'purchase_return/view_payments_modal', {purchase_id: purchase_id}, function(result) {
    $(".view_payments_modal").html('').html(result);
    $('#view_payments_modal').modal('toggle');
  });
}

function save_payment(return_id){
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
    var supplier_id=$("#supplier_id").val();

    if(amount == 0){
      toastr["error"]("กรุณาป้อนจำนวนเงินที่ถูกต้อง !");
      return false; 
    }

    if(amount > parseFloat($("#due_amount_temp").html())){
      toastr["error"]("จำนวนเงินที่ป้อนไม่ควรมากกว่าจำนวนเงินที่ค้างชำระ!");
      return false;
    }

    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    $(".payment_save").attr('disabled',true);  //Enable Save or Update button
    $.post(base_url+'purchase_return/save_payment', {supplier_id:supplier_id,account_id:account_id,return_id: return_id,payment_type:payment_type,amount:amount,payment_date:payment_date,payment_note:payment_note}, function(result) {
      result=result;
  //alert(result);return;
        if(result=="success")
        {
          $('#pay_now').modal('toggle');
          toastr["success"]("บันทึกการชำระเงินเรียบร้อยแล้ว!");
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

function delete_return_payment(payment_id){
 if(confirm("Do You Wants to Delete Record ?")){
    var base_url=$("#base_url").val();
    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
   $.post(base_url+"purchase_return/delete_payment",{payment_id:payment_id},function(result){
   //alert(result);return;
   result=result;
     if(result=="success")
        {
          $('#view_payments_modal').modal('toggle');
          toastr["success"]("ลบข้อมูล เรียบร้อย!");
          success.currentTime = 0; 
          success.play();
          $('#example2').DataTable().ajax.reload();
        }
        else if(result=="failed"){
          toastr["error"]("ลบไม่สำเร็จ  พยายามอีกครั้ง !");
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

  $('#item_search').keypress(function (e) {
 var key = e.which;
 // the enter key code
 if(key == 13){
    $("#item_search").autocomplete('search');
  }
});  