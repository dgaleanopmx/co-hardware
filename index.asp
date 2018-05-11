<%@LANGUAGE="VBSCRIPT" CODEPAGE=65001%><% Response.CharSet = "utf-8" %><% 
Response.AddHeader "Content-Type", "text/html;charset=UTF-8"
	pagename = "index.asp"
	%><!--#INCLUDE FILE = "includes/set.asp" --><%
	pagetitle = "Programa de reciclaje de computadores y periféricos"
	
	pagetagline = ""
%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="<%=HTMLEncode(Session("la"))%>-<%=HTMLEncode(Session("cc"))%>" xml:lang="<%=HTMLEncode(Session("la"))%>-<%=HTMLEncode(Session("cc"))%>">
<head>

	<title>Reciclaje de computadores</title>
	
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
    <meta content="text/javascript" http-equiv="Content-Script-Type"/>
    <meta content="text/css" http-equiv="Content-Style-Type"/>
    <!--<meta content="IE=7" http-equiv="X-UA-Compatible"/>-->
    <meta content="Shared" name="bu" />
    <meta content="applied_use" name="lifecycle" />
    <meta content="<%=HTMLEncode(Session("cc"))%>" name="target_country" />
	<meta name="web_section_id" content="R2612">
    <meta content="hpcleansheetnontridion" name="hp_design_version" />
	<meta name="page_content" content="Solutions">
	<meta name="segment" content="hho">
	<meta name="user_type" content="any">
	<meta name="product_service_name" content="EC">
	<meta name="lifecycle" content="applied_use">
	<meta name="Keywords" content="">
	<meta name="Description" content="">
	<meta content="follow, index" name="robots" />
    <meta content="All" name="product_service_name" />
    <meta content="Consumer" name="user_profile" />
    <meta content="Products" name="page_content"/> 
	<!-- END METADATA -->
    <link href="http://www8.hp.com/us/en/images/i/favicon.ico" rel="shortcut icon" type="image/x-icon"/>
    <!-- BEGIN STYLES -->
    
    
    <!--hpe-->

<link href="system/styles/hps-euro-fontface-core.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/ui-core-min-v2-hpe.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/molecules.css" media="screen" rel="stylesheet" type="text/css"/>
<!--<script src="scripts/external/mootools-core-1.4.5-full-compat.js" type="text/javascript"></script>
<script src="scripts/external/mootools-more-1.4.0.1.js" type="text/javascript"></script>-->

<link href="system/styles/service/index.css" media="screen" rel="stylesheet" type="text/css"/>

<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/layout-grid-studio.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/buttons.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/icons.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/link-lists.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/video.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/lightbox.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/table-sortable.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/typography.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/typography-margins.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/divider.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/tooltip.css">
<link type="text/css" rel="stylesheet" media="screen" href="system/styles/patterns/prog-disc.css">



<!--[if IE]>
<link href="system/styles/molecules-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/patterns/video-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="system/styles/patterns/lightbox-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<![endif]-->
<!--[if IE 6]>
<script src="scripts/common/common-ie6.js" type="text/javascript">//</script>
<![endif]-->
    <!--/hpe-->
    
    <!--<link href="styles/hf-core.css" media="screen" type="text/css" rel="stylesheet"/>
	<link href="styles/cs1.1.css" media="screen" rel="stylesheet" type="text/css"/>-->
	<!--<link href="styles/hpe-fonts.css" media="screen" rel="stylesheet" type="text/css"/>-->
	<link href="styles/append-hpe.css" media="screen" rel="stylesheet" type="text/css"/>
	<link href="styles/printing.css" media="print" rel="stylesheet" type="text/css"/>
    
    <!-- END STYLES -->
    <!-- BEGIN JAVASCRIPT -->
    <!-- BEGIN HEADER/FOOTER WEB SERVICE -->
		<script type="text/javascript" src="<%=tridionhost%>/ww/en/scripts/framework/mootools/v-1-4/mootools-core-compat.js"></script>
		<script type="text/javascript" src="<%=tridionhost%>/ww/en/scripts/framework/mootools/v-1-4/mootools-more-full-compat.js"></script>
		<script type="text/javascript" src="<%=tridionhost%>/ww/en/scripts/caas-hf-v2.0/caas-loader-v2.0-m.js"></script>
        
		<!-- END HEADER/FOOTER WEB SERVICE -->
		<!--<script src="scripts/utilities-core-hpe.js" type="text/javascript"></script>-->
		<script src="scripts/iframe_standard.js" type="text/javascript"></script>
		<!--<script src="scripts/cs1.1.js" type="text/javascript"></script>-->
		<!--<script src="scripts/append.js" type="text/javascript"></script>-->
		<!--<script src="<%=hphost%>/country/js/hpweb_syn_con.js" type="text/javascript"></script>-->
		<script src="<%=tridionhost%>/us/en/scripts/social_functions.js" type="text/javascript" xml:space="preserve"></script>
		<!--[if IE 6]>	
		<script src="scripts/png.js" type="text/javascript" charset="utf-8">//</script>		
		<script type="text/javascript">
				DD_belatedPNG.fix('.png');
		</script>
		<![endif]-->
	<script type="text/javascript">
var hp = {};
</script>
    <script src="scripts/common/ui-core-min.js" type="text/javascript"></script>
    <script src="scripts/common/animated-container.js" type="text/javascript"></script>
    <script src="scripts/common/selectable.js" type="text/javascript"></script>
   
    <script src="scripts/common/custom-popup.js" type="text/javascript"></script>
    <script src="scripts/common/under-layed-popup.js" type="text/javascript"></script>
    <script src="scripts/molecules/video-poster.js" type="text/javascript"></script>
    <script src="scripts/common/customPopup.js" type="text/javascript"></script>
    <script src="scripts/molecules/tooltips.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/molecules/prog-disc.js">//</script>

    <!--<script src="scripts/append-hpe.js" type="text/javascript"></script>-->
<!--[if IE]>
<link href="system/styles/molecules-ie.css" media="screen" rel="stylesheet" type="text/css"/>
<![endif]-->
<!--[if IE 6]>
<script src="scripts/common/common-ie6.js" type="text/javascript">//</script>
<![endif]-->

    <script charset="utf-8" type="text/javascript" xml:space="preserve">
      //var searchTxt = 'Keyword';
      var templateType='no_toolbar';

      var wip=true; //temporary flag to enable or disable js functionality (for different sprints), true to disable functionality
      var agt=navigator.userAgent.toLowerCase();
      var is_ie= (agt.indexOf("msie") != -1);
			var defaultSegment = 'HHO';
			//var segment_ck="SMB";
			var hpAbsDir = '/<%=HTMLEncode(Session("cc"))%>/<%=HTMLEncode(Session("la"))%>/';
			var rtl=false;
	
    </script>
    <!-- END JAVASCRIPT -->
<!--#INCLUDE FILE = "includes/head-hpe.asp" -->
</head>

<body>
   <script language="javascript" type="text/javascript">
if(window.hpmmd==null){hpmmd={type:"Cleansheet Wash" , page:{},product:{},user:{},promo:{},legacy:{}}};
hpmmd.page.name="site:hardware recycle|<%=HTMLEncode(Session("cc"))%>|<%=HTMLEncode(Session("la"))%><%if Session("segment") <> "" then response.Write("|"+Session("segment"))%> : <%= pagename %>";
hpmmd.page ['section']="r2612";
hpmmd.page.sectiontaxonomy="/recycle/ereturns";
hpmmd.page.lifecycle="";
hpmmd.page.events=new Array("");
try { hpmmd.user.ip=(function(){var a='67.50.179.194';if(a.indexOf("<")==0||a.length<7){var b='67.50.179.194';var c='15.192.0.123';a=(b.indexOf("<")==0||b.length<7)?c:b}return a})(); } catch(err) {hpmmd.user.ip='127.0.0.1';}
try { hpmmd.page.server='g5t0352.atlanta.hp.com'; } catch(err) {hpmmd.page.server=window.location.hostname;}
hpmmd.version='20110329A';

      (function() {
    var ref = document.getElementsByTagName('script')[0],
        scriptNode = document.createElement('script');
    scriptNode.type = 'text/javascript';
    scriptNode.src = '//nexus.ensighten.com/hp/hpcom_prod/Bootstrap.js';
    ref.parentNode.insertBefore(scriptNode, ref);
}());
</script>
<!-- BEGIN EVERYTHING -->
   <div class="everything" id="everything">
<!--#INCLUDE FILE = "includes/topnav-hpe.asp" -->
<!-- BEGIN BODY -->
      <div class="body" id="body">
        <div class="holder">
          <!-- //////////////////////////////////////////////////////////////////////////////////////// BEGIN CONTENT AREA ///////////////////////////////////////////////////////////////////////////-->
         <div id="breadcrumbs" style="display:none;">
            <ul>
              <li class="bc_section_heading"><a href="index-hpe.asp<%=link_cc()%>">Home</a></li>
              <li><a href=""></a></li>
              <!--<li class="bc_current_page">L3 Page</li>-->
            </ul>
          </div>  

        <div class="title_area"> 
          <h1><%=pagetitle %></h1>
          
          
          
          <div class="share_section" >
            
           
        </div>
        </div>

    <div id="content_section">
    
            <div id="rails_bg_container" class="double_rail png">
	
<div id="main_column" class="white">
                
				<div class="lay_100 m_top_55 lft">
                <img src="images/home-hero.png" height="275" width="1000" alt="" />
                <div class="home_hero_head">HP Planet Partners Colombia</div>
                <div class="home_hero_sub">HP te provee alternativas libres de costo para el reciclaje de computadores y periféricos.</div>
                
                </div>
                
                <div class="lay_66_33 m_top_0 lft wth_1000 mb0">
                	<div class="left video-thumbnail">
                    	<img src="images/co_map.png" height="900" width="666" alt="" />
                    	<!--<div id="city_target"><span class="tooltip_main"><a class="link_icn" rel="" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;</a>  
                        	<div class="tooltip tooltip_top " style="width: 330px;">
                            	<div class="tooltip_text ">
                                Seleccione su ciudad para encontrar tiendas de HP que están participando en los programas de reciclaje de computadores y periféricos y cartuchos vacíos Originales de tóner HP LaserJet

                                </div>
                                <div class="tooltip_corner"></div>
                            </div>
                            </span>
                         </div>
                         <div id="baranquilla_target"><a class="js_overlay_trigger" rel="v1" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>
                         <div id="monteria_target"><a class="js_overlay_trigger" rel="v7" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>
                         <div id="bucaramanga_target"><a class="js_overlay_trigger" rel="v8" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>
                        <div id="medellin_target"><a class="js_overlay_trigger" rel="v2" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>
                        <div id="bogota_target"><a class="js_overlay_trigger" rel="v3" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>
                        <div id="cali_target"><a class="js_overlay_trigger" rel="v4" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>
                        <div id="not_target"><span class="tooltip_main"><a class="link_icn" rel="" href="javascript:void(0)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>  
                        	<div class="tooltip tooltip_top " style="width: 330px;">
                            	<div class="tooltip_text ">
                                Este mapa muestra las tiendas de HP que están participando actualmente en nuestro sistema de reciclaje.<br /><br />

Si usted no ve su ciudad en el mapa, el sistema aún no se ha expandido a una tienda de HP en su área.<br /><br />

Tambien ofrecemos servicios de <a href="http://www.hp.com/co/go/recompra">Devoluccion Directa</a> en todo el pais.

                                </div>
                                <div class="tooltip_corner"></div>
                            </div>
                            </span>
                         </div>-->
                        
                    </div>
                    <div class="right ">
                    	<div class="cnt_area">
                        
                        <div class="m20">
                        <div class="m10"><div class="fontH4">Opciones para equipos personales</div></div>
                        <ul><li><a class="js_overlay_trigger" rel="v5" href="javascript:void(0)">Programa de reciclaje</a></li>
                        <li><a class="" href="http://www.hp.com/co/go/recompra">Programa de Devolución Directa y Recompras</a></li>
                        </ul>
                   		</div>
                        
                        <div class="divider_black divider_bottom m20"></div>
                        
                        <div class="m20">
                        <div class="m10"><div class="fontH4">Reciclaje para otros productos</div></div>
                        <a class="" href="http://www.hp.com/latam/co/reciclar/index.html">Reciclado de cartuchos</a>
                        </div>
                        
                        <div class="divider_black divider_bottom m20"></div>
                        
                        <div class="m20">
                        <div class="m10"><div class="fontH4">Opciones de reciclaje para negocios</div></div>
                        <ul><li><a class="js_overlay_trigger" rel="v5" href="javascript:void(0)">Pymes y clientes comerciales</a></li>
                        <li><a class="" href="http://hpla.tradeups.com/Customers/86/GetQuote.aspx?promo=HPLAColumbiaStd&outletid=">Programa de Recompra</a></li>
                        </ul>
                        
                        </div>
                        
                        <div class="divider_black divider_bottom m20"></div>
                        
                        <div class="m20">
                        <div class="m10"><div class="fontH4">Mas información</div></div>
                        <ul><!--<li><a class="" href="">Folletos</a></li>-->
                        <li><a class="" href="http://www.hp.com/go/report">Global citizenship report</a></li>
                        <li><a class="" href="http://www8.hp.com/co/es/home.html">Comprar productos y servicios HP</a></li>
                        </ul>
                        </div>
                        <div class="divider_black divider_bottom m20"></div>
                        <div class="m20">
                        <div class="m10"><div class="fontH4">Folletos</div></div>
                        <ul>
                        <li><a class="" href="http://www8.hp.com/h20195/V2/GetDocument.aspx?docname=4AA4-4520SPA">Una forma segura y responsable de retirar TI</a></li>
                        <li><a class="" href="HP%20Colombia%20S.A.S.%20Brochure%20(003).pdf" target="_blank">Guía Instructive de cómo funciona HP Planet Partners para suministros y cómputo</a></li>
                        </ul>                      
                        
                        </div>
                    </div>
                </div>
                
               
				<div class="content_block clf">
					&nbsp;
           		</div>
          	
			
            
		
              
            </div>
          </div>
          

          <!-- //////////////////////////////////////////////////////////////////////////////////////// END CONTENT AREA ///////////////////////////////////////////////////////////////////////////-->
          <div class="body_right"> </div>
        </div>
      </div></div>
      <!-- END BODY -->
<!--#INCLUDE FILE = "includes/botnav-hpe.asp" -->
<script type="text/javascript">
document.addEvent('domready', function() {
//dynamically generated from used molecules
initTooltip(".tooltip",".icb_hlp");
initTooltip(".tooltip",".inline"); 
initUnderLayedPopup(null, null, {closeIfClickOnDarkenLayer: true});
initVideoPoster("js_video_trigger","js-video-poster");
hp.ProgressiveDisclosure.init(); 
});

</script>

<div class="pop_cnt overlay_popup eb-video-popup" id="v1" style="width: 600px;"><div class="cl_box"><a class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20">
Barranquilla
<div class="fontH4">Tiendas participantes</div>

<div class="js_prog_disc"><div class="left"><div class="prog_disc_icn"><div class="prog-desc-toggle-all"><a href="javascript: void(0);" class="js_prg_dsc_exp lnh16 nud " title="expand all" tabindex="250"><span class="icn_pls_drk">&nbsp;</span></a><a href="javascript: void(0);" class="js_prg_dsc_clp lnh16 nud disabled" title="collapse all" tabindex="250"><span class="icn_mns_drk">&nbsp;</span></a></div></div>
			
            <dl class="js_prg_dsc_prd_root prg_dsc_prd prog-disc">
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">1. HP Store  ACCESAR </span><span class="screenReading">1. HP Store  ACCESAR </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Calle 76 No. 47-26<br />
Teléfono: 3680368 Ext 105<br />
Correo electronico: afernadez@accesar.com/ centrosol1@accesar.com<br />
Horario: Lunes a Viernes 8am a 12m-2pm a 6pm -Sabado 9am a 2pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">2. HP Store Corsa  </span><span class="screenReading">2. HP Store Corsa  </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrrera 52 # 76-07 Edif Picasso<br />
Teléfono: 3561883<br />
Correo electronico: hpcorsa.bq@corsa.com.co <br />
Horario:  Lunes a Viernes de 9 am a  12:30 pm y 2pm  a 6 pm-  Sábado de 9 a 1 pm. <br />
Más detalles:  Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<!--<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">3. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span><span class="screenReading">3. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera No. 52 N76-07 Local 1 Edificio Picaso<br />
Teléfono: 3561883<br />
Correo electronico: hayden.meza@corsa.com.co<br />
Horario comercial:  Lunes a Viernes 8am a 12m-2pm a 6pm -Sabado 8am a 1pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>-->
</dl>
</div></div>

</div></div>

<div class="pop_cnt overlay_popup eb-video-popup" id="v7" style="width: 600px;"><div class="cl_box"><a class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20">
Monteria
<div class="fontH4">Tiendas participantes</div>

<div class="js_prog_disc"><div class="left"><div class="prog_disc_icn"><div class="prog-desc-toggle-all"><a href="javascript: void(0);" class="js_prg_dsc_exp lnh16 nud " title="expand all" tabindex="250"><span class="icn_pls_drk">&nbsp;</span></a><a href="javascript: void(0);" class="js_prg_dsc_clp lnh16 nud disabled" title="collapse all" tabindex="250"><span class="icn_mns_drk">&nbsp;</span></a></div></div>
			
            <dl class="js_prg_dsc_prd_root prg_dsc_prd prog-disc">
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">1. HP Store Montería</span><span class="screenReading">1. HP Store Montería</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Calle 44 # 10-91 CC Alameda  del SINU Local B 215<br />
Teléfono: 7851820<br />
Correo electronico: hpcorsa.alamedas@corsa.com.co<br />
Horario: Lunes a Viernes de 8am a 12pm y 2pm a 7pm -  Sábados y Domingos de 9am a 6 pm. <br />
Más detalles:  Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<!--<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">2. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span><span class="screenReading">2. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera 43 No. 50-12 Local 187 C.C. Parque Central<br />
Teléfono: 3514447<br />
Correo electronico: carlos.maestre@corsa.com.co <br />
Horario comercial:  Lunes a Viernes 9am a 6pm - Sabado 9am a 5pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">3. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span><span class="screenReading">3. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera No. 52 N76-07 Local 1 Edificio Picaso<br />
Teléfono: 3561883<br />
Correo electronico: hayden.meza@corsa.com.co<br />
Horario comercial:  Lunes a Viernes 8am a 12m-2pm a 6pm -Sabado 8am a 1pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>-->
</dl>
</div></div>

</div></div>

<div class="pop_cnt overlay_popup eb-video-popup" id="v8" style="width: 600px;"><div class="cl_box"><a class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20">
Bucaramanga
<div class="fontH4">Tiendas participantes</div>

<div class="js_prog_disc"><div class="left"><div class="prog_disc_icn"><div class="prog-desc-toggle-all"><a href="javascript: void(0);" class="js_prg_dsc_exp lnh16 nud " title="expand all" tabindex="250"><span class="icn_pls_drk">&nbsp;</span></a><a href="javascript: void(0);" class="js_prg_dsc_clp lnh16 nud disabled" title="collapse all" tabindex="250"><span class="icn_mns_drk">&nbsp;</span></a></div></div>
			
            <dl class="js_prg_dsc_prd_root prg_dsc_prd prog-disc">
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">1. HP Store HAS </span><span class="screenReading">1. HP Store HAS </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Cra 36 # 46-104 Cabecera<br />
Teléfono: 471515<br />
Correo electronico: info@centrode negocioshp.com<br />
Horario: Lunes a Viernes de 8am a 12pm y de 2 pm a 6 pm- Sábado de 9am a 2 pm. <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<!--<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">2. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span><span class="screenReading">2. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera 43 No. 50-12 Local 187 C.C. Parque Central<br />
Teléfono: 3514447<br />
Correo electronico: carlos.maestre@corsa.com.co <br />
Horario comercial:  Lunes a Viernes 9am a 6pm - Sabado 9am a 5pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">3. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span><span class="screenReading">3. PAPELERIA CORSA Y REPRESENTACIONES LTDA</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera No. 52 N76-07 Local 1 Edificio Picaso<br />
Teléfono: 3561883<br />
Correo electronico: hayden.meza@corsa.com.co<br />
Horario comercial:  Lunes a Viernes 8am a 12m-2pm a 6pm -Sabado 8am a 1pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>-->
</dl>
</div></div>

</div></div>

<div class="pop_cnt overlay_popup eb-video-popup" id="v2" style="width: 600px;"><div class="cl_box"><a class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20">

Medell&iacute;n
<div class="fontH4">Tiendas participantes</div>

<div class="js_prog_disc"><div class="left"><div class="prog_disc_icn"><div class="prog-desc-toggle-all"><a href="javascript: void(0);" class="js_prg_dsc_exp lnh16 nud " title="expand all" tabindex="250"><span class="icn_pls_drk">&nbsp;</span></a><a href="javascript: void(0);" class="js_prg_dsc_clp lnh16 nud disabled" title="collapse all" tabindex="250"><span class="icn_mns_drk">&nbsp;</span></a></div></div>
			
            <dl class="js_prg_dsc_prd_root prg_dsc_prd prog-disc">

<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">1. HP Store  CC Monterrey</span><span class="screenReading">1. HP Store   CC Monterrey</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Calle 48 No 10-45 Locales 301-302-303<br />
Teléfono: 6053026<br />
Correo electronico: tiendahp.medellin@nuevaerasoluciones.com<br />
Horario: Lunes a Sábado 9am a 7pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">2. HP Store DIPARCO </span><span class="screenReading">2. HP Store DIPARCO </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: CC Monterrey loc 317-318<br />
Teléfono: 4441273<br />
Correo electronico: julio.gomez@diparco.com<br />
Horario: Lunes a Sábado 9am a 7pm  <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
</dl>
</div></div>

</div></div>

<div class="pop_cnt overlay_popup eb-video-popup" id="v3" style="width: 600px;"><div class="cl_box"><a class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20">

Bogot&aacute;
<div class="fontH4">Tiendas participantes</div>

<div class="js_prog_disc"><div class="left"><div class="prog_disc_icn"><div class="prog-desc-toggle-all"><a href="javascript: void(0);" class="js_prg_dsc_exp lnh16 nud " title="expand all" tabindex="250"><span class="icn_pls_drk">&nbsp;</span></a><a href="javascript: void(0);" class="js_prg_dsc_clp lnh16 nud disabled" title="collapse all" tabindex="250"><span class="icn_mns_drk">&nbsp;</span></a></div></div>
			
            <dl class="js_prg_dsc_prd_root prg_dsc_prd prog-disc">
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">1. HP Store CASTOR DATA LTDA </span><span class="screenReading">1. HP Store CASTOR DATA LTDA </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera 15 No. 77-05 Local 126 C.C CAT<br />
Teléfono: 7561186 Ext 212-214<br />
Correo electronico: jimmy.samaca@castordata.com.co<br />
Horario comercial:  Lunes a Sábado 9am a 7pm<br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<!--<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">2. HP Store - DISCOVERY Unilago</span><span class="screenReading">2. HP Store - DISCOVERY Unilago</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Calle 79 No. 15 - 45 LOCAL 120<br />
Teléfono: 6913903<br />
Correo electronico: adriana.bautista@discoverycomputer.net.co <br />
Horario comercial: Lunes a Sábado 9am a 7pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">3. HP Store DISCOVERY</span><span class="screenReading">3. HP Store DISCOVERY </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera 15 No. 78 - 05 LOCAL 1- 181<br />
Teléfono: 2185584<br />
Correo electronico: armando.vargas@discoverycomputer.net.co<br />
Horario comercial: Lunes a Sábado 9am a 7pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>-->
<!--<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">4. NUEVA ERA SOLUCIONES LTDA - CC Av. Chile</span><span class="screenReading">4. NUEVA ERA SOLUCIONES LTDA - CC Av. Chile</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Calle 73 No. 10-83 Local 114<br />
Teléfono: 7437928<br />
Correo electronico: tiendahp.avchile@nuevaerasoluciones.com<br />
Horario comercial: Lunes a Sabado 9am a 8pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">5. NUEVA ERA SOLUCIONES LTDA - CC Bulevar Niza</span><span class="screenReading">5. NUEVA ERA SOLUCIONES LTDA - CC Bulevar Niza</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera 52 No. 125 a – 59 LOCAL 104/105<br />
Teléfono: 8050021<br />
Correo electronico: tiendahp.bulevar@nuevaerasoluciones.com<br />
Horario comercial:  Lunes a Domingo 10am a 8pm<br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">6. NUEVA ERA SOLUCIONES LTDA - CC  Centro Mayor</span><span class="screenReading">6. NUEVA ERA SOLUCIONES LTDA - CC  Centro Mayor</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Av. Carrera 27 No. 38A-61 Sur Local 2-173 <br />
Teléfono: 7437221 <br />
Correo electronico: tiendahp.centromayor@nuevaerasoluciones.com<br />
Horario comercial:  Lunes a Viernes 10am a 8pm - Sabado y Domingo 11am a 9pm<br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>-->
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">2. HP Store Unilago</span><span class="screenReading">2. HP Store Unilago</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera 15 No. 78-33 CC Unilago Local 1-132<br />
Teléfono: 7440309<br />
Correo electronico: tiendahp.unilago@nuevaerasoluciones.com<br />
Horario comercial: Lunes a Sábado 9am a 7pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
<!--<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">8. PAPAYA COMPUTER - CC Unilago</span><span class="screenReading">8. PAPAYA COMPUTER - CC Unilago </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Carrera 15 No. 78-05 L1-171 C.C. Unilago<br />
Teléfono: 6218546<br />
Correo electronico: comercial@papayacomputer.com<br />
Horario comercial: Lunes a Sabado 9am a 7pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>-->

</dl>
</div></div>

</div></div>

<div class="pop_cnt overlay_popup eb-video-popup" id="v4" style="width: 600px;"><div class="cl_box"><a class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20">

Cali
<div class="fontH4">Tiendas participantes</div>

<div class="js_prog_disc"><div class="left"><div class="prog_disc_icn"><div class="prog-desc-toggle-all"><a href="javascript: void(0);" class="js_prg_dsc_exp lnh16 nud " title="expand all" tabindex="250"><span class="icn_pls_drk">&nbsp;</span></a><a href="javascript: void(0);" class="js_prg_dsc_clp lnh16 nud disabled" title="collapse all" tabindex="250"><span class="icn_mns_drk">&nbsp;</span></a></div></div>
			
            <dl class="js_prg_dsc_prd_root prg_dsc_prd prog-disc">
<!--<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">1. EH COMPUTERS S.A </span><span class="screenReading">1. EH COMPUTERS S.A </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: CC CHIPICHAPE 2 PISO LOCAL 224 <br />
Teléfono: 4851381<br />
Correo electronico: evictoria@ehcomputer.com<br />
Horario comercial: Lunes a Sabado 10am a 8pm - Domingo 11am a 8pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">2. EH COMPUTERS S.A </span><span class="screenReading">2. EH COMPUTERS S.A  </span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: CC La 14 Pasoancho - Local 114<br />
Teléfono: 4851381<br />
Correo electronico: evictoria@ehcomputer.com<br />
Horario comercial: Lunes a Sabado 11am a 8pm<br />
Más detalles: Limitado a 5 equipos electrónicos, por día. Sin límite para cartuchos vacíos Originales de tóner HP LaserJet.
</div>
</dd>-->
<dt class="prog-disc-item-header "><a class="js_prg_dsc_trg " href="javascript: void(0);" tabindex="250"><span class="prog-disc-icn ">1. HP Store CC Passarella </span><span class="screenReading">1. HP Store CC Passarella</span></a></dt>
                <dd class="prog-disc-item-content  js_prg_dsc_cnt"><div class="content">
Dirección: Av. 5N N23DN-68 Local 185 y 186<br />
Teléfono: 4893354<br />
Correo electronico: tiendahp.cali@nuevaerasoluciones.com<br />
Horario comercial: Lunes a Sábado 9am a 7pm <br />
Más detalles: Limitado a 5 equipos electrónicos, por día por cliente. 10 cartuchos vacíos originales de tóner HP LaserJet.
</div>
</dd>
</dl>
</div></div>

</div></div>
                
<div class="pop_cnt overlay_popup eb-video-popup" id="v5" style="width: 600px;"><div class="cl_box"><a class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20 typography_main">

Detalles del programa
<div class="fontH4 ">Reciclaje accesible y práctico</div>
<div class="m15">Nuestro programa de reciclaje* líder en la industria a nivel mundial, te permite reciclar fácilmente tus equipos electrónicos. Todos los equipos marca HP que recibimos de vuelta pasan por un proceso de reciclaje de varias fases evitando que los mismos vayan a botaderos. </div>
<div class="m15"><strong>Alcance del programa</strong>  <br />
El sistema de reciclaje para productos de HP provee reciclaje libre de costo para computadores de escritorio, computadores portátiles, impresoras y sus accesorios.</div>
<div class="m15"><strong>¿Cómo participar?</strong><br />

<strong>Equipos de Hogar </strong> - Recibimos productos para reciclaje a través del programa de <a href="https://h30248.www3.hp.com/recycle/hardware/cbbco.html">Devolución Directa</a>. Solo para equipo marca HP. Ciertas limitaciones aplican. </div>

<div class="m15"><strong>Pymes y clientes Corporativos</strong> - ofrecemos una variedad de servicios de reciclaje. Estos servicios incluyen: transporte, destrucción de datos, e informes del número de serie. Podemos personalizar nuestro programa para satisfacer tus necesidades de negocio.Para obtener más información y detalles, por favor  <a class="js_overlay_trigger js_pop_close" rel="v6" href="javascript:void(0)">llene este formulario de solicitud</a>.</div>

<div class="m15 divider_bottom divider_grey"></div>

<div class="footnote">*El programa de reciclaje de HP en Colombia fue autorizado por la Autoridad Nacional de Licencias Ambientales (ANLA) en la Resolucion 0255 del 2012 en respuesta de los requerimientos en la Resolucion 1512 del 2010 - &quot;Por la cual se establecen los Sistemas de Recolección Selectiva y Gestión Ambiental de Residuos de Computadores y/o Periféricos y se adoptan otras disposiciones&quot; del MINISTERIO DE AMBIENTE, VIVIENDA Y DESARROLLO TERRITORIAL</div>

</div></div>

<div class="pop_cnt overlay_popup eb-video-popup" id="v6" style="width: 860px;"><div class="cl_box"><a id="v6_close" class="js_pop_close popup_close" href="javascript:void(0);" tabindex="251">&nbsp;</a></div><div class="cnt20">
<iframe id="theform" src="https://hp-qvdtb.formstack.com/forms/espanol" frameborder="0" scrolling="no" width="780" height="690">

</div></div>

    
</body>
</html>