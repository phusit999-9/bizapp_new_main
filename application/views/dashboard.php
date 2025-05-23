<!DOCTYPE html>
<html>
<head>
<!-- FORM CSS CODE -->
<?php include"comman/code_css.php"; ?>
<!-- </copy> -->  

</head>
<body class="hold-transition skin-blue sidebar-mini  ">

<div class="wrapper">
  
  
  <?php include"sidebar.php"; ?>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        <?=$page_title;?>
      </h1>     
    </section>
    <div class="row">
    <div class="col-md-12">
      <!-- ********** ALERT MESSAGE START******* -->
       <?php include"comman/code_flashdata.php"; ?>
       <!-- ********** ALERT MESSAGE END******* -->
     </div>
     </div>
      
    <!-- Main content -->
    <section class="content">

      <div class="row">
        <div class="col-md-12">
           <div class="col-md-3 pull-right">
            <?= form_open('dashboard', array('class' => '', 'id' => 'dashboard_form', 'method' => 'post')); ?>
              <!-- Store Code -->
              <?php 
                 echo "<input type='hidden' name='store_id' id='store_id' value='".get_current_store_id()."'>";
                ?>
              <!-- Store Code end -->
              <?= form_close();?>
           </div>
        </div>
      </div>
      <?php if(!is_user() && $CI->permissions('dashboard_info_box_1')){ ?> 
        <div class="row">
            <div class="box-header">      
              <div class="btn-group pull-right">
                <button type="button" title="Today" class="btn btn-default btn-info get_tab_records active">Today</button>
                <button type="button" title="Current Week" class="btn btn-default btn-info get_tab_records">Weekly</button>
                <button type="button" title="Current Month" class="btn btn-default btn-info get_tab_records ">Monthly</button>
                <button type="button" title="Current Year" class="btn btn-default btn-info get_tab_records">Year</button>
                <button type="button" title="All Years" class="btn btn-default btn-info get_tab_records ">All</button>
              </div> 
             </div><br>

             <div class="col-md-3 col-sm-6 col-xs-6">
              <div class="small-box bg-2">
                <div class="inner">
                <p style="font-size: larger;"><?= $this->lang->line('purchase_due'); ?></p>
                <h4 class="purchase_due" style="font-size:x-large;"><?= $CI->currency(0); ?></h4>                
                </div>
          <!--      <div class="icon"><i class="fa fa-cube"></i></div>-->
              </div>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-6">
              <div class="small-box bg-4">
                <div class="inner">
                <p style="font-size: larger;"><?= $this->lang->line('sales_due'); ?></p>
                  <h4 class="sales_due" style="font-size:x-large;"><?= $CI->currency(0); ?></h4>
                
                </div>
           <!--     <div class="icon"><i class="fa fa-calendar-minus-o"></i></div>-->
              </div>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-6">
              <div class="small-box bg-3">
                <div class="inner">
                  <p style="font-size: larger;"><?= $this->lang->line('sales'); ?></p>
               <h4 class="tot_sal_grand_total" style="font-size:x-large;"><?= $CI->currency(0); ?></h4>
              
                </div>
            <!--    <div class="icon"><i class="fa fa-file-o"></i></div>-->
              </div>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-6">
              <div class="small-box bg-1">
                <div class="inner">
                  <p style="font-size: larger;"><?= $this->lang->line('expense'); ?></p>
                  <h4 class="tot_exp" style="font-size:x-large;"><?= $CI->currency(0); ?></h4>
                 
                </div>
            <!--    <div class="icon"><i class="fa fa-minus-square-o"></i></div> -->
              </div>
            </div> 

        </div>     
      <?php } ?>
      

      <?php if(!is_user()){ ?>
      <div class="row">     
        <?php if($CI->permissions('recent_sales_invoice_list')){ ?> 
         <div class="col-md-12">
          <!-- PRODUCT LIST -->
          <div class="box box-primary" style="margin-top:25px;">
            <div class="box-header with-border">
              <h3 class="box-title text-uppercase"><?= $this->lang->line('recentl_sales_invoices'); ?></h3>
            </div>
            <!-- /.box-header -->
            <div class="box-body table-responsive">
                      <table class="table">
                        <tr class=''>
                          <td># No</td>
                          <td><?= $this->lang->line('date'); ?></td>
                          <td><?= $this->lang->line('invoice'); ?></td>
                          <td><?= $this->lang->line('customer'); ?></td>
                          <td><?= $this->lang->line('total'); ?></td>
                          <td><?= $this->lang->line('status'); ?></td>
                          <td><?= $this->lang->line('created_by'); ?></td>
                        </tr>
                        <tbody>
                <?php
                    $i=1;

                    if(!is_admin() && !is_store_admin()){
                      $this->db->where("created_by",$this->session->userdata('inv_username'));  
                    }
                    $this->db->select("*")
                                      ->where("store_id",get_current_store_id())
                                      ->from("db_sales")
                                      ->order_by('id','desc')
                                      ->limit(10);

                    $q5=$this->db->get();
                    if($q5->num_rows() >0){
                      
                      foreach($q5->result() as $res5){
                        ?>
                        <tr>
                          <td><?php echo $i++; ?></td>
                          <td><?php echo show_date($res5->sales_date); ?></td>
                          <td><?php echo $res5->sales_code; ?></td>
                          <td><?php echo get_customer_details($res5->customer_id)->customer_name; ?></td>
                          <td><?php echo $CI->currency($res5->grand_total,$with_comma=true); ?></td>
                          <td><?php echo $res5->payment_status; ?></td>
                          <td><?php echo ucfirst($res5->created_by); ?></td>
                        </tr>
                        
                        <?php
                      }
                    }
                    ?>
                    </tbody>
                    <?php if($CI->session->userdata('inv_userid')==1){ ?> 
                      <tfoot>
                      <tr>
                        <td colspan="3" class="text-center"><a href="<?php echo $base_url; ?>sales" class="uppercase"><?= $this->lang->line('view_all'); ?></a></td>
                      </tr>
                    </tfoot>
                    <?php } ?>
                  </table>
            </div>
            <!-- /.box-body -->
          </div>
          <!-- /.box -->
         </div>        
         <?php } ?>

      </div>
    <?php } ?>



       
      <!-- ############################# GRAPHS ############################## -->
      <?php if(is_admin() && store_module()){ ?>
      <div class="row">
        <div class="col-md-6 animated">
          <div class="box box-primary" style="margin-top:25px;">

            <div class="box-header ">
              <h3 class="box-title"><?= $this->lang->line('stores_details'); ?></h3>
              <div class="btn-group pull-right hide">
                <button type="button" title="Today" class="btn btn-default btn-info get_storewise_details ">Today</button>
                <button type="button" title="Current Week" class="btn btn-default btn-info get_storewise_details">Weekly</button>
                <button type="button" title="Current Month" class="btn btn-default btn-info get_storewise_details ">Monthly</button>
                <button type="button" title="Current Year" class="btn btn-default btn-info get_storewise_details">Yearly</button>
                <button type="button" title="All Years" class="btn btn-default btn-info get_storewise_details active">All</button>
              </div>
            </div>

            <!-- /.box-header -->
            <div class="box-body table-responsive">
              <table id="stores_details" class="table">
                <thead>
                <tr class=''>
                  <th>#</th>
                  <th><?= $this->lang->line('store_name'); ?></th>
                  <th><?= $this->lang->line('total_sales'); ?></th>
                  <th><?= $this->lang->line('total_expense'); ?></th>
                  <th><?= $this->lang->line('sales_due'); ?></th>
                </tr>
                </thead>
                <tbody>
                  <?= $CI->get_storewise_details(); ?>
                </tbody>
                
              </table>
            </div>
            <!-- /.box-body -->
          </div>
          <!-- /.box -->

        </div>
        <!-- /.col (RIGHT) -->

        <div class="col-md-6 animated">
             <!-- PRODUCT LIST -->
             <div class="box box-primary" style="margin-top:25px;">
                <div class="box-header with-border">
                  <h3 class="box-title"><?= $this->lang->line('subcriptions'); ?></h3>

                  <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                  </div>
                </div>
                <!-- /.box-header -->
                <div class="box-body ">
                   <div class="subscription_chart" ></div>
                </div>
                <!-- /.box-body -->
             </div>
             <!-- /.box -->
        </div>
        </div>
        <?php } ?>
        


      
     <div class="box-body table-responsive">    
      <?php if(!is_user() && $CI->permissions('dashboard_pur_sal_chart')){ ?> 
       <div class="col-md-8 animated">
      <!-- BAR CHART -->
          <div class="box box-primary" style="margin-top:25px;">
             <div class="box-header with-border">
              <h3 class="box-title"><?= $this->lang->line('purchase_sales_and_expense_bar_chart'); ?></h3>

              
             </div>
             <div class="box-body">
              <div class="chart">
                <canvas class="bar-chartcanvas"></canvas>
              </div>
            </div>
            <!-- /.box-body -->
          </div>
          <!-- /.box -->
        </div>
       
        <?php if($CI->permissions('dashboard_trending_items_chart')){ ?> 
          <div class="col-md-4 ">
          
             <!-- PRODUCT LIST -->
             <div class="box box-primary" style="margin-top:25px;">
                <div class="box-header with-border">
              <h3 class="box-title text-uppercase"><?= $this->lang->line('top_10_trending_items'); ?></h3>
            </div>
            <div class="box-body">
                <!-- /.box-header -->
                <canvas id="doughnut-chart" width="100%"></canvas>
                <!-- /.box-body -->
              </div>
             </div>
             <!-- /.box -->
             
        </div>
        <?php } ?>
      
        <?php } ?>
        <!-- /.col -->
        
        <!-- /.col -->
     </div>
 

     <div class="row">

        <?php if($CI->permissions('dashboard_stock_alert') && !is_user()) { ?> 
        <div class="col-md-8">
          <div class="box box-primary" style="margin-top:25px;">
            <div class="box-header">
              <h3 class="box-title text-uppercase"><?= $this->lang->line('stock_alert'); ?></h3>
            </div>
            <!-- /.box-header -->
            <div class="box-body table-responsive">
              <table id="example2" class="table table-bordered table-hover">
                <thead>
                <tr class='bg-warning'>
                  <th>#</th>
                  <th><?= $this->lang->line('item_name'); ?></th>
                  <th><?= $this->lang->line('category_name'); ?></th>
                  <th><?= $this->lang->line('brand_name'); ?></th>
                  <th><?= $this->lang->line('stock'); ?></th>
                </tr>
                </thead>
                <tbody>
                </tbody>
                
              </table>
            </div>
            <!-- /.box-body -->
          </div>
          <!-- /.box -->

        </div>
        <!-- /.col (RIGHT) -->
      <?php } ?>


      
      <div class="col-md-4">       
          <div class="box box-primary" style="margin-top:25px;">
             <div class="box-header with-border">
              <h3 class="box-title text-uppercase"><?= $this->lang->line('recently_added_items'); ?></h3>
             </div>          
            <div class="box-body table-responsive ">
                      <table class="table ">
                        <tr class=''>
                          <td>Sl.No</td>
                          <td><?= $this->lang->line('item_name'); ?></td>
                          <td><?= $this->lang->line('item_sales_price'); ?></td>
                        </tr>
                        <tbody>
                <?php
                    $i=1;
                    
                    $this->db->select("item_name,sales_price")
                                      ->where("store_id",get_current_store_id())
                                      ->where("status",1)
                                      ->from("db_items")
                                      ->order_by('id','desc')
                                      ->limit(10);
                                      
                    $q5 = $this->db->get();
                    if($q5->num_rows() >0){
                      
                      foreach($q5->result() as $res5){
                        ?>
                        <tr>
                          <td><?php echo $i++; ?></td>
                          <td><?php echo $res5->item_name; ?></td>
                          <td><?php echo $CI->currency($res5->sales_price,$with_comma=true); ?></td>
                        </tr>
                        
                        <?php
                      }
                    }
                    ?>
                    </tbody>
                    <?php if($CI->session->userdata('inv_userid')==1){ ?> 
                      <tfoot>
                      <tr>
                        <td colspan="3" class="text-center"><a href="<?php echo $base_url; ?>items" class="uppercase"><?= $this->lang->line('view_all'); ?></a></td>
                      </tr>
                    </tfoot>
                    <?php } ?>
                  </table>
            </div>
           
          </div>
         
        </div> 

      </div>


  
      
      <!-- ############################# GRAPHS END############################## -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

  <?php $this->load->view('footer'); ?>
  <!-- Add the sidebar's background. This div must be placed
       immediately after the control sidebar -->
  <div class="control-sidebar-bg"></div>

</div>
<!-- ./wrapper -->

<!-- SOUND CODE -->
<?php include"comman/code_js_sound.php"; ?>
<!-- TABLES CODE -->
<?php include"comman/code_js.php"; ?>
<!-- bootstrap datepicker -->

<!-- ChartJS 1.0.1 -->
<script src="<?php echo $theme_link; ?>plugins/chartjs/Chart.min.js"></script>
<script src="<?php echo $theme_link; ?>plugins/chartjs/chartjs-plugin-colorschemes.min.js"></script>
<script>

  'use strict';

window.chartColors = {
  red: 'rgb(223, 20, 47)',
  orange: 'rgb(231, 97, 63)',
  yellow: 'rgb(230, 184, 0)',
  green: 'rgb(11, 173, 11)',
  blue: 'rgb(0, 0, 230)',
  purple: 'rgb(134, 0, 179)',
  grey: 'rgb(117, 117, 163)'
};

(function(global) {
  var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  var COLORS = [
    '#56D0FC',
    '#f67019',
    '#f53794',
    '#5E88D4',
    '#acc236',
    '#1F8BB9',
    '#18C569',
    '#58595b',
    '#9153C7'
  ];

  var Samples = global.Samples || (global.Samples = {});
  var Color = global.Color;

  Samples.utils = {
    // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    srand: function(seed) {
      this._seed = seed;
    },

    rand: function(min, max) {
      var seed = this._seed;
      min = min === undefined ? 0 : min;
      max = max === undefined ? 1 : max;
      this._seed = (seed * 9301 + 49297) % 233280;
      return min + (this._seed / 233280) * (max - min);
    },

    numbers: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 1;
      var from = cfg.from || [];
      var count = cfg.count || 8;
      var decimals = cfg.decimals || 8;
      var continuity = cfg.continuity || 1;
      var dfactor = Math.pow(10, decimals) || 0;
      var data = [];
      var i, value;

      for (i = 0; i < count; ++i) {
        value = (from[i] || 0) + this.rand(min, max);
        if (this.rand() <= continuity) {
          data.push(Math.round(dfactor * value) / dfactor);
        } else {
          data.push(null);
        }
      }

      return data;
    },

    labels: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 100;
      var count = cfg.count || 8;
      var step = (max - min) / count;
      var decimals = cfg.decimals || 8;
      var dfactor = Math.pow(10, decimals) || 0;
      var prefix = cfg.prefix || '';
      var values = [];
      var i;

      for (i = min; i < max; i += step) {
        values.push(prefix + Math.round(dfactor * i) / dfactor);
      }

      return values;
    },

    months: function(config) {
      var cfg = config || {};
      var count = cfg.count || 12;
      var section = cfg.section;
      var values = [];
      var i, value;

      for (i = 0; i < count; ++i) {
        value = MONTHS[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
      }

      return values;
    },

    color: function(index) {
      return COLORS[index % COLORS.length];
    },

    transparentize: function(color, opacity) {
      var alpha = opacity === undefined ? 0.5 : 1 - opacity;
      return Color(color).alpha(alpha).rgbString();
    }
  };

  // DEPRECATED
  window.randomScalingFactor = function() {
    return Math.round(Samples.utils.rand(-100, 100));
  };

  // INITIALIZATION

  Samples.utils.srand(Date.now());

}(this));

<?php if(is_user()){ ?>
  function createConfig(position) {
      return {
        type: 'line',
        data: {
          labels: [
                "<?=$sub_month[6].'-'.$sub_year[6]?>", 
                "<?=$sub_month[5].'-'.$sub_year[5]?>", 
                "<?=$sub_month[4].'-'.$sub_year[4]?>", 
                "<?=$sub_month[3].'-'.$sub_year[3]?>", 
                "<?=$sub_month[2].'-'.$sub_year[2]?>", 
                "<?=$sub_month[1].'-'.$sub_year[1]?>", 
                "<?=$sub_month[0].'-'.$sub_year[0]?>", 
            ],
          datasets: [{
            label: 'Total Subscriptions',
            borderColor: window.chartColors.red,
            backgroundColor: window.chartColors.red,
            data: [   
                  "<?=$tot_subscribes[6]?>", 
                  "<?=$tot_subscribes[5]?>", 
                  "<?=$tot_subscribes[4]?>", 
                  "<?=$tot_subscribes[3]?>", 
                  "<?=$tot_subscribes[2]?>", 
                  "<?=$tot_subscribes[1]?>", 
                  "<?=$tot_subscribes[0]?>", 
              ],
            fill: false,
          }, /*{
            label: 'My Second dataset',
            borderColor: window.chartColors.blue,
            backgroundColor: window.chartColors.blue,
            data: [7, 49, 46, 13, 25, 30, 22],
            fill: false,
          },*/
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Tooltip Position: ' + position
          },
          tooltips: {
            position: position,
            mode: 'index',
            intersect: false,
          },
        }
      };
    }
    
    window.onload = function() {
      var container = document.querySelector('.subscription_chart');

      ['average'].forEach(function(position) {
        var div = document.createElement('div');
        div.classList.add('chart-container');

        var canvas = document.createElement('canvas');
        div.appendChild(canvas);
        container.appendChild(div);

        var ctx = canvas.getContext('2d');
        var config = createConfig(position);
        new Chart(ctx, config);
      });
    };
<?php } ?>

    //BAR CHART
<?php if(!is_user()){ ?>
    $(function(){

  //get the bar chart canvas
  var ctx = $(".bar-chartcanvas");

  //bar chart data
  var data = {
    labels: [
                "<?=$month[6]?>", 
                "<?=$month[5]?>", 
                "<?=$month[4]?>", 
                "<?=$month[3]?>", 
                "<?=$month[2]?>", 
                "<?=$month[1]?>", 
                "<?=$month[0]?>", 
            ],
    datasets: [
      {
        label: "<?= $this->lang->line('purchase'); ?>",
        data: [   
                  "<?=$purchase[6]?>", 
                  "<?=$purchase[5]?>", 
                  "<?=$purchase[4]?>", 
                  "<?=$purchase[3]?>", 
                  "<?=$purchase[2]?>", 
                  "<?=$purchase[1]?>", 
                  "<?=$purchase[0]?>", 
              ],
        borderColor: window.chartColors.blue,
        backgroundColor: window.chartColors.blue,
        borderWidth: 1
      },
      {
       label: "<?= $this->lang->line('sales'); ?>",
        data: [   
                  "<?=$sales[6]?>", 
                  "<?=$sales[5]?>", 
                  "<?=$sales[4]?>", 
                  "<?=$sales[3]?>", 
                  "<?=$sales[2]?>", 
                  "<?=$sales[1]?>", 
                  "<?=$sales[0]?>", 
              ],
        borderColor: window.chartColors.green,
        backgroundColor: window.chartColors.green,
        borderWidth: 1
      },
      {
        label: "<?= $this->lang->line('expense'); ?>",
        data: [   
                  "<?=$expense[6]?>", 
                  "<?=$expense[5]?>", 
                  "<?=$expense[4]?>", 
                  "<?=$expense[3]?>", 
                  "<?=$expense[2]?>", 
                  "<?=$expense[1]?>", 
                  "<?=$expense[0]?>", 
              ],
        borderColor: window.chartColors.orange,
        backgroundColor: window.chartColors.orange,
        borderWidth: 1
      }
    ]
  };

  //options
  var options = {
    responsive: true,
    title: {
      display: true,
      position: "top",
      fontSize: 18,
      fontColor: "#111"
    },
    legend: {
      display: true,
      position: "top",
      labels: {
        fontColor: "#333",
        fontSize: 16
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0
        }
      }]
    }
  };
  //create Chart class object
  var chart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: options
  });
});


  //PIE CHART
  
  new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: 
              [
                <?php if($tranding_item['tot_rec'] > 0){?>
                    <?php for($i=$tranding_item['tot_rec']; $i>0; $i--){ ?>
                        '<?= $tranding_item[$i]['name'] ?>',
                    <?php } ?>
                <?php } ?>
              ],
      datasets: [
        {
          label: "Top Items",
          backgroundColor: ["#7979FD", "#ff3399","#0BD8A5","#F3F33E","#F89959",""],
          data: [
                <?php if($tranding_item['tot_rec'] > 0){?>
                    <?php for($i=$tranding_item['tot_rec']; $i>0; $i--){ ?>
                        '<?= $tranding_item[$i]['sales_qty'] ?>',
                    <?php } ?>
                <?php } ?>
              ],
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: '<?= $this->lang->line('top_10_trending_items'); ?>'
      }
    }
});
<?php } ?>

  </script>




<!-- Make sidebar menu hughlighter/selector -->
<script>$(".<?php echo basename(__FILE__,'.php');?>-active-li").addClass("active");</script>
<script type="text/javascript">
    var base_url='<?= base_url(); ?>';
    function get_dashboard_values(dates=''){
      var store_id =<?= (isset($store_id)) ? $store_id : get_current_store_id();?>;
      $.post(base_url+"dashboard/dashboard_values",{store_id:store_id,dates:dates},function(result){
          var data = jQuery.parseJSON(result);
          $.each(data, function(index, element) {
                  $("."+index).html(element);
          });
      });
    }

    $("#store_id").on("change",function(){
      //get_dashboard_values();
      $("#dashboard_form").submit();
    });
    jQuery(document).ready(function($) {
      get_dashboard_values('Today');
    });

      $(".get_tab_records").on("click",function(event) {
        $(".get_tab_records").removeClass('active');
        $(this).addClass('active');
        get_dashboard_values($(this).html());
      });


    <?php if(is_admin() && store_module()){ ?>
      $("#stores_details").DataTable();
    <?php } ?>
</script>
<script>
 /* $(function () {
    $('#example3').DataTable({
      "pageLength" : 5,
      "paging": true,
      "lengthChange": false,
      "searching": false,
      "ordering": true,
      "info": true,
      "autoWidth": false
    });
  });*/


 $(document).ready(function() {
    //datatables
   var table = $('#example2').DataTable({ 

      /* FOR EXPORT BUTTONS START*/
  dom:'<"row margin-bottom-12"<"col-sm-12"<"pull-left"l><"pull-right"fr><"pull-right margin-left-10 "B>>>tip',
 /* dom:'<"row"<"col-sm-12"<"pull-left"B><"pull-right">>> <"row margin-bottom-12"<"col-sm-12"<"pull-left"l><"pull-right"fr>>>tip',*/
      buttons: {
        buttons: [
            {
                className: 'btn bg-red color-palette btn-flat hidden delete_btn pull-left',
                text: 'Delete',
                action: function ( e, dt, node, config ) {
                    multi_delete();
                }
            },
          //  { extend: 'copy', className: 'btn bg-teal color-palette btn-flat',exportOptions: { columns: [0,1,2,3,4]} },
            { extend: 'excel', className: 'btn bg-teal color-palette btn-flat',exportOptions: { columns: [0,1,2,3,4]} },
         //   { extend: 'pdf', className: 'btn bg-teal color-palette btn-flat',exportOptions: { columns: [0,1,2,3,4]} },
            { extend: 'print', className: 'btn bg-teal color-palette btn-flat',exportOptions: { columns: [0,1,2,3,4]} },
         //   { extend: 'csv', className: 'btn bg-teal color-palette btn-flat',exportOptions: { columns: [0,1,2,3,4]} },
            { extend: 'colvis', className: 'btn bg-teal color-palette btn-flat',text:'Columns' },  

            ]
        },
        /* FOR EXPORT BUTTONS END */

        "processing": true, //Feature control the processing indicator.
        "serverSide": true, //Feature control DataTables' server-side processing mode.
        "order": [], //Initial no order.
        "responsive": true,
        language: {
            processing: '<div class="text-primary bg-primary" style="position: relative;z-index:100;overflow: visible;">Processing...</div>'
        },
        // Load data for the table's content from an Ajax source
        "ajax": {
            "url": "<?php echo site_url('dashboard/ajax_list')?>",
            "type": "POST",
            
            complete: function (data) {
             },

        },

        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            //"targets": [ 0,4 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        {
            //"targets" :[0],
            //"className": "text-center",
        },
        
        ],
    });
    new $.fn.dataTable.FixedHeader( table );
});

</script>

</body>
</html>
